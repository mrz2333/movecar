const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const worker = fs.readFileSync('movecar.js', 'utf8');
const match = worker.match(/<script>\n([\s\S]*?)\n    <\/script>/);
assert(match, 'main page script should be present');
const script = match[1];

function createClassList() {
  const set = new Set();
  return {
    add: (name) => set.add(name),
    remove: (name) => set.delete(name),
    contains: (name) => set.has(name),
  };
}

function el(initial = {}) {
  return {
    innerText: '',
    innerHTML: '',
    classList: createClassList(),
    getAttribute: () => null,
    ...initial,
  };
}

const elements = {
  phoneBtn: el({ getAttribute: (name) => (name === 'href' ? 'tel:10086' : null) }),
  toast: el(),
  ownerFeedback: el(),
  ownerFeedbackIcon: el({ innerText: '🎉' }),
  ownerFeedbackTitle: el({ innerText: '车主已收到通知' }),
  ownerFeedbackText: el({ innerText: '正在赶来，请在车旁稍等' }),
  waitingText: el({ innerText: '正在等待车主回应...' }),
  actionHint: el({ innerText: '车主暂未回应时，可再次提醒' }),
  retryBtn: el({ style: {} }),
};

elements.ownerFeedback.classList.add('hidden');

let now = 0;
let nextTimerId = 1;
const timers = new Map();
let statusResponse = { status: 'waiting' };

function setFakeTimeout(fn, delay) {
  const id = nextTimerId++;
  timers.set(id, { fn, at: now + delay, cleared: false });
  return id;
}

function clearFakeTimeout(id) {
  const timer = timers.get(id);
  if (timer) timer.cleared = true;
}

async function advance(ms) {
  now += ms;
  const due = [...timers.entries()]
    .filter(([, timer]) => !timer.cleared && timer.at <= now)
    .sort((a, b) => a[1].at - b[1].at);
  for (const [id, timer] of due) {
    timer.cleared = true;
    await timer.fn();
    timers.delete(id);
  }
}

const sandbox = {
  console,
  window: {},
  localStorage: { getItem: () => null, setItem: () => {} },
  document: { getElementById: (id) => elements[id] || null },
  navigator: {},
  fetch: async () => ({ json: async () => statusResponse }),
  setTimeout: setFakeTimeout,
  clearTimeout: clearFakeTimeout,
  setInterval: () => 0,
  clearInterval: () => {},
  confirm: () => true,
};
vm.createContext(sandbox);
vm.runInContext(script, sandbox);

(async () => {
  vm.runInContext("activeRequestId = 'req-test'", sandbox);

  statusResponse = { status: 'waiting' };
  sandbox.scheduleEmergencyPhone();
  await advance(179999);
  assert.strictEqual(elements.phoneBtn.classList.contains('show'), false, 'phone should stay hidden before 3 minutes');
  await advance(1);
  assert.strictEqual(elements.phoneBtn.classList.contains('show'), true, 'phone should show after 3 minutes without owner response');

  sandbox.scheduleEmergencyPhone();
  await advance(60000);
  sandbox.markOwnerResponded();
  await advance(120000);
  assert.strictEqual(elements.phoneBtn.classList.contains('show'), false, 'phone should not show after owner responded before timeout');

  sandbox.scheduleEmergencyPhone();
  sandbox.scheduleEmergencyPhone();
  statusResponse = { status: 'waiting' };
  await advance(180000);
  assert.strictEqual(elements.phoneBtn.classList.contains('show'), true, 'rescheduled phone timer should still show after 3 minutes');

  sandbox.scheduleEmergencyPhone();
  statusResponse = { status: 'rejected', ownerReply: '我马上到，请稍等' };
  await advance(180000);
  assert.strictEqual(elements.phoneBtn.classList.contains('show'), false, 'phone should not flash when latest status is rejected');
  assert.strictEqual(elements.ownerFeedbackIcon.innerText, '⚠️');
  assert.strictEqual(elements.ownerFeedbackTitle.innerText, '车主反馈：车码可能不匹配');
  assert.strictEqual(elements.ownerFeedbackText.innerText, '这可能不是对应车辆，请核对车牌、车辆位置和二维码');
  assert.strictEqual(elements.waitingText.innerText, '车主反馈：车码可能不匹配 ⚠️');
  assert.strictEqual(elements.actionHint.innerText, '请先核对车牌、车辆位置和二维码；确认无误后可重新扫码提交');
  assert.strictEqual(elements.retryBtn.style.display, 'none');
  assert.strictEqual(elements.ownerFeedback.classList.contains('hidden'), false);

  console.log('✅ frontend emergency phone timer tests passed');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
