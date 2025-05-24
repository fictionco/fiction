/* eslint-disable no-irregular-whitespace */

import { testEnvFile } from '@fiction/core/test-utils'
import { createUiTestingKit } from '@fiction/core/test-utils/kit'
import fs from 'fs-extra'
import { afterAll, describe, expect, it } from 'vitest'
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
    // const r = await testUtils.emailAction.serveSend({
    //   to: user.email || '',
    //   origin: testUtils.fictionApp.appUrl.value || '',
    //   recipient: user,
    //   queryVars: { code: user.verify?.code || '' },
    // }, { server: true })

    // const callbackUrl = r.emailVars?.callbackUrl || ''

    // const emailHtml = r.data?.html
    // expect(emailHtml).toBeDefined()
    // expect(user.verify?.code).toBeDefined()
    // expect(emailHtml).toContain(user.verify?.code)
    // expect(emailHtml, 'contains callbackUrl').toContain(callbackUrl.replace(/&/g, '&amp;'))
    // expect(emailHtml).toContain('Email Action Title')

    // const code = user.verify?.code || ''

    // if (!code)
    //   throw new Error('missing code')

    // if (!user.email)
    //   throw new Error('missing email')

    // const replaced = emailActionSnapshot(r.data?.html || '', r.emailVars)
    // expect(replaced).toMatchInlineSnapshot(`
    //   "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    //   <html xmlns="http://www.w3.org/1999/xhtml"  lang="en" dir="ltr"><head>
    //   <meta charset="utf-8">
    //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //   <title>Test Fiction App: Email Action Subject</title>
    //   <style>
    //          /* Base typography */
    //           body { line-height: 1.6; font-size: 18px; }

    //           p, ul, ol, dl {
    //           margin-top: 1.5em;
    //           margin-bottom: 1.5em;
    //           }

    //           figure,  pre, table, .x-button-container {
    //             margin: 2em 0;
    //           }

    //           p, ul, ol, dl, blockquote, pre, table {
    //             font-size: 18px;
    //             line-height: 1.6;
    //           }

    //           /* Headers */
    //           h1, h2, h3, h4, h5, h6 {
    //           margin: 1.5em 0 0.75em;
    //           line-height: 1.3;
    //           }
    //           h1 { font-size: 36px; }
    //           h2 { font-size: 27px; }
    //           h3 { font-size: 22px; }
    //           h4 { font-size: 20px; }
    //           h5 { font-size: 18px; }
    //           h6 { font-size: 18px; }

    //           /* Lists and definition terms */
    //           ul, ol, dl {
    //           padding-left: 1.5em;
    //           font-size: 18px;
    //           }
    //           ul {list-style-type: disc;}
    //           ol {list-style-type: decimal;}
    //           li { margin: 0.5em 0; }
    //           li p { margin: 0; }
    //           dt {
    //           font-weight: 600;
    //           margin-top: 1em;
    //           }
    //           dd { margin-left: 1.5em; }

    //           blockquote {

    //             margin-left: 1em;
    //             padding-left: 1.5em;
    //             font-style: italic;
    //             border-left: 3px solid #b3b9c5;
    //           }

    //           blockquote p, blockquote{
    //             line-height: 1.5;
    //             font-size: 20px;
    //           }

    //           blockquote p {
    //             margin: 1em 0;
    //           }
    //           blockquote p:first-child {
    //             margin-top: 0;
    //           }
    //           blockquote p:last-child {
    //             margin-bottom: 0;
    //           }

    //           pre{
    //             padding: 1em;
    //             background-color: #e6e9f1;
    //             border-radius: 0.5em;
    //             overflow-x: auto;
    //             font-size:16px;
    //           }
    //           pre code {
    //             background-color: transparent;
    //             padding: 0;
    //             border-radius: 0;
    //           }

    //           code {
    //             background-color: #e6e9f1;
    //             padding: 0.1em 0.3em;
    //             border-radius: 0.3em;
    //             font-size:16px;
    //           }

    //           .prose-content table {
    //             width: 100%;
    //             border-collapse: collapse;
    //             margin: 1.5em 0;
    //           }
    //           .prose-content tbody tr:nth-child(odd) {
    //             background-color: rgba(0,0,0,.05);
    //           }
    //           .prose-content table td {
    //             vertical-align: top;
    //             text-align: center;
    //           }

    //           /* Images and figures */
    //           img {
    //             max-width: 100%;
    //             height: auto;
    //             border-radius: 0.5em;
    //           }
    //           img[data-emoji] {
    //             display: inline;
    //             border-radius: 0;
    //             vertical-align: -0.1em;
    //           }
    //           figure {
    //             text-align: center;
    //           }
    //           figcaption {
    //             margin-top: 0.75em;
    //             font-size: 16px;
    //             color: #394151;
    //           }
    //           /* Links */
    //           #themed-content a{
    //             color: #2563eb;
    //             text-decoration: underline;
    //           }
    //           #themed-content a:hover {
    //             color: #3b82f6;
    //           }

    //           #themed-footer {
    //             color: #0e0f11
    //           }
    //           #themed-footer a {
    //             color: inherit;
    //             text-decoration: none;
    //           }
    //           #themed-footer a:hover {
    //           text-decoration: underline;
    //           }

    //           #last-line a, #last-line span, #last-line  {
    //             font-size: 11px;
    //           }
    //           #last-line a {
    //             color: #7A8599;
    //             text-decoration: none;
    //           }
    //           #last-line a:hover {
    //             text-decoration: underline;
    //           }

    //           #last-line span {
    //             opacity: 0.6;
    //             margin: 0 1em;
    //           }

    //           .x-button {
    //             display: inline-block;
    //             padding: 12px 18px;
    //             background-color: #2563eb;
    //             color: #ffffff !important;
    //             text-decoration: none !important;
    //             border-radius: 9999px;
    //             font-weight: 600;
    //             margin: 0 auto;
    //             text-align: center;
    //             mso-padding-alt: 0;
    //             mso-text-raise: 7.5pt;
    //             font-size: 16px;
    //             line-height: 1;
    //           }

    //           .x-button.naked {
    //             background-color: rgba(229,231,235,0.4);
    //             color: #2563eb;
    //           }

    //           .x-button img {
    //             vertical-align: -0.3em;
    //           }

    //           .x-button:hover {
    //             background-color: #3b82f6;
    //           }

    //           .x-button.sm{
    //             padding: 8px 16px;
    //             font-size: 14px;
    //           }

    //           .x-button.lg{
    //             padding: 14px 24px;
    //             font-size: 18px;
    //           }

    //           hr { border: none; border-top: 1px solid rgba(0,0,0,.1); margin: 2em 0; }</style>
    //   <meta http-equiv="content-type" content="text/html; charset=utf-8">
    //   <meta name="description" content="Email Action Title - Email Action Subtitle">
    //   <meta name="color-scheme" content="light dark">
    //   <meta name="supported-color-schemes" content="light dark">
    //   </head><body  style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif;font-size:18px;color:#0e0f11">

    //   <div><!-- Preview Text Hack --><div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;font-family:sans-serif;">Email Action Title - Email Action Subtitle <!-- Repeating characters to fill preview area -->                                                                                 </div><!-- Main Container --><div style="width:100%;max-width:600px;margin:0 auto;padding:32px 0;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif;color:#0e0f11;"><!-- Super Title --><table style="margin-bottom:16px;"><tbody><tr><td><img src="https://media.fiction.com/_assets/fiction-icon.png" width="22" alt="Logo" style="display:block;border-radius:5px;border:1.5px solid #ffffff;width:22px;height:22px;object-fit:cover;margin-right:6px;"></td><td><a href="https://www.fiction.com" style="color:#394151;text-decoration:none;font-weight:500;font-size:14px;">Fiction</a></td></tr></tbody></table><!-- Title Section --><div id="themed-content" class="themed-content"><h1 style="margin:0 0 8px;font-size:24px;line-height:1.33;">Email Action Title</h1><h3 style="margin:0;font-weight:normal;font-size:24px;line-height:1.33;color:#394151;">Email Action Subtitle</h3><hr style="border:none;border-top:1px solid #b3b9c5;margin:2em 0; width: 5em;"><!-- Featured Image --><!----><!-- Content --><div class="prose-content">Email Action Body Markdown</div><!-- Buttons --><div style="margin:32px 0;"><!--[--><a href="http://localhost:[port]/__transaction/test-action?code=[code]&amp;token=[token]&amp;email=[email]&amp;userId=[userId]" class="x-button">Verify Email</a><!--]--></div></div><hr style="border:none;border-top:1px solid #DEDFE2;margin:3em 0 2em; width: 100%;"><!-- Footer --><div id="themed-footer" style="margin-top:2em;"><!-- Footer Links --><!----><div style="font-size:13px;color:#7A8599;"><div style="font-weight:500;color:#394151;"> © 2025 Test Fiction App</div><div style="margin-top:6px;font-size:11px;">23807 Aliso Creek Rd Suite 100, Laguna Niguel, CA 92677</div></div><!-- Legal Footer --><table id="last-line" style="width:100%;margin-top:32px;font-size:11px;" cellpadding="0" cellspacing="0"><tbody><tr><!----><td style="text-align:left;"><a href="https://www.fiction.com" target="_blank" rel="noopener"> Powered by Fiction.com </a></td></tr></tbody></table></div></div></div>

    //   </body></html>"
    // `)

    await kit.performActions({
      caller: 'emailActions',
      path: '/',
      actions: [
        { type: 'visible', selector: `[data-action-id="123"]` },
      ],
    })
  })
})
