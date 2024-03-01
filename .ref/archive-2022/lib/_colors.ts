export function rgba(rgb: string, opacity = 1): string {
  return `rgba(${rgb}, ${opacity})`
}

export function colorPrimary(opacity = 1, mode?: 'dark' | 'light'): string {
  const base
    = mode === 'dark'
      ? '49, 31, 153'
      : mode === 'light'
        ? '156, 139, 251'
        : '84, 53, 255'

  return `rgba(${base}, ${opacity})`
}

export function colorText(opacity = 1): string {
  return `rgba(209, 216, 226, ${opacity})`
}

export function colorPurple(opacity = 1, dark = false): string {
  const base = dark ? '91, 33, 182' : '124, 58, 237'
  return `rgba(${base}, ${opacity})`
}

export function colorGreen(opacity = 1, dark = false): string {
  const base = dark ? '4, 120, 87' : '16, 185, 129'
  return `rgba(${base}, ${opacity})`
}

export function colorBlue(opacity = 1, dark = false): string {
  const base = dark ? '30, 64, 175' : '59, 130, 246'
  return `rgba(${base}, ${opacity})`
}

export function colorPink(opacity = 1, dark = false): string {
  const base = dark ? '157, 23, 77' : '236, 72, 153'
  return `rgba(${base}, ${opacity})`
}

export function colorYellow(opacity = 1, dark = false): string {
  const base = dark ? '146, 64, 14' : '245, 158, 11'
  return `rgba(${base}, ${opacity})`
}

export function colorOrange(opacity = 1, dark = false): string {
  const base = dark ? '255, 170, 51' : '255, 170, 51'
  return `rgba(${base}, ${opacity})`
}

export function colorRed(opacity = 1, dark = false): string {
  const base = dark ? '153, 27, 27' : '239, 68, 68'
  return `rgba(${base}, ${opacity})`
}

export function colorMulti(): string[] {
  return [
    colorPrimary(),
    colorOrange(),
    colorText(),
    colorGreen(),
    colorBlue(),
    colorPink(),
    colorYellow(),
    colorRed(),
    colorPrimary(1, 'dark'),
    colorGreen(1, true),
    colorBlue(1, true),
    colorPink(1, true),
    colorYellow(1, true),
    colorRed(1, true),
  ]
}

export function getMultiColor(i: number): string {
  const colors = colorMulti()
  const color = colors[i] ? colors[i] : colorPrimary()
  return color
}
