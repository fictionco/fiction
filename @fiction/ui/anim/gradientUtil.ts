type RGB = { r: number, g: number, b: number }
type Lab = { l: number, a: number, b: number }

function hexToRgb(hex: string): RGB {
  const h = hex.replace('#', '')
  return {
    r: Number.parseInt(h.slice(0, 2), 16) / 255,
    g: Number.parseInt(h.slice(2, 4), 16) / 255,
    b: Number.parseInt(h.slice(4, 6), 16) / 255,
  }
}

// Linear sRGB to OKLab
function linearToOklab(rgb: RGB): Lab {
  const l = 0.4122214708 * rgb.r + 0.5363325363 * rgb.g + 0.0514459929 * rgb.b
  const m = 0.2119034982 * rgb.r + 0.6806995451 * rgb.g + 0.1073969566 * rgb.b
  const s = 0.0883024619 * rgb.r + 0.2817188376 * rgb.g + 0.6299787005 * rgb.b

  const l_ = Math.cbrt(l)
  const m_ = Math.cbrt(m)
  const s_ = Math.cbrt(s)

  return {
    l: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
  }
}

// OKLab to linear sRGB
function oklabToRgb(lab: Lab): RGB {
  const l_ = lab.l + 0.3963377774 * lab.a + 0.2158037573 * lab.b
  const m_ = lab.l - 0.1055613458 * lab.a - 0.0638541728 * lab.b
  const s_ = lab.l - 0.0894841775 * lab.a - 1.2914855480 * lab.b

  const l = l_ * l_ * l_
  const m = m_ * m_ * m_
  const s = s_ * s_ * s_

  return {
    r: +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  }
}

function interpolate(a: number, b: number, t: number): number {
  return a * (1 - t) + b * t
}

function lerp(c1: Lab, c2: Lab, t: number): Lab {
  return {
    l: interpolate(c1.l, c2.l, t),
    a: interpolate(c1.a, c2.a, t),
    b: interpolate(c1.b, c2.b, t),
  }
}

export function animate(
  ctx: CanvasRenderingContext2D,
  resolution: number,
  color1: string,
  color2: string,
  speed: number,
  clock: number,
  simplex: SimplexNoise,
): number {
  const imgData = ctx.getImageData(0, 0, resolution, resolution)
  const lab1 = linearToOklab(hexToRgb(color1))
  const lab2 = linearToOklab(hexToRgb(color2))

  for (let x = 0; x < resolution; x++) {
    for (let y = 0; y < resolution; y++) {
      const noise = simplex.noise3D(x / resolution, y / resolution, clock / speed)
      const i = (x + y * resolution) * 4

      // Map noise from [-1,1] to [0,1]
      const t = (noise + 1) / 2
      const color = lerp(lab1, lab2, t)
      const rgb = oklabToRgb(color)

      // Clamp and convert to 8-bit
      imgData.data[i] = Math.max(0, Math.min(255, rgb.r * 255))
      imgData.data[i + 1] = Math.max(0, Math.min(255, rgb.g * 255))
      imgData.data[i + 2] = Math.max(0, Math.min(255, rgb.b * 255))
      imgData.data[i + 3] = 255
    }
  }

  ctx.putImageData(imgData, 0, 0)
  return clock + 1
}

export class SimplexNoise {
  private p: Uint8Array
  private perm: Uint8Array
  private permMod12: Uint8Array
  private grad3: Float32Array

  constructor(randomOrSeed?: (() => number) | string) {
    const random: () => number = typeof randomOrSeed === 'function'
      ? randomOrSeed
      : randomOrSeed
        ? this.alea(randomOrSeed)
        : Math.random

    this.p = this.buildPermutationTable(random)
    this.perm = new Uint8Array(512)
    this.permMod12 = new Uint8Array(512)
    for (let i = 0; i < 512; i++) {
      const o = this.p[i & 255] ?? 0
      this.perm[i] = 0
      this.permMod12[i] = o % 12
    }

    this.grad3 = new Float32Array([1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1])
  }

