/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable unicorn/prefer-includes */
/* eslint-disable no-prototype-builtins */
import UAParser from 'ua-parser-js'

export type DeviceFingerPrint = Record<string, any>

// const testPhantom = (
//   fingerprint: DeviceFingerPrint,
//   BROWSER_REF: string,
// ): boolean[] => {
//   return [
//     /PhantomJS/.test(fingerprint.userAgent),
//     fingerprint.phantomJS.some((val: boolean) => val),
//     !/Firefox/.test(fingerprint.userAgent) &&
//       !/Safari/.test(BROWSER_REF) &&
//       fingerprint.etsl === 37,
//     !/Trident|MSIE|Edge/.test(fingerprint.userAgent) &&
//       fingerprint.languages === undefined,
//     /SyntaxError: DOM Exception 12/.test(fingerprint.errorsGenerated[7]),
//   ]
// }

function testOverriddenPermissions(fingerprint: DeviceFingerPrint): boolean[] {
  const navigatorPermissions = fingerprint.permissions.permissions
  return [
    navigatorPermissions.query.toString()
    !== 'function query() { [native code] }',
    navigatorPermissions.query.toString.toString()
    !== 'function toString() { [native code] }',
    navigatorPermissions.query.toString.hasOwnProperty('[[Handler]]')
    && navigatorPermissions.query.toString.hasOwnProperty('[[Target]]')
    && navigatorPermissions.query.toString.hasOwnProperty('[[IsRevoked]]'),
    navigatorPermissions.hasOwnProperty('query'),
  ]
}

// const testOverriddenLanguagesAndPlugins = (): boolean[] => {
//   // evaluateOnNewDocument scripts don't apply within [srcdoc] (or [sandbox]) iframes
//   // https://github.com/GoogleChrome/puppeteer/issues/1106#issuecomment-359313898
//   const iframe = document.createElement("iframe")
//   iframe.srcdoc = ""
//   document.body.append(iframe)

//   const descriptors = Object.getOwnPropertyDescriptors(
//     HTMLIFrameElement.prototype,
//   )
//   const out = [
//     // Verify iframe prototype isn't touched
//     descriptors?.contentWindow?.get?.toString() !==
//       "function get contentWindow() { [native code] }",
//     // Verify iframe isn't remapped to main window
//     iframe.contentWindow === window,
//     iframe.contentWindow?.navigator.plugins.length === 0,
//   ]

//   iframe.remove()

//   return out
// }

function checkUAOS(fingerprint: DeviceFingerPrint, OS_REF: string, DEVICE_TYPE_REF: string): boolean[] {
  const navigatorOscpu = fingerprint.oscpu.toLowerCase()
  const navigatorPlatform = fingerprint.platform.toLowerCase()
  const navigatorUA = fingerprint.userAgent.toLowerCase()
  return [
    // should be touch screen but not.. hopefully this doesnt screw over
    // mobile users. need to test
    // reliable to guess that isBot = true if there is touchscreen but device
    // = empty?
    !fingerprint.touchScreen.some((val: boolean) => val)
    && ['mobile', 'tablet', 'wearable'].includes(DEVICE_TYPE_REF),

    navigatorOscpu !== 'unknown'
    && ((navigatorOscpu.indexOf('win') >= 0 && !OS_REF.includes('Windows'))
    || (navigatorOscpu.indexOf('linux') >= 0
    && navigatorUA.indexOf('linux') < 0)
    || (navigatorOscpu.indexOf('mac') >= 0
    && !['Mac OS', 'iOS'].includes(OS_REF))),

    navigatorPlatform !== 'unknown'
    && ((navigatorPlatform.indexOf('win') >= 0 && !OS_REF.includes('Windows'))
    || ((navigatorPlatform.indexOf('linux') >= 0
    || navigatorPlatform.indexOf('android') >= 0
    || navigatorPlatform.indexOf('pike') >= 0)
    && navigatorUA.indexOf('linux') < 0)
    || ((navigatorPlatform.indexOf('mac') >= 0
    || navigatorPlatform.indexOf('ipad') >= 0
    || navigatorPlatform.indexOf('ipod') >= 0
    || navigatorPlatform.indexOf('iphone') >= 0)
    && !['Mac OS', 'iOS'].includes(OS_REF))),
  ]
}

// const checkUABrowser = (
//   fingerprint: DeviceFingerPrint,
//   BROWSER_REF: string,
// ): boolean[] => {
//   const specialNum = eval.toString().length
//   const browserRef = {
//     37: ["Safari", "Firefox"],
//     39: ["IE"],
//     33: ["Chrome", "Opera"],
//   }
//   const allBrowsers = ["Safari", "Firefox", "IE", "Chrome", "Opera"]
//   return [
//     (BROWSER_REF.includes("Chrome") ||
//       BROWSER_REF.includes("Opera") ||
//       BROWSER_REF.includes("Android") ||
//       BROWSER_REF.includes("Edge") ||
//       BROWSER_REF.includes("Safari")) &&
//       fingerprint.productSub !== "20030107",

//     37 === specialNum &&
//       !browserRef[37].some((val) => BROWSER_REF.includes(val)) &&
//       allBrowsers.some((val) => BROWSER_REF.includes(val)),
//     39 === specialNum &&
//       !browserRef[39].some((val) => BROWSER_REF.includes(val)) &&
//       allBrowsers.some((val) => BROWSER_REF.includes(val)),
//     33 === specialNum &&
//       !browserRef[33].some((val) => BROWSER_REF.includes(val)) &&
//       allBrowsers.some((val) => BROWSER_REF.includes(val)),
//   ]
// }

