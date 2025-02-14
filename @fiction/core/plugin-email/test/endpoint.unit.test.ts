/* eslint-disable no-irregular-whitespace */
import type { EmailSendConfig } from '..'
import { afterAll, describe, expect, it } from 'vitest'

import { FictionAws } from '../../plugin-aws'
import { FictionMedia } from '../../plugin-media'
import { createTestUtils, testEnvFile } from '../../test-utils'
import { getEnvVars, shortId } from '../../utils'
import { sampleHtml } from '../preview/content'
import { replaceEmailDomain } from '../util'

describe('utils', () => {
  it('replaces email domain', () => {
    const basicEmail = 'Albert Einstein <test@example.com>'
    const replaced = replaceEmailDomain(basicEmail, 'fiction.com')

    expect(replaced).toBe('Albert Einstein <test@fiction.com>')
  })
})

describe('transactional email', async () => {
  const testUtils = createTestUtils({ envFiles: [testEnvFile] })

  const v = getEnvVars(testUtils.fictionEnv, ['AWS_ACCESS_KEY', 'AWS_ACCESS_KEY_SECRET', 'AWS_BUCKET_MEDIA'] as const)

  const { awsAccessKey, awsAccessKeySecret, awsBucketMedia } = v

  const fictionAws = new FictionAws({ ...testUtils, awsAccessKey, awsAccessKeySecret })
  const fictionMedia = new FictionMedia({ ...testUtils, fictionAws, awsBucketMedia })

  const { orgId, user } = await testUtils.init()

  afterAll(async () => testUtils.close())

  describe('sends a transactional email', async () => {
    const superImage = await fictionMedia.relativeMedia({ url: new URL('../img/fiction-icon.png', import.meta.url).href, orgId })
    const footerImage = await fictionMedia.relativeMedia({ url: new URL('../img/fiction-email-footer.png', import.meta.url).href, orgId })
    const confirmEmail: EmailSendConfig = {
      to: 'arpowers@gmail.com',
      fromName: 'Fiction.com',
      fromEmail: 'admin@fiction.com',
      subject: `Test Space (test email 🧪🧪🧪)`,
      title: 'Welcome to Space 🚀',
      subTitle: 'This is a test email to test formatting of various elements.🧪',
      bodyHtml: sampleHtml,
      actions: [
        {
          theme: 'primary',
          label: `Confirm email address &#x2192;`,
          href: '#',
        },
      ],
      mediaSuper: {
        media: { url: superImage.url },
        label: 'Fiction',
        href: 'https://www.fiction.com',
      },
      mediaFooter: {
        media: { url: footerImage.url },
        label: 'Powered by Fiction.com',
        href: 'https://www.fiction.com',
      },
      unsubscribeUrl: 'https://www.fiction.com/unsubscribe',
      env: 'test',
      postId: shortId(),
      caller: 'testEmailLayout',
      toUserId: user.userId,
      fromOrgId: orgId,
    }
    // always send real email
    const emailMode = 'send'

    const shouldBeIsSend = emailMode === 'send'

    const result = await testUtils.fictionEmail.renderAndSendEmail(confirmEmail, { server: true, isTest: true, emailMode })

    it('renders required email structure elements', async () => {
      const html = result.data?.html

      expect(html).toBeDefined()

      // Core Structure - Fixed patterns
      const patterns = [
        {
          desc: 'DOCTYPE declaration',
          pattern: /<!DOCTYPE html PUBLIC "-\/\/W3C\/\/DTD XHTML 1\.0 Transitional\/\/EN"/,
        },
        {
          desc: 'HTML tag with attributes',
          pattern: /<html[^>]*lang="en"[^>]*dir="ltr"/,
        },
        {
          desc: 'Meta charset',
          pattern: /<meta[^>]*Content-Type[^>]*charset=UTF-8/,
        },
        {
          desc: 'Viewport meta',
          pattern: /<meta[^>]*viewport[^>]*width=device-width/,
        },
        {
          desc: 'Apple format meta',
          pattern: /<meta[^>]*x-apple-disable-message-reformatting/,
        },
        {
          desc: 'Complete head section',
          pattern: /<head>[\s\S]*?<\/head>/,
        },
        {
          desc: 'Style definitions',
          pattern: /<style[^>]*data-id="__vue-email-style"[\s\S]*?<\/style>/,
        },
        {
          desc: 'Preview text div',
          pattern: /<div[^>]*style="[^"]*display:\s*none[^"]*"[\s\S]*?<\/div>/,
        },
        {
          desc: 'Body tag with font family',
          pattern: /<body[^>]*font-family:[^>]*>/,
        },
      ]

      // Test each pattern
      patterns.forEach(({ desc, pattern }) => {
        expect(html, `Missing or invalid ${desc}`).toMatch(pattern)
      })
    })

    it('sends email correctly', () => {
      expect(result.data?.isSent).toBe(shouldBeIsSend)
    })

    it('renders markdown content', async () => {
      if (!result.data?.bodyMarkdown) {
        throw new Error('No result bodyMarkdown')
      }

      expect(result.data.bodyMarkdown).toContain('---')
      expect(result.data.bodyMarkdown).toContain('<figure>')

      expect(result.data.bodyMarkdown).toMatchInlineSnapshot(`
        "# Welcome to the [Galactic Gazette](#)! Your Ultimate Source for Space Adventures!

        _Discover the universe, one newsletter at a time! ✨_

        <figure><img src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&amp;w=4472&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Earth from space"><figcaption><a href="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&amp;w=4472&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">Earth from Space</a></figcaption></figure>

        Imagine a world where <mark>space travel</mark> is as common as taking a bus. Our latest article explores the **future of interstellar journeys**. Is <del>space tourism</del> now a reality?

        [Subscribe Now 🚀](https://www.fiction.com)

        ## Breaking News: The Andromeda Galaxy is Closer than We Thought!

        <figure><img src="https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&amp;w=4474&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Andromeda galaxy"><figcaption><a href="https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&amp;w=4474&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">The Andromeda Galaxy</a></figcaption></figure>

        New research indicates that our neighboring galaxy, **Andromeda**, might be on a collision course with the Milky Way. Experts weigh in on what this means for <sup>space</sup> enthusiasts and astronomers alike.

        ### Stunning Eclipse Captured by Space Station

        <figure><img src="https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?q=80&amp;w=2268&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Eclipse"><figcaption><a href="https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?q=80&amp;w=2268&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">Spectacular Eclipse</a></figcaption></figure>

        **Check out these amazing photos** of the recent solar eclipse taken from the [International Space Station](https://www.fiction.com). Witness the awe-inspiring beauty of our universe.

        *   **🎆 Latest Discovery:** New exoplanet in the habitable zone.
        *   <mark>SpaceX</mark> announces new moon mission.
        *   NASA's next rover to search for signs of life on Mars.
        *   Galactic Federation holds first interstellar summit.
        *   Exclusive Interview: Astronaut shares their experiences from space.

        **🌟 Editor's Pick:** Don't miss our exclusive interview with veteran astronaut Sarah Chen about life aboard the ISS!

        ## Astronaut's Guide to Surviving Space

        <figure><img src="https://images.unsplash.com/photo-1576174464184-fb78fe882bfd?q=80&amp;w=4000&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Astronaut"><figcaption><a href="https://images.unsplash.com/photo-1576174464184-fb78fe882bfd?q=80&amp;w=4000&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">Life in Space</a></figcaption></figure>

        Learn about the _challenges and rewards_ of living and working in space from our **featured astronaut**. From <sup>zero gravity</sup> workouts to eating <sub>dehydrated meals</sub>, get an inside look at astronaut life.

        ### Fun Facts About Space:

        #### Did You Know?

        The **International Space Station** travels at a speed of approximately 28,000 kilometers per hour (17,500 miles per hour).

        1.  The sun's core is about 27 million degrees Fahrenheit.
        2.  Venus is the hottest planet in our solar system.
        3.  Jupiter has the shortest day of all the planets.
        4.  Saturn's rings are made of ice and rock.
        5.  The moon is drifting away from Earth at a rate of 3.8 centimeters per year.

        ---

        ##### Space Technology Advancements

        <del>Old satellite technology</del> is being replaced with cutting-edge advancements. Learn more about the latest in space tech!

        > "The universe is under no obligation to make sense to you." - Neil deGrasse Tyson

        ###### Space Exploration: The Final Frontier

        Discover the latest missions and milestones in space exploration. From Mars rovers to deep space probes, [stay updated](https://www.fiction.com) with our comprehensive coverage.

        ---

        <dl><dt>Galactic Economy</dt><dd>How space mining is revolutionizing the economy.</dd><dt>Space Tourism</dt><dd>Upcoming missions you can join as a tourist.</dd><dt>Astronomical Events</dt><dd>Don't miss the next meteor shower!</dd><dd>Upcoming lunar and solar eclipses.</dd></dl>

        Finally, after months of preparation, the crew is ready to embark on their journey to Mars. **Stay tuned** for live updates and exclusive coverage!"
      `)
    })

    it('renders html content', async () => {
      expect(result.data?.html).toMatchInlineSnapshot(`
        "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><tailwind-clean-component env="test" campaignId="cywmq" caller="testEmailLayout" toUserId="usr67aa1770850033033784a7fc" fromOrgId="org67aa1770087c9fe37bff8c7f"><html lang="en" dir="ltr" class="" style=""><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/><meta name="x-apple-disable-message-reformatting"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/><title>Test Space (test email 🧪🧪🧪)</title><meta name="description" content="Welcome to Space 🚀 -- This is a test email to test formatting of various elements.🧪"/><style data-id="__vue-email-style">
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
                </style></head><div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0;">Welcome to Space 🚀 -- This is a test email to test formatting of various elements.🧪<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div></div><body style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;;"><div class="py-8 px-4" style="max-width:600px;margin:0px auto;color:#0e0f11; padding-top: 2rem;
            padding-bottom: 2rem; padding-left: 1rem;
            padding-right: 1rem;"><table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:16px;"><tbody><tr><td/><td role="presentation" class="w-[22px]" style="width: 22px;"><a href="https://www.fiction.com"><img style="display:block;outline:none;border:none;text-decoration:none; border-radius: 0.375rem; border-width: 2px !important; border-color: rgb(255,255,255,0.1) !important; border-style: solid !important;" src="https://fiction-media-dev.s3.amazonaws.com/fiction-relative-media/med67aa1770badc1d6433a5b570-fiction-icon.png?blurhash=U9EMLDD%2500%3Fb9FWBay%25M00Rj%7Eqxu_3%25Mt74n" width="22" class="rounded-md !border-2 !border-white/10 !border-solid"/></a></td><td role="presentation" class="pl-3" style="padding-left: 0.75rem;"><a href="https://www.fiction.com" class="text-inherit font-normal text-[14px] no-underline" style="color: inherit; font-weight: 400; font-size: 14px; text-decoration-line: none;">Fiction</a></td></tr></tbody></table><table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td><h1 style="margin:0 0 0 0;font-weight:bold;font-size:24px;line-height:1.33;" data-test-id="email-title" data-title="Welcome to Space 🚀">Welcome to Space 🚀</h1><h3 style="margin:0 0 0 0;font-weight:normal;font-size:24px;line-height:1.33; margin-top: 0px;
            margin-bottom: 0px; opacity: 0.6;" data-test-id="email-sub-title" class="my-0 opacity-60"><span>This is a test email to test formatting of various elements.🧪</span> <span class="opacity-30" style="opacity: 0.3;">↘</span></h3></td></tr></tbody></table><hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-top:1px solid #DEDFE2;opacity:.5;margin:2rem 0;"/><div data-test-id="email-content" class="body-content"><h1 style="font-size:2.2rem;line-height:1.3;font-weight:700">Welcome to the <a href="#" target="_blank" style="color:">Galactic Gazette</a>! Your Ultimate Source for Space Adventures!</h1><p style="font-size:1.1rem;line-height:1.65;font-weight:normal"><em style="font-style:italic">Discover the universe, one newsletter at a time! ✨</em></p>
        <figure><img src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=4472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Earth from space"/><figcaption><a href="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=4472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">Earth from Space</a></figcaption></figure>

        <p style="font-size:1.1rem;line-height:1.65;font-weight:normal">Imagine a world where <mark>space travel</mark> is as common as taking a bus. Our latest article explores the <strong style="font-weight:bold">future of interstellar journeys</strong>. Is <del>space tourism</del> now a reality?</p>
        <p style="font-size:1.1rem;line-height:1.65;font-weight:normal"><a href="https://www.fiction.com" target="_blank" style="color:">Subscribe Now 🚀</a></p>
        <h2 style="font-size:1.8rem;line-height:1.3;font-weight:700;margin-top:2rem">Breaking News: The Andromeda Galaxy is Closer than We Thought!</h2><figure><img src="https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=4474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Andromeda galaxy"/><figcaption><a href="https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=4474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">The Andromeda Galaxy</a></figcaption></figure>

        <p style="font-size:1.1rem;line-height:1.65;font-weight:normal">New research indicates that our neighboring galaxy, <strong style="font-weight:bold">Andromeda</strong>, might be on a collision course with the Milky Way. Experts weigh in on what this means for <sup>space</sup> enthusiasts and astronomers alike.</p>
        <h3 style="font-size:1.6rem;line-height:1.4;font-weight:700;opacity:.8;margin-top:1.5rem">Stunning Eclipse Captured by Space Station</h3><figure><img src="https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?q=80&w=2268&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Eclipse"/><figcaption><a href="https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?q=80&w=2268&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">Spectacular Eclipse</a></figcaption></figure>

        <p style="font-size:1.1rem;line-height:1.65;font-weight:normal"><strong style="font-weight:bold">Check out these amazing photos</strong> of the recent solar eclipse taken from the <a href="https://www.fiction.com" target="_blank" style="color:">International Space Station</a>. Witness the awe-inspiring beauty of our universe.</p>
        <ul>
        <li style="padding:.5rem 0"><strong style="font-weight:bold">🎆 Latest Discovery:*</strong>New exoplanet in the habitable zone.</li>
        <li style="padding:.5rem 0"><mark>SpaceX</mark> announces new moon mission.</li>
        <li style="padding:.5rem 0">NASA's next rover to search for signs of life on Mars.</li>
        <li style="padding:.5rem 0">Galactic Federation holds first interstellar summit.</li>
        <li style="padding:.5rem 0">Exclusive Interview: Astronaut shares their experiences from space.</li>
        </ul>
        <p style="font-size:1.1rem;line-height:1.65;font-weight:normal"><strong style="font-weight:bold">🌟 Editor's Pick:*</strong>Don't miss our exclusive interview with veteran astronaut Sarah Chen about life aboard the ISS!</p>
        <h2 style="font-size:1.8rem;line-height:1.3;font-weight:700;margin-top:2rem">Astronaut's Guide to Surviving Space</h2><figure><img src="https://images.unsplash.com/photo-1576174464184-fb78fe882bfd?q=80&w=4000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Astronaut"/><figcaption><a href="https://images.unsplash.com/photo-1576174464184-fb78fe882bfd?q=80&w=4000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">Life in Space</a></figcaption></figure>

        <p style="font-size:1.1rem;line-height:1.65;font-weight:normal">Learn about the <em style="font-style:italic">challenges and rewards</em> of living and working in space from our <strong style="font-weight:bold">featured astronaut</strong>. From <sup>zero gravity</sup> workouts to eating <sub>dehydrated meals</sub>, get an inside look at astronaut life.</p>
        <h3 style="font-size:1.6rem;line-height:1.4;font-weight:700;opacity:.8;margin-top:1.5rem">Fun Facts About Space:</h3><h4 style="font-size:1.3rem;line-height:1.4;font-weight:600">Did You Know?</h4><p style="font-size:1.1rem;line-height:1.65;font-weight:normal">The <strong style="font-weight:bold">International Space Station</strong> travels at a speed of approximately 28,000 kilometers per hour (17,500 miles per hour).</p>
        <ol>
        <li style="padding:.5rem 0">The sun's core is about 27 million degrees Fahrenheit.</li>
        <li style="padding:.5rem 0">Venus is the hottest planet in our solar system.</li>
        <li style="padding:.5rem 0">Jupiter has the shortest day of all the planets.</li>
        <li style="padding:.5rem 0">Saturn's rings are made of ice and rock.</li>
        <li style="padding:.5rem 0">The moon is drifting away from Earth at a rate of 3.8 centimeters per year.</li>
        </ol>
        <hr style="border:none;border-top:1px solid #DEDFE2;opacity:.5;margin:2rem 0"/>
        <h5 style="font-size:1.2rem;line-height:1.4;font-weight:600">Space Technology Advancements</h5><p style="font-size:1.1rem;line-height:1.65;font-weight:normal"><del>Old satellite technology</del> is being replaced with cutting-edge advancements. Learn more about the latest in space tech!</p>
        <blockquote style="padding:0 0 0 1.5rem;margin:1.5rem 0;border-left:2px solid #DEDFE2;background:transparent;font-size:1.45em;font-style:italic">
        <p style="font-size:1.1rem;line-height:1.65;font-weight:normal">"The universe is under no obligation to make sense to you." - Neil deGrasse Tyson</p>
        </blockquote>
        <h6 style="font-size:1rem;line-height:1.4;font-weight:600">Space Exploration: The Final Frontier</h6><p style="font-size:1.1rem;line-height:1.65;font-weight:normal">Discover the latest missions and milestones in space exploration. From Mars rovers to deep space probes, <a href="https://www.fiction.com" target="_blank" style="color:">stay updated</a> with our comprehensive coverage.</p>
        <hr style="border:none;border-top:1px solid #DEDFE2;opacity:.5;margin:2rem 0"/>
        <dl><dt>Galactic Economy</dt><dd>How space mining is revolutionizing the economy.</dd><dt>Space Tourism</dt><dd>Upcoming missions you can join as a tourist.</dd><dt>Astronomical Events</dt><dd>Don't miss the next meteor shower!</dd><dd>Upcoming lunar and solar eclipses.</dd></dl>

        <p style="font-size:1.1rem;line-height:1.65;font-weight:normal">Finally, after months of preparation, the crew is ready to embark on their journey to Mars. <strong style="font-weight:bold">Stay tuned</strong> for live updates and exclusive coverage!</p>
        </div><table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" class="mt-8 mb-8 text-left" style="margin-top: 2rem; margin-bottom: 2rem; text-align: left;"><tbody><tr><td><table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;"><tbody><tr><td></td><td role="presentation" class=""><a style="line-height:100%;text-decoration:none;display:inline-block;max-width:100%;padding:0px 0px 0px 0px;white-space:nowrap; background-color: rgb(44,103,255); color: rgb(255,255,255); padding-top: 0.75rem;
            padding-bottom: 0.75rem; padding-left: 1rem;
            padding-right: 1rem; border-radius: 0.375rem; font-size: 16px; border-radius: 9999px; font-weight: 500; user-select: none; transition-property: all;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 150ms;" href="#" data-type="primary" class="hover:opacity-80">Confirm email address →</a></td></tr></tbody></table></td></tr></tbody></table><hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-top:1px solid #DEDFE2;opacity:.5;margin:2rem 0;"/><table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" class="subtle-text text-normal" style="margin-top: 2rem; text-align: left; font-size: 0.75rem;
            line-height: 1rem;"><tbody><tr><td/><td role="presentation" class="w-[65%] align-top" style="width: 65%; vertical-align: top;"><img style="display: block; outline: none; border: none; text-decoration: none" src="https://fiction-media-dev.s3.amazonaws.com/fiction-relative-media/med67aa17744856b03c32263f44-fiction-email-footer.png?blurhash=U2DS%5D%5D%7Eq00_N00_4%25M4n00_N%3FcIU%7Eq9F%25M-%3B" width="80" alt="Powered by Fiction.com"/><p style="font-size:14px;line-height:24px;margin:16px 0;"><a class="text-normal hover:opacity-80" href="https://www.fiction.com" style="margin-top: 1rem; text-decoration-line: none; color: inherit; opacity: 0.4;">Powered by Fiction.com ↗ </a></p></td><td role="presentation" class="w-[35%] text-right align-top text-xs" style="width: 35%; text-align: right; vertical-align: top; font-size: 0.75rem;
            line-height: 1rem;"><!--v-if--><a href="https://www.fiction.com/unsubscribe" class="opacity-50 text-inherit no-underline" style="opacity: 0.5; color: inherit; text-decoration-line: none;"> Unsubscribe </a></td></tr></tbody></table></div></body></html></tailwind-clean-component>"
      `)

      expect(result.status).toBe('success')

      expect(result.data?.html).toContain(confirmEmail.subject)
      expect(result.data?.html).toContain(confirmEmail.title)
      expect(result.data?.html).toContain(confirmEmail.subTitle)
      expect(result.data?.html).toContain('Welcome')
      expect(result.data?.html).toContain('<hr')
      expect(result.data?.html).toContain('figure')
      expect(result.data?.html).toContain('figcaption')
      expect(result.data?.html).toContain('mark')
      expect(result.data?.html).toContain('del')
      expect(result.data?.html).toContain('sup')
      expect(result.data?.html).toContain('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"')
      expect(result.data?.html.toLowerCase()).toContain('unsubscribe')
      expect(result.data?.html).toContain('🎆')
    })

    testUtils.fictionEmail.isTest = true
  })
})
