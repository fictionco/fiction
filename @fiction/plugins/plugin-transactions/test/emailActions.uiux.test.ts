/* eslint-disable no-irregular-whitespace */

import { afterAll, describe, expect, it } from 'vitest'
import { vue } from '@fiction/core'
import { testEnvFile } from '@fiction/core/test-utils'
import { createUiTestingKit } from '@fiction/core/test-utils/kit'
import fs from 'fs-extra'
import { EmailAction } from '..'
import { setup as emailActionMainFileSetup } from './emailActions.main'
import { emailActionSnapshot } from './utils'

describe('email actions', async () => {
  if (!fs.existsSync(testEnvFile))
    console.warn(`missing test env file ${testEnvFile}`)

  const kit = await createUiTestingKit({ headless: false, slowMo: 0, envFiles: [testEnvFile], setup: emailActionMainFileSetup })
  const testUtils = kit.testUtils

  const initialized = await testUtils.initUser()

  const user = initialized.user

  testUtils.fictionTransactions.settings.fictionEmail.isTest = false

  afterAll(async () => {
    await testUtils.close()
    await kit.close()
  })

  it('sends email', async () => {
    const r = await testUtils.emailAction.serveSend({
      to: user.email || '',
      origin: testUtils.fictionApp.appUrl.value || '',
      recipient: user,
      queryVars: { code: user.verify?.code || '' },
    }, { server: true })

    const callbackUrl = r.emailVars?.callbackUrl || ''

    const emailHtml = r.data?.html
    expect(emailHtml).toBeDefined()
    expect(user.verify?.code).toBeDefined()
    expect(emailHtml).toContain(user.verify?.code)
    expect(emailHtml, 'contains callbackUrl').toContain(callbackUrl.replaceAll('&', '&amp;'))
    expect(emailHtml).toContain('Email Action Heading')

    const code = user.verify?.code || ''

    if (!code)
      throw new Error('missing code')

    if (!user.email)
      throw new Error('missing email')

    const replaced = emailActionSnapshot(r.data?.html || '', r.emailVars)
    expect(replaced).toMatchInlineSnapshot(`
      "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html id="__vue-email" lang="en" dir="ltr"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>Test Fiction App: Email Action Subject</title><meta name="description" content="Email Action Heading Email Action Subheading"><style data-id="__vue-email-style"> tbody{font-size: 1rem; line-height: 1.65;} h1, h2{ line-height: 1.2; } h3, h4, h5{ line-height: 1.4; } h5, h6{font-weight: bold;} ol, ul, dd, dt{ font-size: 1rem; line-height: 1.65;} dt{font-weight: bold; margin-top: 0.5rem;} dd{margin-inline-start: 1.5rem;} ul, ol{padding-inline-start: 1.5rem;} img, figure{max-width: 100%; height: auto; } img[data-emoji]{display: inline;} figure img{border-radius: .5rem; display: block;} figcaption{font-size: 0.8rem; text-align: center; color: #666; margin-top: 0.5rem;} @media (prefers-color-scheme: dark) { } a{ transition: opacity 0.2s;} a:hover{opacity: 0.8;} </style></meta></meta></meta></meta></head><div id="__vue-email-preview" style="display: none; overflow: hidden; line-height: 1px; opacity: 0; max-height: 0; max-width: 0">Email Action Heading Email Action Subheading<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div></div><body data-id="__vue-email-body" style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;; background-color: rgb(255,255,255); color: rgb(14,15,17);" class="dark:bg-gray-900 dark:text-white"><table align="center" width="100%" data-id="__vue-email-container" role="presentation" cellspacing="0" cellpadding="0" border="0" style="max-width:37.5em; padding-top: 2rem;
          padding-bottom: 2rem; padding-left: 1rem;
          padding-right: 1rem; max-width: 600px;" class="py-8 px-4 max-w-[600px]"><tbody><tr style="width: 100%"><td><table align="center" width="100%" data-id="__vue-email-section" border="0" cellpadding="0" cellspacing="0" role="presentation" class="mb-6" style="margin-bottom: 1.5rem;"><tbody><tr><td><td data-id="__vue-email-column" role="presentation" class="w-[22px]" style="width: 22px;"><a data-id="__vue-email-link" style="color: #067df7; text-decoration: none" href="https://www.fiction.com" target="_blank"><img data-id="__vue-email-img" style="display:block;outline:none;border:none;text-decoration:none; border-radius: 0.375rem; border-width: 2px !important; border-color: rgb(255,255,255,0.1) !important; border-style: solid !important;" src="https://media.fiction.com/fiction-relative-media/med665d61d70a3487a3d7c82303-fiction-icon.png?blurhash=U9EMLDD%2500%3Fb9FWBay%25M00Rj%7Eqxu_3%25Mt74n" class="rounded-md !border-2 !border-white/10 !border-solid" width="22"/></a></td><td data-id="__vue-email-column" role="presentation" class="pl-3" style="padding-left: 0.75rem;"><a data-id="__vue-email-link" style="color:#067df7;text-decoration:none; color: rgb(100,110,130); font-weight: 400; font-size: 14px;" href="https://www.fiction.com" target="_blank" class="dark:text-gray-300">Fiction</a></td></td></tr></tbody></table><table align="center" width="100%" data-id="__vue-email-section" border="0" cellpadding="0" cellspacing="0" role="presentation" style="font:&#39;Geist&#39;, -apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;;"><tbody><tr><td><p data-id="__vue-email-text" style="font-size:14px;line-height:24px;margin:16px 0;font-weight:bold;font-size:24px;line-height:1.33; margin-top: 0px;
          margin-bottom: 0px;" class="my-0">Email Action Heading</p><p data-id="__vue-email-text" style="font-size:14px;line-height:24px;margin:16px 0;font-weight:normal;font-size:24px;line-height:1.33; margin-top: 0px;
          margin-bottom: 0px; color: rgb(100,110,130);" class="my-0 text-gray-500"><span>Email Action Subheading</span> ↘ </p></td></tr></tbody></table><hr data-id="__vue-email-hr" style="width:100%;border:none;border-top:1px solid #eaeaea; margin-top: 2rem;
          margin-bottom: 2rem; border-color: rgb(222,223,226);" class="dark:border-gray-700"><div data-id="__vue-email-markdown" class="body-content"><p data-id="vue-email-text" style="font-size:1.1rem;line-height:1.65;font-weight:normal">Email Action Body Markdown</p></div><table align="center" width="100%" data-id="__vue-email-section" border="0" cellpadding="0" cellspacing="0" role="presentation" class="mt-12 mb-8 text-left" style="margin-top: 3rem; margin-bottom: 2rem; text-align: left;"><tbody><tr><td><table align="center" width="100%" data-id="__vue-email-section" border="0" cellpadding="0" cellspacing="0" role="presentation" class="inline-block" style="display: inline-block;"><tbody><tr><td><td data-id="__vue-email-column" role="presentation" class=""><a data-id="__vue-email-button" style="line-height:100%;text-decoration:none;display:inline-block;max-width:100%;white-space:nowrap; background-color: rgb(37,99,235); color: rgb(255,255,255); padding-top: 0.75rem;
          padding-bottom: 0.75rem; padding-left: 1rem;
          padding-right: 1rem; border-radius: 0.375rem; font-size: 16px; font-weight: 700; user-select: none;" href="http://localhost:[port]/__transaction/test-action?code=[code]&amp;token=[token]&amp;email=[email]&amp;userId=[userId]" target="_blank" class="dark:bg-blue-600 hover:opacity-80">Verify Email</a></td></td></tr></tbody></table></td></tr></tbody></table><hr data-id="__vue-email-hr" style="width:100%;border:none;border-top:1px solid #eaeaea; margin-top: 3rem;
          margin-bottom: 3rem; border-color: rgb(100,110,130); opacity: 0.3;" class="my-12 border-gray-500 opacity-30"><table align="center" width="100%" data-id="__vue-email-section" border="0" cellpadding="0" cellspacing="0" role="presentation" class="dark:text-gray-500 text-normal" style="margin-top: 2rem; text-align: left; color: rgb(179,185,197); font-size: 0.75rem;
          line-height: 1rem;"><tbody><tr><td><td data-id="__vue-email-column" role="presentation" class="w-[65%] align-top" style="width: 65%; vertical-align: top;"><img data-id="__vue-email-img" style="display:block;outline:none;border:none;text-decoration:none;" src="https://media.fiction.com/fiction-relative-media/med665d61d8c87998da482d4c21-fiction-email-footer.png?blurhash=U2DS%5D%5D%7Eq00_N00_4%25M4n00_N%3FcIU%7Eq9F%25M-%3B" width="80" alt="Market Yourself with Fiction"><p data-id="__vue-email-text" style="font-size: 14px; line-height: 24px; margin: 16px 0;"><a data-id="__vue-email-link" style="color:#067df7;text-decoration:none; color: rgb(179,185,197); margin-top: 1rem;" href="https://www.fiction.com" target="_blank" class="text-normal dark:text-gray-500">Market Yourself with Fiction ↗ </a></p></img></td><td data-id="__vue-email-column" role="presentation" class="w-[35%] text-right text-gray-400 align-top text-xs" style="width: 35%; text-align: right; color: rgb(122,133,153); vertical-align: top; font-size: 0.75rem;
          line-height: 1rem;"><!--v-if--></td></td></tr></tbody></table></hr></hr></td></tr></tbody></table></body></html>"
    `)
  })

  it('loads up ui associated with action', async () => {
    await kit.performActions({
      path: '/__transaction-route/test-action',
      actions: [
        { type: 'visible', selector: `[data-action-id="${testUtils.emailAction.settings.actionId}"]` },
      ],
    })
  })
})
