const fs = require('fs');
const RAD = Math.PI / 180;
const K = 0.985;                    // running clearance: rotors 1.5% under nominal
const N = 168;                      // samples per profile

// r(t) = a + b*cos(n*t). Rmax = a+b, Rmin = a-b, centre distance d = 2a,
// bore = two circles of radius Rmax at x = +/- a. Rmax is held at 100 for every
// type so the four diagrams are directly comparable.
const TYPES = [
  { key: 'single', n: 1,  a: 68, b: 32 },
  { key: 'bi',     n: 2,  a: 74, b: 26 },
  { key: 'tri',    n: 3,  a: 80, b: 20 },
  { key: 'multi',  n: 12, a: 92, b: 8  },
];

function profile(n, a, b, cx, phaseDeg, count = N) {
  const pts = [];
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const r = (a + b * Math.cos(n * (t - phaseDeg * RAD))) * K;
    pts.push([cx + r * Math.cos(t), r * Math.sin(t)]);
  }
  return pts;
}
const toPath = (p) => 'M' + p.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L') + 'Z';

let out = `/**
 * Generated rotor geometry. Do not hand-edit. Regenerate with tools/rotors.js.
 *
 * Every profile is r(t) = a + b*cos(n*t), the same family at four lobe counts,
 * which is why the four diagrams read as one product family rather than four
 * unrelated drawings. Rmax is held at 100 throughout so the bores match.
 *
 * A rotor pair only meshes if the second rotor presents a root where the first
 * presents a tip. For an odd lobe count that happens with no phase offset; for
 * an even count the second rotor is indexed by 180/n degrees. The phase below
 * was solved numerically, and the clearances are measured, not assumed.
 */

export type RotorKey = 'single' | 'bi' | 'tri' | 'multi'

export type RotorGeometry = {
  key: RotorKey
  /** Lobe count. */
  lobes: number
  /** Bore centres at -+centre, each of radius \`bore\`. */
  centre: number
  bore: number
  /** Union outline of the two bore circles. */
  borePath: string
  left: string
  right: string
}

export const ROTORS: Record<RotorKey, RotorGeometry> = {
`;

for (const { key, n, a, b } of TYPES) {
  const Rmax = a + b, d = 2 * a;
  // Solve the indexing phase numerically rather than trusting the closed form.
  let best = null;
  for (let phase = 0; phase < 360 / n + 0.001; phase += 0.25) {
    const A = profile(n, a, b, -a, 0, 720), B = profile(n, a, b, a, phase, 720);
    let min = Infinity;
    for (const p of A) for (const q of B) {
      const dist = Math.hypot(p[0] - q[0], p[1] - q[1]);
      if (dist < min) min = dist;
      if (min < 0.5) break;
    }
    if (!best || min > best.min) best = { phase, min };
  }

  const yInt = Math.sqrt(Rmax * Rmax - a * a);
  const borePath = `M0 ${-yInt.toFixed(1)}A${Rmax} ${Rmax} 0 1 0 0 ${yInt.toFixed(1)}A${Rmax} ${Rmax} 0 1 0 0 ${-yInt.toFixed(1)}Z`;

  console.log(`${key.padEnd(7)} n=${String(n).padStart(2)}  Rmax ${Rmax}  Rmin ${a - b}  d ${d}  phase ${best.phase.toFixed(2)}deg  clearance ${best.min.toFixed(2)}  tip-to-bore ${(Rmax - Rmax * K).toFixed(2)}`);
  if (best.min < 1) throw new Error(`${key}: rotors collide (clearance ${best.min.toFixed(2)})`);

  out += `  ${key}: {
    key: '${key}',
    lobes: ${n},
    centre: ${a},
    bore: ${Rmax},
    borePath:
      '${borePath}',
    left:
      '${toPath(profile(n, a, b, -a, 0))}',
    right:
      '${toPath(profile(n, a, b, a, best.phase))}',
  },
`;
}
out += '}\n';
fs.mkdirSync('components/graphics', { recursive: true });
fs.writeFileSync('components/graphics/rotors.ts', out);
console.log('\nwrote components/graphics/rotors.ts', fs.statSync('components/graphics/rotors.ts').size, 'bytes');
