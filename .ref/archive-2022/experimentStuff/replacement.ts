import type {
  ChangeRecord,
  Experiment,
  ExperimentDataTag,
  FrameChangeElement,
  Variant,
} from '@kaption/types'
import { logger } from '@factor/api/logger'
import { getLocal, setLocal } from '@kaption/browser-utils/__local'
import { getScriptSetting } from '@kaption/browser-utils/settings'
import { passesTargetingRules } from '../../@suites/events/rules'

interface ChangeObservers {
  poller: NodeJS.Timeout
  observer: MutationObserver
}

/**
 * GLOBAL
 * Add change to global record
 */

declare global {
  interface Window {
    kaptionChanges?: ChangeRecord
    kaptionRendered: ChangeRecord
    kaptionObservers?: ChangeObservers
  }
}

window.kaptionChanges = window.kaptionChanges || {}
window.kaptionRendered = window.kaptionRendered || {}

/**
 * @singleton
 * controls interval timeout, 5 * count
 * Initialize a perpetual interval checker
 */
let __intervalCount = 0

/**
 * Gets changes active on the current path/page
 */
function getChangeBuffer(): FrameChangeElement[] {
  const changes = window.kaptionChanges || {}

  const lp = window.location.pathname

  const pathname = lp === '/' ? '/' : lp.replace(/\/$/, '')

  const buffer = Object.values(changes).filter((_) => {
    return !!(_ && (_.pathname?.includes('*') || _.pathname === pathname))
  }) as FrameChangeElement[]

  return buffer
}
/**
 * On editing
 */
function handleReverts(): void {
  if (!window.kaptionOriginals)
    return
  const changes = window.kaptionChanges || {}
  const entries = Object.entries(changes).filter(entry => entry[1] === null)
  if (entries.length > 0) {
    entries.forEach(([hash]) => {
      const { html: originalHtml, selector }
        = window.kaptionOriginals?.[hash] ?? {}

      if (originalHtml && selector) {
        const el = document.querySelector(selector)
        if (el)
          el.innerHTML = originalHtml
        if (window.kaptionChanges?.[hash])
          delete window.kaptionChanges[hash]
      }
    })
  }
}
/**
 * Add changes to watch for in global buffer
 */
export function addChangesForReplacement(changes: ChangeRecord = {}): ChangeRecord {
  window.kaptionChanges = { ...window.kaptionChanges, ...changes }
  return window.kaptionChanges
}
/**
 * Dynamically hide all upcoming changes
 */
function setElementStyle(): void {
  const changes = getChangeBuffer()

  let styleEl = document.querySelector('#kaptionStyle')

  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = 'kaptionStyle'
    document.querySelector('head')?.append(styleEl)
  }

  const selectors = changes
    .filter(({ hash }) => !window.kaptionRendered[hash])
    .map(ch => ch.selector)

  const html = selectors.length > 0 ? `${selectors.join(',')}{opacity: 0}` : ''
  styleEl.innerHTML = html
}
/**
 * Check a node for items to replace
 * @note this is called on loop and mutation
 */
export function checkAndReplace(el: HTMLElement | Document = document): void {
  if (window.kaptionOriginals)
    handleReverts()

  const changes = getChangeBuffer()

  changes.forEach((change) => {
    const { selector, hash, html, pathname, attrs } = change
    const currentPath = window.location.pathname.replace(/\/$/, '')
    const savedPath = pathname?.replace(/\/$/, '') ?? ''
    if (currentPath === savedPath || savedPath?.includes('*')) {
      const found: HTMLElement | undefined = el.querySelector(selector) as
        | HTMLElement
        | undefined

      if (found) {
        const edits: string[] = []
        if (!found.getAttribute('kaption-edit')) {
          found.setAttribute('kaption-edit', 'true')
          edits.push('edited')
        }

        if (found.innerHTML !== html) {
          found.innerHTML = html
          edits.push(html)
        }

        if (attrs) {
          attrs.forEach(({ name, value }) => {
            if (found.getAttribute(name) !== value) {
              found.setAttribute(name, value)
              edits.push(`${name}:${value} from ${found.getAttribute(name)}`)
            }
          })
        }

        if (edits.length > 0) {
          window.kaptionRendered[hash] = change
          // hide for loading
          setElementStyle()
          logger.log({
            level: 'info',
            context: 'checkAndReplace',
            description: `found ${selector} and edited ${edits.join(', ')}`,
          })
        }
      }
    }
  })
}

function onMutation(mutations: MutationRecord[]): void {
  for (let i = 0, len = mutations.length; i < len; i++) {
    const added = mutations[i].addedNodes
    let node: HTMLElement
    for (let j = 0; (node = added[j] as HTMLElement); j++)
      checkAndReplace(node)
  }
}

export function setMutationObserver(): MutationObserver {
  const observer = new MutationObserver(onMutation)
  observer.observe(document, {
    childList: true, // report added/removed nodes
    subtree: true, // observe any descendant elements
  })
  return observer
}

export function setCheckInterval(): NodeJS.Timeout {
  const timeout = Math.min(1000, 5 * __intervalCount)
  const poller = setTimeout(() => {
    if (__intervalCount >= 0) {
      checkAndReplace()
      setCheckInterval()
      __intervalCount++
    }
  }, timeout)

  return poller
}

