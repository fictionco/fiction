declare global {
  interface Window {
    Prism: {
      highlightAllUnder: (el: HTMLElement | undefined) => void
    }
  }
}

export default {}
