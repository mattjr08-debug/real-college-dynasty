// How many things may run at once, chosen from how busy the Mac is right now (the 1-minute load average).
//   quiet (under 3):      3 tests side by side, 3 browser windows inside the screen-fit test
//   busy (3 to 9):        2 and 2
//   overloaded (over 9):  1 and 1  (extra browsers only fight for the CPU and make tests time out)
const os = require('os');
function pick() {
  const load = os.loadavg()[0], cores = os.cpus().length, cap = Math.max(1, Math.min(3, Math.floor(cores / 2)));
  const level = load < 3 ? 'quiet' : load < 9 ? 'busy' : 'overloaded', n = level === 'quiet' ? cap : level === 'busy' ? Math.min(2, cap) : 1;
  return { load: +load.toFixed(1), cores, level, tests: n, browsers: n };
}
module.exports = { pick };
if (require.main === module) console.log(JSON.stringify(pick()));