export function setObservers(): ChangeObservers {
  if (!window.kaptionObservers) {
    window.kaptionObservers = {
      poller: setCheckInterval(),
      observer: setMutationObserver(),
    }
  }

  return window.kaptionObservers
}

export function getSiteExperiments():
  | Record<string, Experiment>
  | undefined {
  return getScriptSetting('experiments')
}

interface SelectedVariant {
  experiment: Experiment
  variant?: Variant
  status?: 'eligible' | 'ineligible'
  reason?: string
}
type SelectedVariantRecord = Record<string, SelectedVariant>
/**
 * @Singleton
 * only do this once per page
 */
let __selectedVariantRecord: SelectedVariantRecord | undefined

/**
 * Get a record of experiment ID to selected variants
 */
export async function getSelectedVariantRecord(): Promise<SelectedVariantRecord> {
  if (!__selectedVariantRecord) {
    const experiments = getSiteExperiments()
    const savedExperiments = getLocal<Record<string, SelectedVariant>>({
      key: 'daExp',
    })

    const storedRecord: Record<string, SelectedVariant> = savedExperiments || {}

    __selectedVariantRecord = {}

    if (experiments) {
      await Promise.all(
        Object.values(experiments)
          .filter(_ => _.experimentStatus === 'active')
          .map(async (experiment: Experiment) => {
            const {
              experimentId,
              rules,
              variants = {},
              variantWeights = {},
            } = experiment
            let selectedVariant: SelectedVariant | undefined
                = storedRecord[experimentId]

            if (selectedVariant) {
              const selVarId = selectedVariant.variant?.variantId
              const selVar = selVarId ? variants[selVarId] : undefined
              // update with any changes
              if (selVar) {
                selectedVariant.experiment = experiment
                selectedVariant.variant = selVar
              }
              else {
                // variant no longer exists, reset
                selectedVariant = undefined
              }
            }

            // not set, assign variant randomly from weights
            if (!selectedVariant) {
              selectedVariant = { experiment }
              let pointer = 0

              const { pass, reason } = await passesTargetingRules(rules)

              if (!pass) {
                selectedVariant.status = 'ineligible'
                selectedVariant.reason = reason
              }
              else {
                selectedVariant.status = 'eligible'
                // 'control' is the base case if no variant gets selected
                selectedVariant.variant = {
                  experimentId,
                  variantId: 'control',
                  variantName: 'control',
                }
                const randomPercent = Math.floor(Math.random() * 100) + 1 // 1 to 100

                Object.entries(variantWeights).forEach(
                  ([variantId, weight]) => {
                    // use a pointer to establish the range 1-100 a variant owns
                    pointer = pointer + weight

                    // if a non-control variant has been 'hit' then we're done
                    if (selectedVariant?.variant?.variantId !== 'control')
                      return

                    // did the randomly selected percent hit the new pointer range
                    else if (randomPercent <= pointer)
                      selectedVariant.variant = variants[variantId]
                  },
                )
              }

              storedRecord[experimentId] = selectedVariant
            }

            if (__selectedVariantRecord)
              __selectedVariantRecord[experimentId] = selectedVariant
          }),
      )

      setLocal<Record<string, SelectedVariant>>({
        key: 'daExp',
        value: storedRecord,
        scope: 'functional',
        type: 'persistent',
      })
    }
  }

  return __selectedVariantRecord
}
/**
 * Get the analytics data tag based on experiments and selected variants
 */
export async function getExperimentDataTag(): Promise<ExperimentDataTag[]> {
  const sel = await getSelectedVariantRecord()

  const tags = Object.values(sel)
    .filter(_ => _ && _.variant)
    .map(({ variant, experiment }) => {
      const { variantName, variantId } = variant ?? {}
      const { experimentId, experimentName } = experiment

      return {
        variantName,
        variantId,
        experimentId,
        experimentName,
      }
    })
  return tags as ExperimentDataTag[]
}
/**
 * The DOM changes enabled by the randomly selected variant within each experiment
 */
export async function getSelectedChangeRecord(): Promise<ChangeRecord> {
  const sel = await getSelectedVariantRecord()
  let out: ChangeRecord = {}
  const changeRecords = Object.values(sel)
    .map(({ variant }) => (variant && variant.changes ? variant.changes : ''))
    .filter(_ => _)

  changeRecords.forEach((changes) => {
    out = { ...out, ...changes }
  })
  return out
}
/**
 * Change the dom based on variant change record
 */
export function initializeReplacer(opts: {
  changeRecord?: ChangeRecord
  lazy?: boolean
} = {}): void {
  const { changeRecord, lazy } = opts

  if (lazy || changeRecord) {
    // add enabled changes
    addChangesForReplacement(changeRecord)
    // hide selectors until they are replaced
    setElementStyle()
    // loop to see if selectors added
    setCheckInterval()
  }
}
/**
 * Initialize the variant selector and DOM change handler
 */
export async function initializeVariants(): Promise<void> {
  const changeRecord = await getSelectedChangeRecord()
  initializeReplacer({ changeRecord })
  const variantRecord = await getSelectedVariantRecord()
  logger.log({
    level: 'info',
    context: 'variants',
    description: `variants initialized`,
    data: { changeRecord, variantRecord },
  })
}
