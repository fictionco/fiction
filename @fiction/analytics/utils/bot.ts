export function isKnownBot(userAgent: string): boolean {
  const botPatterns = ['googlebot/', 'bot', 'Googlebot-Mobile', 'Googlebot-Image', 'Google favicon', 'Mediapartners-Google', 'bingbot', 'slurp', 'java', 'wget', 'curl', 'Commons-HttpClient', 'Python-urllib', 'libwww', 'httpunit', 'nutch', 'phpcrawl', 'msnbot', 'jyxobot', 'FAST-WebCrawler', 'FAST Enterprise Crawler', 'biglotron', 'teoma', 'convera', 'seekbot', 'gigablast', 'exabot', 'ngbot', 'ia_archiver', 'GingerCrawler', 'webmon ', 'httrack', 'webcrawler', 'grub.org', 'UsineNouvelleCrawler', 'antibot', 'netresearchserver', 'speedy', 'fluffy', 'bibnum.bnf', 'findlink', 'msrbot', 'panscient', 'yacybot', 'AISearchBot', 'IOI', 'ips-agent', 'tagoobot', 'MJ12bot', 'dotbot', 'woriobot', 'yanga', 'buzzbot', 'mlbot', 'yandexbot', 'purebot', 'Linguee Bot', 'Voyager', 'CyberPatrol', 'voilabot', 'baiduspider', 'citeseerxbot', 'spbot', 'twengabot', 'postrank', 'turnitinbot', 'scribdbot', 'page2rss', 'sitebot', 'linkdex', 'Adidxbot', 'blekkobot', 'ezooms', 'dotbot', 'Mail.RU_Bot', 'discobot', 'heritrix', 'findthatfile', 'europarchive.org', 'NerdByNature.Bot', 'sistrix crawler', 'ahrefsbot', 'Aboundex', 'domaincrawler', 'wbsearchbot', 'summify', 'ccbot', 'edisterbot', 'seznambot', 'ec2linkfinder', 'gslfbot', 'aihitbot', 'intelium_bot', 'facebookexternalhit', 'yeti', 'RetrevoPageAnalyzer', 'lb-spider', 'sogou', 'lssbot', 'careerbot', 'wotbox', 'wocbot', 'ichiro', 'DuckDuckBot', 'lssrocketcrawler', 'drupact', 'webcompanycrawler', 'acoonbot', 'openindexspider', 'gnam gnam spider', 'web-archive-net.com.bot', 'backlinkcrawler', 'coccoc', 'integromedb', 'content crawler spider', 'toplistbot', 'seokicks-robot', 'it2media-domain-crawler', 'ip-web-crawler.com', 'siteexplorer.info', 'elisabot', 'proximic', 'changedetection', 'blexbot', 'arabot', 'WeSEE:Search', 'niki-bot', 'CrystalSemanticsBot', 'rogerbot', '360Spider', 'psbot', 'InterfaxScanBot', 'Lipperhey SEO Service', 'CC Metadata Scaper', 'g00g1e.net', 'GrapeshotCrawler', 'urlappendbot', 'brainobot', 'fr-crawler', 'binlar', 'SimpleCrawler', 'Livelapbot', 'Twitterbot', 'cXensebot', 'smtbot', 'bnf.fr_bot', 'A6-Indexer', 'ADmantX', 'Facebot', 'Twitterbot', 'OrangeBot', 'memorybot', 'AdvBot', 'MegaIndex', 'SemanticScholarBot', 'ltx71', 'nerdybot', 'xovibot', 'BUbiNG', 'Qwantify', 'archive.org_bot', 'Applebot', 'TweetmemeBot', 'crawler4j', 'findxbot', 'SemrushBot', 'yoozBot', 'lipperhey', 'y!j-asr', 'Domain Re-Animator Bot', 'AddThis']

  return botPatterns.some(pattern => new RegExp(pattern, 'i').test(userAgent))
}

/**
 * Detect if visitor is actually a search bot
 */
export function isSearchBot(): boolean {
  if (typeof window === 'undefined' || !window.navigator)
    return false

  const result = /bot|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex/i.test(window.navigator.userAgent)

  return result
}

export function isBot(args: { clientNavigator: Navigator }): {
  result: boolean
  failed: string[]
} {
  const { clientNavigator } = args
  const failed: string[] = []

  // Check for headless browsers
  if (clientNavigator.webdriver) {
    failed.push('webdriver')
  }

  if (clientNavigator.userAgent.toLowerCase().includes('headless')) {
    failed.push('headlessUA')
  }

  if (
    [
      /PhantomJS/.test(clientNavigator.userAgent),
      'callPhantom' in window,
      '_phantom' in window,
      'phantom' in window,
    ].some(Boolean)
  ) {
    failed.push('phantom')
  }

  // Check for Playwright and Puppeteer
  if (
    [
      /Playwright/.test(clientNavigator.userAgent),
      'playwright' in navigator,
      'playwright' in window,
      'navigator' in window && (navigator as any).brave === undefined && !/Chrome/.test(clientNavigator.userAgent),
    ].some(Boolean)
  ) {
    failed.push('playwright')
  }

  if (
    [
      /Puppeteer/.test(clientNavigator.userAgent),
      'puppeteer' in navigator,
      'puppeteer' in window,
    ].some(Boolean)
  ) {
    failed.push('puppeteer')
  }

  if (isKnownBot(clientNavigator.userAgent)) {
    failed.push('knownBot')
  }

  return { result: failed.length > 0, failed }
}
