import type { ColorTheme, ColorThemeUser } from '@fiction/core'
import { getColorScheme } from '@fiction/core'
import anime from 'animejs'

type UnderlineShape = 'line' | 'squiggle' | 'circle' | 'scribble' | 'brush' | 'marker'

interface AnimateUnderlineArgs {
  el?: HTMLElement
  color?: ColorThemeUser
  strokeWidth?: number
  animationDuration?: number
  opacity?: number
  triggerOnce?: boolean
  stagger?: number
}

export function animateUnderline({
  el = document.body,
  color = 'primary',
  strokeWidth = 3,
  animationDuration = 1500,
  opacity = 0.8,
  triggerOnce = true,
  stagger = 200,
}: AnimateUnderlineArgs = {}) {
  const elements = el.querySelectorAll('[data-text-effect]')

  elements.forEach((elem, index) => {
    const element = elem as HTMLElement

    if (triggerOnce && element.classList.contains('underline-processed')) {
      return
    }

    const shape = (element.getAttribute('data-effect-type') || 'line') as UnderlineShape
    const effectColor = element.getAttribute('data-effect-theme') || color
    const effectOpacity = Number.parseFloat(element.getAttribute('data-effect-opacity') || opacity.toString())
    const customWidth = Number.parseFloat(element.getAttribute('data-effect-width') || strokeWidth.toString())

    const svg = createSVG({ shape, element, color: effectColor, strokeWidth: customWidth, opacity: effectOpacity })

    setupElement({ element, svg, shape })

    if (triggerOnce) {
      element.classList.add('underline-processed')
    }

    createIntersectionObserver({
      element,
      svg,
      animationDuration,
      index: triggerOnce ? index : 0,
      stagger,
    })
  })
}

function setupElement({ element, svg, shape }: {
  element: HTMLElement
  svg: SVGElement
  shape: UnderlineShape
}) {
  // Create wrapper for content
  const wrapper = document.createElement('span')
  wrapper.className = 'relative z-[1] inline-block whitespace-nowrap'

  while (element.firstChild) {
    wrapper.appendChild(element.firstChild)
  }
  element.appendChild(wrapper)

  // Position container and SVG
  element.className = `${element.className} relative inline-block`

  const positions = getShapePositions(shape)
  Object.assign(svg.style, {
    position: 'absolute',
    zIndex: '0',
    overflow: 'visible',
    pointerEvents: 'none',
    ...positions,
  })

  element.appendChild(svg)
}

function getShapePositions(shape: UnderlineShape): Record<string, string> {
  const positions: Record<UnderlineShape | 'default', Record<string, string>> = {
    circle: { left: '-5%', top: '-25%', width: '110%', height: '150%' },
    brush: { left: '-2%', bottom: '-0.2em', width: '104%', height: '0.5em' },
    marker: { left: '-1%', bottom: '-0.15em', width: '102%', height: '0.6em' },
    line: { left: '0', bottom: '0.05em', width: '100%', height: '0.3em' },
    squiggle: { left: '0', bottom: '-0.2em', width: '100%', height: '0.4em' },
    scribble: { left: '0', bottom: '-0.1em', width: '100%', height: '0.4em' },
    default: { left: '0', bottom: '0.05em', width: '100%', height: '0.3em' },
  }

  return positions[shape] || positions.default
}

function getColorValue(color: string, opacity: number): string {
  if (color === 'primary' || color === 'theme') {
    return `rgb(from var(--color-${color}-500) r g b / ${opacity})`
  }

  const colorScheme = getColorScheme(color as ColorTheme, { outputFormat: 'rgb' })
  return `rgba(${colorScheme[500]} / ${opacity})`
}

