const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

class MemoryKV {
  constructor() { this.store = new Map(); }
  async get(key) { return this.store.has(key) ? this.store.get(key) : null; }
  async put(key, value) { this.store.set(key, String(value)); }
  keys() { return Array.from(this.store.keys()).sort(); }
}

function loadWorker() {
  const code = fs.readFileSync('movecar.js', 'utf8');
  const kv = new MemoryKV();
  const sent = { telegram: [], email: [], pushplus: [], bark: [] };

  const sandbox = {
    console,
    URL,
    URLSearchParams,
    Request,
    Response,
    Headers,
    crypto,
    addEventListener: () => {},
    MOVE_CAR_STATUS: kv,
    TG_BOT_TOKEN: 'test-token',
    TG_CHAT_ID: 'test-chat',
    EMAIL_TO: 'owner@example.com',
    EMAIL_FROM: 'MoveCar <noreply@example.com>',
    RESEND_API_KEY: 'test-resend-key',
    PUSHPLUS_TOKEN: 'test-pushplus-token',
    DEBUG_KEY: 'debug-test-key',
    fetch: async (url, init = {}) => {
      const target = String(url);
      if (target.includes('api.telegram.org')) sent.telegram.push({ url: target, init });
      else if (target.includes('api.resend.com')) sent.email.push({ url: target, init });
      else if (target.includes('pushplus.plus')) sent.pushplus.push({ url: target, init });
      return new Response(JSON.stringify({ ok: true, code: 200, id: 'mock-id' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return { sandbox, kv, sent };
}

async function json(res) {
  return JSON.parse(await res.text());
}

async function postNotify(worker, message, lat, lng, clientId = 'client-a') {
  const res = await worker.sandbox.handleRequest(new Request('https://movecar.test/api/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, location: { lat, lng }, clientId })
  }));
  assert.strictEqual(res.status, 200);
  return json(res);
}

function extractConfirmUrl(worker, index = 0) {
  const body = JSON.parse(worker.sent.telegram[index].init.body);
  const match = body.text.match(/href="([^"]+)"[^>]*>点击确认挪车/);
  assert(match, 'telegram message should contain owner confirm url');
  return new URL(match[1].replace(/&amp;/g, '&'));
}

async function run() {
  {
    const worker = loadWorker();
    const first = await postNotify(worker, '第一辆车', 39.9, 116.3, 'client-a');
    const second = await postNotify(worker, '第二辆车', 31.2, 121.4, 'client-b');

    assert(first.requestId, 'notify response should include requestId');
    assert(second.requestId, 'notify response should include requestId');
    assert.notStrictEqual(first.requestId, second.requestId, 'each notify request must get unique requestId');

    const firstStatus = await json(await worker.sandbox.handleRequest(new Request(`https://movecar.test/api/check-status?id=${first.requestId}`)));
    const secondStatus = await json(await worker.sandbox.handleRequest(new Request(`https://movecar.test/api/check-status?id=${second.requestId}`)));
    assert.strictEqual(firstStatus.status, 'waiting');
    assert.strictEqual(secondStatus.status, 'waiting');

    const firstLocation = await json(await worker.sandbox.handleRequest(new Request(`https://movecar.test/api/get-location?id=${first.requestId}`)));
    const secondLocation = await json(await worker.sandbox.handleRequest(new Request(`https://movecar.test/api/get-location?id=${second.requestId}`)));
    assert.strictEqual(firstLocation.lat, 39.9);
    assert.strictEqual(secondLocation.lat, 31.2);
  }

  {
    const worker = loadWorker();
    const notify = await postNotify(worker, '需要挪车', 39.9, 116.3);
    const confirmUrl = extractConfirmUrl(worker);
    assert.strictEqual(confirmUrl.searchParams.get('id'), notify.requestId, 'confirm URL should carry requestId');
    assert(confirmUrl.searchParams.get('token'), 'confirm URL should carry one-time token');

    const bad = await worker.sandbox.handleRequest(new Request('https://movecar.test/api/owner-confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId: notify.requestId, token: 'wrong-token', location: { lat: 40, lng: 116 }, eta: '3分钟' })
    }));
    assert.strictEqual(bad.status, 403, 'owner confirm must reject invalid token');

    const good = await worker.sandbox.handleRequest(new Request('https://movecar.test/api/owner-confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId: notify.requestId, token: confirmUrl.searchParams.get('token'), location: { lat: 40, lng: 116 }, eta: '约3分钟' })
    }));
    assert.strictEqual(good.status, 200);

    const status = await json(await worker.sandbox.handleRequest(new Request(`https://movecar.test/api/check-status?id=${notify.requestId}`)));
    assert.strictEqual(status.status, 'confirmed');
    assert.strictEqual(status.eta, '约3分钟');
    assert.strictEqual(status.ownerLocation, null, 'requester should not receive owner location');
  }

  {
    const worker = loadWorker();
    const clientId = 'annoying-client';
    const notify = await postNotify(worker, '恶意反复扫码', 39.9, 116.3, clientId);
    const confirmUrl = extractConfirmUrl(worker);

    const block = await worker.sandbox.handleRequest(new Request('https://movecar.test/api/block-client', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId: notify.requestId, token: confirmUrl.searchParams.get('token') })
    }));
    assert.strictEqual(block.status, 200, 'owner should be able to block requester from confirm page');

    const blockedNotify = await worker.sandbox.handleRequest(new Request('https://movecar.test/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '继续骚扰', location: { lat: 39.9, lng: 116.3 }, clientId })
    }));
    assert.strictEqual(blockedNotify.status, 403, 'blocked client should not be able to notify again');
    const blockedBody = await json(blockedNotify);
    assert.strictEqual(blockedBody.error, '此设备已被车主拉黑');
  }

  console.log('✅ movecar product-flow tests passed');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
