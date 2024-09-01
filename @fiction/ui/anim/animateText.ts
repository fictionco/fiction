import anime from 'animejs'
import type { ColorTheme, ColorThemeUser } from '@fiction/core'
import { getColorScheme } from '@fiction/core'

type UnderlineShape = 'line' | 'squiggle' | 'circle' | 'scribble'

interface AnimateUnderlineArgs {
  el?: HTMLElement
  color?: ColorThemeUser
  strokeWidth?: number
  animationDuration?: number
  opacity?: number
}

export function animateUnderline({
  el = document.body,
  color = 'primary',
  strokeWidth = 4,
  animationDuration = 2000,
  opacity = 0.7,
}: AnimateUnderlineArgs = {}) {
  const elements = el.querySelectorAll('[data-text-effect]')

  elements.forEach((elem) => {
    const element = elem as HTMLElement

    if (element.classList.contains('underline-processed')) {
      return
    }

    element.classList.add('underline-processed')

    const shape = (element.getAttribute('data-effect-type') || 'line') as UnderlineShape
    const effectColor = element.getAttribute('data-effect-color') || color
    const effectOpacity = Number.parseFloat(element.getAttribute('data-effect-opacity') || opacity.toString())
    const svg = createSVG(shape, element, effectColor, strokeWidth, effectOpacity)

    // Wrap the content of the element
    const wrapper = document.createElement('span')
    wrapper.style.position = 'relative'
    wrapper.style.zIndex = '1'
    wrapper.style.display = 'inline-block'
    wrapper.style.whiteSpace = 'nowrap'
    while (element.firstChild) {
      wrapper.appendChild(element.firstChild)
    }
    element.appendChild(wrapper)

    // Position the SVG
    element.style.position = 'relative'
    element.style.display = 'inline-block'
    svg.style.position = 'absolute'
    svg.style.left = shape === 'circle' ? '-5%' : '0'
    svg.style.top = shape === 'circle' ? '-25%' : 'auto'
    svg.style.bottom = shape === 'circle' ? 'auto' : '-0.3em'
    svg.style.width = shape === 'circle' ? '110%' : '100%'
    svg.style.height = shape === 'circle' ? '150%' : '0.4em'
    svg.style.overflow = 'visible'
    svg.style.zIndex = '0'
    element.appendChild(svg)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const path = svg.querySelector('path')
            if (path) {
              const length = path.getTotalLength()
              path.style.strokeDasharray = length.toString()
              path.style.strokeDashoffset = length.toString()
              requestAnimationFrame(() => animatePath(path, animationDuration))
            }
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 },
    )

    observer.observe(element)
  })
}

function getColorValue(color: string, opacity: number): string {
  if (color === 'primary' || color === 'theme') {
    return `rgba(var(--${color}-500) / ${opacity})`
  }
  const colorScheme = getColorScheme(color as ColorTheme, { outputFormat: 'rgb' })
  return `rgba(${colorScheme[500]} / ${opacity})`
}

function createSVG(shape: UnderlineShape, element: HTMLElement, color: string, strokeWidth: number, opacity: number): SVGElement {
  const svgNS = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(svgNS, 'svg')
  svg.setAttribute('class', `${shape}-underline`)
  svg.setAttribute('role', 'presentation')
  svg.setAttribute('preserveAspectRatio', 'none')

  const path = document.createElementNS(svgNS, 'path')
  path.setAttribute('fill', 'none')
  path.setAttribute('stroke', getColorValue(color, opacity))
  path.setAttribute('stroke-width', strokeWidth.toString())
  path.setAttribute('vector-effect', 'non-scaling-stroke')
  path.setAttribute('stroke-linecap', 'round') // Add this line to round the stroke caps

  if (shape === 'circle') {
    path.setAttribute('stroke-linejoin', 'miter')
    path.setAttribute('fill-opacity', '0')
    path.setAttribute('stroke-miterlimit', '4')
    path.setAttribute('stroke-opacity', opacity.toString())
    path.setAttribute('transform', 'matrix(0.9791300296783447,0,0,0.9791300296783447,400,179)')
  }

  const { viewBox, d } = getShapeAttributes(shape)
  svg.setAttribute('viewBox', viewBox)
  path.setAttribute('d', d)

  // Set initial state to invisible
  const length = path.getTotalLength()
  path.style.strokeDasharray = length.toString()
  path.style.strokeDashoffset = length.toString()

  svg.appendChild(path)
  return svg
}

function getShapeAttributes(shape: UnderlineShape): { viewBox: string, d: string } {
  switch (shape) {
    case 'line':
      return {
        viewBox: '-400 -55 730 60',
        d: 'm -390.25 -14 c 50 -5 150 -15 293.25 -20 c 100 -3 250 0 401 10',
      }
    case 'squiggle':
      return {
        viewBox: '-347 -30.1947 694 96.19',
        d: 'M-335,54 C-335,54 -171,-58 -194,-3 C-217,52 -224.1199951171875,73.552001953125 -127,11 C-68,-27 -137,50 -33,42 C31.43899917602539,37.042999267578125 147.14700317382812,-29.308000564575195 335,2',
      }
    case 'circle':
      return {
        viewBox: '0 0 800 350',
        d: 'M253,-161 C253,-161 -284.78900146484375,-201.4600067138672 -376,-21 C-469,163 67.62300109863281,174.2100067138672 256,121 C564,34 250.82899475097656,-141.6929931640625 19.10700035095215,-116.93599700927734',
      }
    case 'scribble':
      return {
        viewBox: '-320 -70.8161 640.4 59.82',
        d: 'M-300,-56 C-50,-72 298,-65 300,-59 C332,-53 -239,-36 -255,-27 C-271,-18 -88,-24 91,-20',
      }
    default:
      return {
        viewBox: '-400 -55 730 60',
        d: 'm -383.25 -6 c 55.25 -22 130.75 -33.5 293.25 -38 c 54.5 -0.5 195 -2.5 401 15',
      }
  }
}

function animatePath(path: SVGPathElement, duration: number) {
  const length = path.getTotalLength()

  anime({
    targets: path,
    strokeDashoffset: [length, 0],
    easing: 'easeInOutCubic',
    duration,
    delay: 700,
    loop: false,
  })
}

export default animateUnderline
