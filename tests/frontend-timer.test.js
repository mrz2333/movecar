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

const elements = {
  phoneBtn: {
    classList: createClassList(),
    getAttribute: (name) => (name === 'href' ? 'tel:10086' : null),
  },
  toast: {
    innerText: '',
    classList: createClassList(),
  },
};

let now = 0;
let nextTimerId = 1;
const timers = new Map();

function setFakeTimeout(fn, delay) {
  const id = nextTimerId++;
  timers.set(id, { fn, at: now + delay, cleared: false });
  return id;
}

function clearFakeTimeout(id) {
  const timer = timers.get(id);
  if (timer) timer.cleared = true;
}

function advance(ms) {
  now += ms;
  const due = [...timers.entries()]
    .filter(([, timer]) => !timer.cleared && timer.at <= now)
    .sort((a, b) => a[1].at - b[1].at);
  for (const [id, timer] of due) {
    timer.cleared = true;
    timer.fn();
    timers.delete(id);
  }
}

const sandbox = {
  console,
  window: {},
  localStorage: { getItem: () => null, setItem: () => {} },
  document: { getElementById: (id) => elements[id] || null },
  navigator: {},
  setTimeout: setFakeTimeout,
  clearTimeout: clearFakeTimeout,
  setInterval: () => 0,
  clearInterval: () => {},
  confirm: () => true,
};
vm.createContext(sandbox);
vm.runInContext(script, sandbox);

sandbox.scheduleEmergencyPhone();
advance(179999);
assert.strictEqual(elements.phoneBtn.classList.contains('show'), false, 'phone should stay hidden before 3 minutes');
advance(1);
assert.strictEqual(elements.phoneBtn.classList.contains('show'), true, 'phone should show after 3 minutes without owner response');

sandbox.scheduleEmergencyPhone();
advance(60000);
sandbox.markOwnerResponded();
advance(120000);
assert.strictEqual(elements.phoneBtn.classList.contains('show'), false, 'phone should not show after owner responded before timeout');

sandbox.scheduleEmergencyPhone();
sandbox.scheduleEmergencyPhone();
advance(180000);
assert.strictEqual(elements.phoneBtn.classList.contains('show'), true, 'rescheduled phone timer should still show after 3 minutes');

console.log('✅ frontend emergency phone timer tests passed');