export function headlessFlags(fingerprint: DeviceFingerPrint): string[] {
  const parser = new UAParser()
  parser.setUA(fingerprint.userAgent)
  const uaParsed = parser.getResult()

  const BROWSER_REF = uaParsed.browser.name ?? ''
  const OS_REF = uaParsed.os.name ?? ''
  const BROWSER_VERSION_REF = uaParsed.browser.major ?? 0
  const DEVICE_TYPE_REF = uaParsed.device.type ?? ''
  const BROWSERS = {
    CHROME: 'Chrome',
    CHROMIUM: 'Chromium',
    OPERA: 'Opera',
  }
  const failed: string[] = []
  // if (testPhantom(fingerprint, BROWSER_REF).some((val) => val)) {
  //   failed.push("90") // testPhantom
  // }
  // if (!fingerprint.screenMediaQuery) {
  //   failed.push("85") // watchMediaSize
  // }
  if (
    fingerprint.resOverflow.errorName === 'RangeError'
    && fingerprint.resOverflow.errorMessage
    === 'Maximum call stack size exceeded.'
    && fingerprint.resOverflow.errorStacklength
    > 20 * fingerprint.resOverflow.depth
  )
    failed.push('test92') // longNameTest

  if (
    fingerprint.screen.sAvailWidth > fingerprint.screen.sWidth
    || fingerprint.screen.sAvailHeight > fingerprint.screen.sHeight
  )
    failed.push('test81') // screenSize

  // if (/HeadlessChrome/.test(fingerprint.userAgent)) {
  //   failed.push("55") // headlessUA:sure
  // }
  // if (fingerprint.webDriver && fingerprint.webDriverValue) {
  //   failed.push("42") // altHeadless
  // }
  if (!fingerprint.hasChrome && /Chrome|Chromium/.test(BROWSER_REF))
    failed.push('test72') // windowChromeLied

  if (
    fingerprint.permissions.permissionNotification === 'denied'
    && fingerprint.permissions.state === 'prompt'
  )
    failed.push('test29') // permissionsMatch

  if (
    /Chrome/.test(fingerprint.userAgent)
    && fingerprint.iframeChrome === 'undefined'
  )
    failed.push('test98') // chromeIFrameCheck

  // following 2 from here: https://github.com/paulirish/headless-cat-n-mouse
  if (
    /Chrome/.test(fingerprint.userAgent)
    && testOverriddenPermissions(fingerprint).some(val => val)
  )
    failed.push('test44') // overriddenPermissions

  if (fingerprint.selenium.some((val: string) => val))
    failed.push('test22') // selenium

  // If deviceMemory !== 0 and not recent Chrome or Opera
  // if (
  //   fingerprint.deviceMemory !== 0 &&
  //   !(BROWSER_REF === BROWSERS.CHROME && BROWSER_VERSION_REF >= 63) &&
  //   !(/Opera/.test(BROWSER_REF) && BROWSER_VERSION_REF >= 50)
  // ) {
  //   failed.push("77") // deviceMemory
  // }
  // If deviceMemory = 0 and recent Chrome or Opera
  if (
    fingerprint.deviceMemory === 0
    && ((BROWSER_REF === BROWSERS.CHROME && BROWSER_VERSION_REF >= 63)
    || (/Opera/.test(BROWSER_REF) && BROWSER_VERSION_REF >= 50))
  )
    failed.push('test92') // deviceMemory

  if (fingerprint.sequentum)
    failed.push('test19') // sequentum

  if (
    checkUAOS(fingerprint, OS_REF, DEVICE_TYPE_REF).some((val) => {
      return val
    })
  )
    failed.push('test52')

  // if (
  //   checkUABrowser(fingerprint, BROWSER_REF).some((val) => {
  //     return val
  //   })
  // ) {
  //   failed.push("34") // naughtyBrowser
  // }
  return failed
}

// addTestResult(() => {
//     let testResult = /Chrome/.test(fingerprint.userAgent) &&
//     fingerprint.plugins.length === 0 ? UNSURE : CONSISTENT;
//     return analysisResult(TESTS.HEADCHR_PLUGINS, testResult, {plugins: fingerprint.plugins});
// });

// addTestResult(() => {
//     let testResult = /Chrome/.test(fingerprint.userAgent) &&
//     fingerprint.debugTool ? UNSURE : CONSISTENT;
//     return analysisResult(TESTS.CHR_DEBUG_TOOLS, testResult, {});
// });

// addTestResult(() => {
//     let testResult = fingerprint.tpCanvas !== 'error' &&
//     fingerprint.tpCanvas[0] === 0 &&
//     fingerprint.tpCanvas[1] === 0 &&
//     fingerprint.tpCanvas[2] === 0 &&
//     fingerprint.tpCanvas[3] === 0 ? CONSISTENT : UNSURE;
//     return analysisResult(TESTS.TRANSPARENT_PIXEL, testResult, fingerprint.tpCanvas);
// });

// TODO: do more tests on Windows and Mac OS to change UNSURE to INCONSISTENT
// addTestResult(() => {
//     let testResult = (BROWSER_REF === BROWSERS.CHROME || BROWSER_REF === BROWSERS.CHROMIUM) &&
//     fingerprint.videoCodecs.h264 !== 'probably' ? UNSURE : CONSISTENT;
//     return analysisResult(TESTS.VIDEO_CODECS, testResult, {h264: fingerprint.videoCodecs.h264});
// });
