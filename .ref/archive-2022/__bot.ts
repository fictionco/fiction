// cSpell:disable
import type {
  DeviceFingerPrint,
} from '@kaption/browser-utils/lib/fpEvaluate'
import {
  headlessFlags,
} from '@kaption/browser-utils/lib/fpEvaluate'
import { fpCollect } from '@kaption/browser-utils/lib/fpCollect'

export function isKnownBot(): boolean {
  const botPattern
    = '(googlebot/|bot|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)'
  const re = new RegExp(botPattern, 'i')
  const userAgent = navigator.userAgent

  return re.test(userAgent)
}

export async function isHeadlessBrowser(): Promise<{
  status: 'success' | 'error'
  failed: string[]
}> {
  // if the bot is headless
  if (navigator.webdriver)
    return { status: 'error', failed: ['webdriver'] }

  if (navigator.userAgent.toLowerCase().includes('headless'))
    return { status: 'error', failed: ['headlessUA'] }

  // if (!window.matchMedia(`(min-width: ${window.innerWidth - 1}px)`).matches) {
  //   return { status: "error", failed: ["mismatch"] }
  // }

  if (
    [
      /PhantomJS/.test(navigator.userAgent),
      'callPhantom' in window,
      '_phantom' in window,
      'phantom' in window,
    ].some((val: boolean) => val)
  )
    return { status: 'error', failed: ['phantom'] }

  const fingerprint
    = (await fpCollect.generateFingerprint()) as DeviceFingerPrint

  const failed: string[] = headlessFlags(fingerprint)

  const status = failed.length === 0 ? 'success' : 'error'

  return { status, failed }
}
