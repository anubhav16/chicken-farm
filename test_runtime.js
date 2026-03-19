// Runtime smoke test for chicken_farm.html
// Tests that the game script loads and runs without external dependencies (CDN, Mixpanel)
// Usage: node test_runtime.js

const fs = require('fs');
const vm = require('vm');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'chicken_farm.html'), 'utf8');

// Find the main game <script> block (not CDN script tags)
const re = /<script[^>]*>/g;
let scriptStart = -1;
let m;
while ((m = re.exec(html)) !== null) {
  if (!m[0].includes('src=')) { scriptStart = m.index + m[0].length; break; }
}
const scriptEnd = html.indexOf('</script>', scriptStart);
const gameScript = html.substring(scriptStart, scriptEnd).trim();

// Minimal DOM stubs — enough for game init, not for rendering
const me = {
  style: {}, textContent: '', innerHTML: '', className: '', width: 100, height: 100,
  classList: { add(){}, remove(){}, toggle(){}, contains(){ return false; } },
  querySelector(){ return me; }, querySelectorAll(){ return []; },
  appendChild(){ return me; }, removeChild(){}, addEventListener(){}, remove(){},
  insertAdjacentHTML(){}, getBoundingClientRect(){ return { width: 100, height: 100, top: 0, left: 0 }; },
  parentNode: null,
  getContext(){ return new Proxy({}, { get(){ return function(){ return { width: 10 }; }; } }); },
};

const sandbox = {
  document: {
    getElementById(){ return me; },
    querySelector(){ return me; },
    querySelectorAll(){ return []; },
    createElement(){ return { ...me, onclick: null, parentNode: null }; },
    addEventListener(){},
  },
  window: { AudioContext: function(){}, webkitAudioContext: function(){}, addEventListener(){}, innerWidth: 800, innerHeight: 600 },
  localStorage: { getItem(){ return null; }, setItem(){} },
  sessionStorage: { getItem(){ return null; }, setItem(){} },
  navigator: { userAgent: 'test' },
  Image: function(){},
  setInterval: () => 1, clearInterval: () => {},
  setTimeout: (fn, ms) => 1,
  location: { reload(){} },
  console, Date, Math, JSON, parseInt, parseFloat, isNaN, isFinite,
  btoa: (s) => Buffer.from(String(s)).toString('base64'),
  atob: (s) => Buffer.from(String(s), 'base64').toString(),
  Proxy, Object, Array, String, Number, Boolean, Map, Set, RegExp,
  Error, TypeError, RangeError, ReferenceError,
  encodeURIComponent, decodeURIComponent,
  Promise, Symbol,
  // NO mixpanel — deliberately missing to test CDN failure resilience
};

console.log('=== Chicken Farm Runtime Smoke Test ===');
console.log('Script length:', gameScript.length, 'chars');
console.log('Mixpanel global: MISSING (simulating CDN blocked)\n');

let passed = 0;
let failed = 0;

function check(name, fn) {
  try {
    const result = fn();
    if (result === false) throw new Error('returned false');
    console.log('  ✅', name);
    passed++;
  } catch (e) {
    console.log('  ❌', name, '—', e.message);
    failed++;
  }
}

try {
  vm.createContext(sandbox);
  vm.runInContext(gameScript, sandbox, { filename: 'chicken_farm.js', timeout: 5000 });
  console.log('✅ Game script loaded without crash\n');
  passed++;

  console.log('Function checks:');
  check('startGame exists', () => typeof sandbox.startGame === 'function');
  check('mpTrack exists', () => typeof sandbox.mpTrack === 'function');
  check('mpEngage exists', () => typeof sandbox.mpEngage === 'function');
  check('getEggPrice exists', () => typeof sandbox.getEggPrice === 'function');
  check('advanceDay exists', () => typeof sandbox.advanceDay === 'function');
  check('sellEggs exists', () => typeof sandbox.sellEggs === 'function');
  check('buyHen exists', () => typeof sandbox.buyHen === 'function');
  check('checkForRandomEvent exists', () => typeof sandbox.checkForRandomEvent === 'function');

  console.log('\nRuntime checks:');
  check('mpTrack() safe no-op', () => { sandbox.mpTrack('test', {}); return true; });
  check('mpEngage() safe no-op', () => { sandbox.mpEngage({ '$set': { x: 1 } }); return true; });
  check('getEggPrice() returns number', () => typeof sandbox.getEggPrice() === 'number' && sandbox.getEggPrice() > 0);

} catch (e) {
  console.log('❌ CRASH:', e.message);
  failed++;
  const lineMatch = e.stack.match(/chicken_farm\.js:(\d+)/);
  if (lineMatch) {
    const n = parseInt(lineMatch[1]);
    console.log('   Line', n, ':', gameScript.split('\n')[n - 1]?.trim().substring(0, 100));
  }
}

console.log('\n=== Results: ' + passed + ' passed, ' + failed + ' failed ===');
process.exit(failed > 0 ? 1 : 0);
