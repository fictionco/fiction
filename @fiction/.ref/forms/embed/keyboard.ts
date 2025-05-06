type KeyOpt = 'command' | 'control' | 'option' | 'shift' | 'none' | string

let lastListener: (e: KeyboardEvent) => void | undefined

export function createKeyboardListener(args: {
  cb: () => unknown
  selectedKey?: KeyOpt
}) {
  const { cb, selectedKey } = args
  const isMac = navigator.platform.toUpperCase().includes('MAC')

  const keyMap: Record<string, string> = {
    command: isMac ? 'Meta' : 'Control',
    control: 'Control',
    option: 'Alt',
    shift: 'Shift',
    none: '',
  }

  // If there's a previous listener, remove it
  if (lastListener)
    window.removeEventListener('keydown', lastListener)

  if (!selectedKey || !keyMap[selectedKey])
    return

  // Verify if the selectedKey exists in the keyMap
  if (!Object.prototype.hasOwnProperty.call(keyMap, selectedKey)) {
    console.error('Invalid shortcut selected')
    return
  }

  const listener = (event: KeyboardEvent) => {
    if (selectedKey === 'none')
      return // If no keyboard shortcut is selected

    // Check for both the special key and 'K' key
    if (event.code === 'KeyK' && event.getModifierState(keyMap[selectedKey]))
      cb()
  }

  // Attach the new listener
  window.addEventListener('keydown', listener)

  // Store the reference to the listener
  lastListener = listener
}

export function displaySymbols(selectedKey?: KeyOpt): { symbol: string, letter: string } | undefined {
  const os = navigator.platform.toUpperCase()
  const isMac = os.includes('MAC')
  const isWin = os.includes('WIN')

  const symbolMap: Record<string, string> = {
    command: isMac ? '⌘' : isWin ? '⊞' : '⌘',
    control: '⌃',
    option: '⌥',
    shift: '⇧',
    none: '',
  }

  if (!selectedKey || selectedKey === 'none' || !symbolMap[selectedKey])
    return

  // Verify if the selectedKey exists in the symbolMap
  if (!Object.prototype.hasOwnProperty.call(symbolMap, selectedKey)) {
    console.error('Invalid shortcut selected')
    return
  }

  const symbols = {
    symbol: symbolMap[selectedKey],
    letter: 'K',
  }

  return symbols
}