  noise3D(xin: number, yin: number, zin: number): number {
    const { permMod12, perm, grad3 } = this
    const F3 = 1 / 3
    const G3 = 1 / 6

    const s: number = (xin + yin + zin) * F3
    const i: number = Math.floor(xin + s)
    const j: number = Math.floor(yin + s)
    const k: number = Math.floor(zin + s)
    const t: number = (i + j + k) * G3
    const X0: number = i - t
    const Y0: number = j - t
    const Z0: number = k - t
    const x0: number = xin - X0
    const y0: number = yin - Y0
    const z0: number = zin - Z0

    let i1: number, j1: number, k1: number
    let i2: number, j2: number, k2: number
    if (x0 >= y0) {
      if (y0 >= z0) {
        [i1, j1, k1, i2, j2, k2] = [1, 0, 0, 1, 1, 0]
      }
      else if (x0 >= z0) {
        [i1, j1, k1, i2, j2, k2] = [1, 0, 0, 1, 0, 1]
      }
      else {
        [i1, j1, k1, i2, j2, k2] = [0, 0, 1, 1, 0, 1]
      }
    }
    else {
      if (y0 < z0) {
        [i1, j1, k1, i2, j2, k2] = [0, 0, 1, 0, 1, 1]
      }
      else if (x0 < z0) {
        [i1, j1, k1, i2, j2, k2] = [0, 1, 0, 0, 1, 1]
      }
      else {
        [i1, j1, k1, i2, j2, k2] = [0, 1, 0, 1, 1, 0]
      }
    }

    const x1: number = x0 - i1 + G3
    const y1: number = y0 - j1 + G3
    const z1: number = z0 - k1 + G3
    const x2: number = x0 - i2 + 2 * G3
    const y2: number = y0 - j2 + 2 * G3
    const z2: number = z0 - k2 + 2 * G3
    const x3: number = x0 - 1 + 3 * G3
    const y3: number = y0 - 1 + 3 * G3
    const z3: number = z0 - 1 + 3 * G3

    const ii: number = i & 255
    const jj: number = j & 255
    const kk: number = k & 255

    const calculateNoise = (t: number, gi: number, x: number, y: number, z: number): number => {
      if (t < 0)
        return 0
      t *= t
      return t * t * ((grad3[gi] ?? 0) * x + (grad3[gi + 1] ?? 0) * y + (grad3[gi + 2] ?? 0) * z)
    }

    const getGi = (i: number, j: number, k: number): number => {
      const index = ii + i + (perm[jj + j + (perm[kk + k] ?? 0)] ?? 0)
      return (permMod12[index] ?? 0) * 3
    }

    const t0: number = 0.6 - x0 * x0 - y0 * y0 - z0 * z0
    const gi0: number = getGi(0, 0, 0)
    const n0 = calculateNoise(t0, gi0, x0, y0, z0)

    const t1: number = 0.6 - x1 * x1 - y1 * y1 - z1 * z1
    const gi1: number = getGi(i1, j1, k1)
    const n1 = calculateNoise(t1, gi1, x1, y1, z1)

    const t2: number = 0.6 - x2 * x2 - y2 * y2 - z2 * z2
    const gi2: number = getGi(i2, j2, k2)
    const n2 = calculateNoise(t2, gi2, x2, y2, z2)

    const t3: number = 0.6 - x3 * x3 - y3 * y3 - z3 * z3
    const gi3: number = getGi(1, 1, 1)
    const n3 = calculateNoise(t3, gi3, x3, y3, z3)

    return 32 * (n0 + n1 + n2 + n3)
  }

  private buildPermutationTable(random: () => number): Uint8Array {
    const p: Uint8Array = new Uint8Array(256)
    for (let i = 0; i < 256; i++) {
      p[i] = i
    }
    for (let i = 0; i < 255; i++) {
      const r: number = i + ~~(random() * (256 - i))
      const aux: number = p[i] ?? 0
      p[i] = p[r] ?? 0
      p[r] = aux
    }
    return p
  }

  private alea(...args: string[]): () => number {
    const masher = (): (data: string) => number => {
      let n = 0xEFC8249D
      return (data: string): number => {
        for (let i = 0; i < data.length; i++) {
          n += data.charCodeAt(i)
          let h = 0.02519603282416938 * n
          n = h >>> 0
          h -= n
          h *= n
          n = h >>> 0
          h -= n
          n += h * 0x100000000
        }
        return (n >>> 0) * 2.3283064365386963e-10
      }
    }

    let s0 = 0
    let s1 = 0
    let s2 = 0
    let c = 1

    const mash = masher()
    s0 = mash(' ')
    s1 = mash(' ')
    s2 = mash(' ')

    for (const arg of args) {
      s0 -= mash(arg)
      if (s0 < 0)
        s0 += 1
      s1 -= mash(arg)
      if (s1 < 0)
        s1 += 1
      s2 -= mash(arg)
      if (s2 < 0)
        s2 += 1
    }

    return (): number => {
      const t = 2091639 * s0 + c * 2.3283064365386963e-10
      s0 = s1
      s1 = s2
      return s2 = t - (c = t | 0)
    }
  }
}
