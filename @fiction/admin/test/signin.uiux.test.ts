/* eslint-disable no-irregular-whitespace */
import { isCi, shortId } from '@fiction/core'
import { createUiTestingKit } from '@fiction/core/test-utils/kit'
import { emailActionSnapshot } from '@fiction/plugin-transactions/test/utils'
import { afterAll, describe, expect, it } from 'vitest'
import { setup } from './email.main.js'

describe('signin UX', { retry: isCi() ? 3 : 0 }, async () => {
  const kit = await createUiTestingKit({ headless: false, setup, slowMo: 0 })
  const testUtils = kit.testUtils

  const initialized = await testUtils.initUser()

  const user = initialized.user

  afterAll(async () => kit?.close())

  const action = kit.testUtils?.fictionAdmin.emailActions.magicLoginEmailAction

  if (!user.email)
    throw new Error('missing email')

  const browserRequest = await action.requestSend({
    to: user.email,
    createUserFields: {},
    queryVars: {},
  })

  const recipient = browserRequest?.data?.recipient

  expect(recipient?.userId).toBe(user.userId)

  const r = await action.serveSend({ recipient: user, queryVars: {} }, { server: true })
  const v = JSON.parse(emailActionSnapshot(JSON.stringify(r.emailVars), r.emailVars))

  const vars = r.emailVars

  it('sends email', async () => {
    expect(user.verify?.code).toBe(r.emailVars.code)
    expect(v).toMatchInlineSnapshot(`
      {
        "actionId": "magicLogin",
        "app": {
          "domain": "fiction.com",
          "email": "admin@fiction.com",
          "name": "Test Fiction App",
          "url": "https://testing.fiction.com",
        },
        "appName": "Test Fiction App",
        "callbackUrl": "http://localhost:[port]/__transaction/magic-login?token=[token]&code=[code]&email=[email]&userId=[userId]",
        "code": "[code]",
        "email": "[email]",
        "fullName": "[fullName]",
        "originUrl": "http://localhost:[port]",
        "queryVars": {
          "code": "[code]",
          "email": "[email]",
          "token": "[token]",
          "userId": "[userId]",
        },
        "redirect": "",
        "token": "[token]",
        "unsubscribeUrl": "http://localhost:[port]/__transaction/unsubscribe",
        "userId": "[userId]",
        "username": null,
      }
    `)

    const replaced = r.data?.html || ''
    expect(emailActionSnapshot(replaced, r.emailVars)).toMatchInlineSnapshot(`
      "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><tailwind-clean-component caller="transactional-Test Fiction App: Your Sign-In Link 🪄"><html lang="en" dir="ltr" class="" style=""><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/><meta name="x-apple-disable-message-reformatting"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/><title>Test Fiction App: Your Sign-In Link 🪄</title><meta name="description" content="Your Sign-In Link is Ready -- Click the link below to log in"/><style data-id="__vue-email-style">
                tbody { font-size: 1rem; line-height: 1.65; }
                h1, h2 { line-height: 1.2; }
                h3, h4, h5 { line-height: 1.4; }
                h5, h6 { font-weight: bold; }
                ol, ul, dd, dt { font-size: 1rem; line-height: 1.65; }
                dt { font-weight: bold; margin-top: 0.5rem; }
                dd { margin-inline-start: 1.5rem; }
                ul, ol { padding-inline-start: 1.5rem; }
                img, figure { max-width: 100%; height: auto; }
                img[data-emoji] { display: inline; }
                figure img { border-radius: .5rem; display: block; }
                figcaption { font-size: 0.8rem; text-align: center; color: #666; margin-top: 0.5rem;  }
                figcaption a { color: inherit; }
                a { transition: opacity 0.2s; }
                a:hover { opacity: 0.8; }
              </style></head><div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0;">Your Sign-In Link is Ready -- Click the link below to log in<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div></div><body style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;;"><div class="py-8 px-4" style="max-width:600px;margin:0px auto;color:#0e0f11; padding-top: 2rem;
          padding-bottom: 2rem; padding-left: 1rem;
          padding-right: 1rem;"><table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:16px;"><tbody><tr><td/><td role="presentation" class="w-[22px]" style="width: 22px;"><a href="https://www.fiction.com"><img style="display:block;outline:none;border:none;text-decoration:none; border-radius: 0.375rem; border-width: 2px !important; border-color: rgb(255,255,255,0.1) !important; border-style: solid !important;" src="https://media.fiction.com/fiction-relative-media/med677ab309bb65e02c6c539f03-fiction-icon.png?blurhash=U9EMLDD%2500%3Fb9FWBay%25M00Rj%7Eqxu_3%25Mt74n" width="22" class="rounded-md !border-2 !border-white/10 !border-solid"/></a></td><td role="presentation" class="pl-3" style="padding-left: 0.75rem;"><a href="https://www.fiction.com" class="text-inherit font-normal text-[14px] no-underline" style="color: inherit; font-weight: 400; font-size: 14px; text-decoration-line: none;">Fiction</a></td></tr></tbody></table><table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td><h1 style="margin:0 0 0 0;font-weight:bold;font-size:24px;line-height:1.33;" data-test-id="email-title" data-title="Your Sign-In Link is Ready">Your Sign-In Link is Ready</h1><h3 style="margin:0 0 0 0;font-weight:normal;font-size:24px;line-height:1.33; margin-top: 0px;
          margin-bottom: 0px; opacity: 0.6;" data-test-id="email-sub-title" class="my-0 opacity-60"><span>Click the link below to log in</span> <span class="opacity-30" style="opacity: 0.3;">↘</span></h3></td></tr></tbody></table><hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-top:1px solid #DEDFE2;opacity:.5;margin:2rem 0;"/><div data-test-id="email-content" class="body-content"><p style="font-size:1.1rem;line-height:1.65;font-weight:normal"><a href="http://localhost:[port]/__transaction/magic-login?token=[token]&code=[code]&email=[email]&userId=[userId]" target="_blank" style="color:">This link</a> will sign you in to Test Fiction App.</p>
      <p style="font-size:1.1rem;line-height:1.65;font-weight:normal">Alternatively, you can login with this code: <strong style="font-weight:bold">[code]</strong>.</p>
      <p style="font-size:1.1rem;line-height:1.65;font-weight:normal">If you didn't request this email, don't worry, you can safely ignore it.</p>
      </div><table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" class="mt-8 mb-8 text-left" style="margin-top: 2rem; margin-bottom: 2rem; text-align: left;"><tbody><tr><td><table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;"><tbody><tr><td></td><td role="presentation" class=""><a style="line-height:100%;text-decoration:none;display:inline-block;max-width:100%;padding:0px 0px 0px 0px;white-space:nowrap; background-color: rgb(44,103,255); color: rgb(255,255,255); padding-top: 0.75rem;
          padding-bottom: 0.75rem; padding-left: 1rem;
          padding-right: 1rem; border-radius: 0.375rem; font-size: 16px; border-radius: 9999px; font-weight: 500; user-select: none; transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;" href="http://localhost:[port]/__transaction/magic-login?token=[token]&code=[code]&email=[email]&userId=[userId]" data-type="primary" class="hover:opacity-80">Sign in to Test Fiction App</a></td></tr></tbody></table></td></tr></tbody></table><hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-top:1px solid #DEDFE2;opacity:.5;margin:2rem 0;"/><table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" class="subtle-text text-normal" style="margin-top: 2rem; text-align: left; font-size: 0.75rem;
          line-height: 1rem;"><tbody><tr><td/><td role="presentation" class="w-[65%] align-top" style="width: 65%; vertical-align: top;"><img style="display: block; outline: none; border: none; text-decoration: none" src="https://media.fiction.com/fiction-relative-media/med677ab3098ff4ae1bc17aa156-fiction-email-footer.png?blurhash=U2DS%5D%5D%7Eq00_N00_4%25M4n00_N%3FcIU%7Eq9F%25M-%3B" width="80" alt="Powered by Fiction.com"/><p style="font-size:14px;line-height:24px;margin:16px 0;"><a class="text-normal hover:opacity-80" href="https://www.fiction.com" style="margin-top: 1rem; text-decoration-line: none; color: inherit; opacity: 0.4;">Powered by Fiction.com ↗ </a></p></td><td role="presentation" class="w-[35%] text-right align-top text-xs" style="width: 35%; text-align: right; vertical-align: top; font-size: 0.75rem;
          line-height: 1rem;"><!--v-if--><!--v-if--></td></tr></tbody></table></div></body></html></tailwind-clean-component>"
    `)
  })

  it('logs in when callback url is visited and redirects to base route', async () => {
    await kit.performActions({
      caller: 'signin1',
      path: vars?.callbackUrl || '',
      actions: [
        { type: 'visible', selector: '[data-pathname="/"]' },
      ],
    })
  })

  it('has fields ', async () => {
    const fields = { email: `foo-${shortId()}@bar.com`, password: 'password123', name: 'Test User' }
    await kit.performActions({
      caller: 'signin2',
      path: '/auth/register',
      actions: [
        { type: 'click', selector: '[data-test-id="to-welcome"]' },
        { type: 'visible', selector: '[data-test-id="to-register"]', wait: 1000 },
        { type: 'exists', selector: '[data-test-id="google-login-button"]' },
        { type: 'visible', selector: '[data-test-id="submit-button-login"]' },
        { type: 'click', selector: '[data-test-id="to-register"]', wait: 1000 },
        { type: 'visible', selector: '[data-test-id="to-welcome"]', waitAfter: 1000 },
        { type: 'fill', selector: '[data-test-id="input-email"] input[type="email"]', text: fields.email },
        { type: 'fill', selector: '[data-test-id="input-new-password"] input', text: fields.password },
        { type: 'value', selector: '[data-test-id="form"]', onValue: (v) => {
          expect(v?.email).toBe(fields.email)
          expect(v?.password).toBe(fields.password)
        } },
        { type: 'click', selector: '[data-test-id="submit-button-register"]', wait: 1000 },
        { type: 'visible', selector: '[data-pathname="/auth/confirm"]' },
        { type: 'click', selector: '[data-test-id="to-one-time-code"]', wait: 1000 },
        {
          wait: 1000,
          type: 'keyboard',
          selector: '[data-test-id="input-one-time-code"] [data-test-id="digit-1"]',
          key: ['1', '2', '3', '4', '5', '6'],
        },
        { type: 'visible', selector: '[data-pathname="/onboard"]' },
        { type: 'goto', location: '/?_logout=1', waitAfter: 1000 },
        { type: 'visible', selector: '[data-pathname="/auth"]' },
      ],
    })
  })
})