function createSVG({ shape, element, color, strokeWidth, opacity }: {
  shape: UnderlineShape
  element: HTMLElement
  color: string
  strokeWidth: number
  opacity: number
}): SVGElement {
  const svgNS = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(svgNS, 'svg')

  svg.setAttribute('class', `${shape}-underline`)
  svg.setAttribute('role', 'presentation')
  svg.setAttribute('preserveAspectRatio', 'none')
  svg.setAttribute('aria-hidden', 'true')

  const path = document.createElementNS(svgNS, 'path')

  const strokeColor = getColorValue(color, opacity)
  const pathAttributes = getPathAttributes(shape, strokeWidth, strokeColor, opacity)

  Object.entries(pathAttributes).forEach(([key, value]) => {
    path.setAttribute(key, value)
  })

  const { viewBox, d } = getShapeDefinitions(shape)
  svg.setAttribute('viewBox', viewBox)
  path.setAttribute('d', d)

  // Initialize as invisible for animation
  const length = path.getTotalLength()
  path.style.strokeDasharray = length.toString()
  path.style.strokeDashoffset = length.toString()

  svg.appendChild(path)
  return svg
}

function getPathAttributes(shape: UnderlineShape, strokeWidth: number, strokeColor: string, opacity: number): Record<string, string> {
  const baseAttributes = {
    'fill': 'none',
    'stroke': strokeColor,
    'stroke-width': strokeWidth.toString(),
    'vector-effect': 'non-scaling-stroke',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  }

  const shapeSpecific: Record<UnderlineShape, Record<string, string>> = {
    circle: {
      'fill-opacity': '0',
      'stroke-miterlimit': '4',
      'stroke-opacity': opacity.toString(),
    },
    brush: {
      'stroke-linecap': 'round',
      'paint-order': 'stroke',
    },
    marker: {
      'stroke-linecap': 'butt',
      'stroke-width': (strokeWidth * 1.5).toString(),
    },
    line: {},
    squiggle: {},
    scribble: {},
  }

  return { ...baseAttributes, ...shapeSpecific[shape] }
}

function getShapeDefinitions(shape: UnderlineShape): { viewBox: string, d: string } {
  const definitions: Record<UnderlineShape, { viewBox: string, d: string }> = {
    line: {
      viewBox: '-400 -55 730 60',
      d: 'M-390,0 Q-200,-8 0,-5 Q200,-2 304,2',
    },
    squiggle: {
      viewBox: '-347 -30.1947 694 96.19',
      d: 'M-335,54 C-335,54 -171,-58 -194,-3 C-217,52 -224,74 -127,11 C-68,-27 -137,50 -33,42 C31,37 147,-29 335,2',
    },
    circle: {
      viewBox: '0 0 800 350',
      d: 'M253,-161 C253,-161 -285,-201 -376,-21 C-469,163 68,174 256,121 C564,34 251,-142 19,-117',
    },
    scribble: {
      viewBox: '-320 -70.8161 640.4 59.82',
      d: 'M-300,-56 C-50,-72 298,-65 300,-59 C332,-53 -239,-36 -255,-27 C-271,-18 -88,-24 91,-20',
    },
    brush: {
      viewBox: '-400 -30 800 40',
      d: 'M-380,-5 Q-200,-15 0,-8 Q150,-3 200,0 Q250,2 380,5',
    },
    marker: {
      viewBox: '-400 -20 800 30',
      d: 'M-390,0 L-200,-3 L0,0 L200,1 L390,-2',
    },
  }

  return definitions[shape]
}

function createIntersectionObserver({ element, svg, animationDuration, index, stagger }: {
  element: HTMLElement
  svg: SVGElement
  animationDuration: number
  index: number
  stagger: number
}) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const path = svg.querySelector('path')
          if (path) {
            animatePath({ path, duration: animationDuration, delay: index * stagger })
          }
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.3,
      rootMargin: '0px 0px -20% 0px', // Trigger earlier for better UX
    },
  )

  observer.observe(element)
}

function animatePath({ path, duration, delay }: {
  path: SVGPathElement
  duration: number
  delay: number
}) {
  const length = path.getTotalLength()

  anime({
    targets: path,
    strokeDashoffset: [length, 0],
    easing: 'easeOutCubic', // More natural for marketing
    duration,
    delay: Math.max(300, delay), // Minimum delay for better perception
    loop: false,
    complete: () => {
      // Ensure final state
      path.style.strokeDasharray = 'none'
      path.style.strokeDashoffset = '0'
    },
  })
}

export default animateUnderline
