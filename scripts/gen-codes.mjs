// Access-code generator for Permit Legends.
// Codes: LEGEND-XXXX-XXXX where weighted char sum % 97 === 55.
// Usage: node scripts/gen-codes.mjs [count]
const N = parseInt(process.argv[2] || '25', 10);
const CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no 0/O/1/I/L
const valid = (body) => body.split('').reduce((a, ch) => a + ch.charCodeAt(0) * 7, 0) % 97 === 55;
const rand = () => Array.from({ length: 8 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('');
const out = new Set();
while (out.size < N) {
  const b = rand();
  if (valid(b)) out.add(`LEGEND-${b.slice(0,4)}-${b.slice(4)}`);
}
console.log([...out].join('\n'));
