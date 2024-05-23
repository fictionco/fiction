/* eslint-disable no-irregular-whitespace */
import { createTestUtils, testEnvFile } from '@fiction/core/test-utils'

import { afterAll, describe, expect, it } from 'vitest'
import type { TransactionalEmailConfig } from '..'
import { sampleHtml } from '../preview/content'
import { FictionAws } from '../../plugin-aws'
import { FictionMedia } from '../../plugin-media'

describe('transactional email', async () => {
  const testUtils = createTestUtils({
    envFiles: [testEnvFile],
  })

  const awsAccessKey = testUtils.fictionEnv.var('AWS_ACCESS_KEY')
  const awsAccessKeySecret = testUtils.fictionEnv.var('AWS_ACCESS_KEY_SECRET')

  if (!awsAccessKey || !awsAccessKeySecret)
    throw new Error(`missing env vars key:${awsAccessKey?.length}, secret:${awsAccessKeySecret?.length}`)

  const fictionAws = new FictionAws({
    fictionEnv: testUtils.fictionEnv,
    awsAccessKey,
    awsAccessKeySecret,
  })
  const fictionMedia = new FictionMedia({
    ...testUtils,
    fictionAws,
    bucket: 'factor-tests',
  })

  await testUtils.init()

  afterAll(async () => {
    await testUtils.close()
  })

  it('sends a transactional email', async () => {
    const superImage = await fictionMedia.relativeMedia({ url: new URL('../img/fiction-icon.png', import.meta.url).href })
    const footerImage = await fictionMedia.relativeMedia({ url: new URL('../img/fiction-email-footer.png', import.meta.url).href })
    const confirmEmail: TransactionalEmailConfig = {
      to: 'arpowers@gmail.com',
      from: 'Fiction.com <admin@fiction.com>',
      subject: 'Test Space (test email 🧪🧪🧪)',
      heading: 'Welcome to Space 🚀',
      subHeading: 'This is a test email to test formatting of various elements.🧪',
      bodyHtml: sampleHtml,
      actions: [
        {
          btn: 'primary',
          name: `Confirm email address &#x2192;`,
          href: '#',
        },
      ],
      mediaSuper: {
        media: { url: superImage.url },
        name: 'Fiction',
        href: 'https://www.fiction.com',
      },
      mediaFooter: {
        media: { url: footerImage.url },
        name: 'Personal Marketing Tools by Fiction',
        href: 'https://www.fiction.com',
      },
      unsubscribeUrl: 'https://www.fiction.com/unsubscribe',
    }

    testUtils.fictionEmail.isTest = true

    const result = await testUtils.fictionEmail.sendTransactional(confirmEmail)

    expect(result.data?.isSent).toBe(false)

    expect(result.data?.bodyMarkdown).toContain('---')
    expect(result.data?.bodyMarkdown).toContain('<figure>')

    expect(result.data?.bodyMarkdown).toMatchInlineSnapshot(`
      "# Welcome to the [Galactic Gazette](#)! Your Ultimate Source for Space Adventures!

      _Discover the universe, one newsletter at a time! ✨_

      <figure><img src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&amp;w=4472&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Earth from space"><figcaption><a href="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&amp;w=4472&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">Earth from Space</a></figcaption></figure>

      Imagine a world where <mark>space travel</mark> is as common as taking a bus. Our latest article explores the **future of interstellar journeys**. Is <del>space tourism</del> now a reality?

      ## Breaking News: The Andromeda Galaxy is Closer than We Thought!

      <figure><img src="https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&amp;w=4474&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Andromeda galaxy"><figcaption><a href="https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&amp;w=4474&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">The Andromeda Galaxy</a></figcaption></figure>

      New research indicates that our neighboring galaxy, **Andromeda**, might be on a collision course with the Milky Way. Experts weigh in on what this means for <sup>space</sup> enthusiasts and astronomers alike.

      ### Stunning Eclipse Captured by Space Station

      <figure><img src="https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?q=80&amp;w=2268&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Eclipse"><figcaption><a href="https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?q=80&amp;w=2268&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">Spectacular Eclipse</a></figcaption></figure>

      **Check out these amazing photos** of the recent solar eclipse taken from the [International Space Station](#). Witness the awe-inspiring beauty of our universe.

      *   **🎆 Latest Discovery:** New exoplanet in the habitable zone.
      *   <mark>SpaceX</mark> announces new moon mission.
      *   NASA's next rover to search for signs of life on Mars.
      *   Galactic Federation holds first interstellar summit.
      *   Exclusive Interview: Astronaut shares their experiences from space.

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

      Discover the latest missions and milestones in space exploration. From Mars rovers to deep space probes, [stay updated](#) with our comprehensive coverage.

      ---

      <dl><dt>Galactic Economy</dt><dd>How space mining is revolutionizing the economy.</dd><dt>Space Tourism</dt><dd>Upcoming missions you can join as a tourist.</dd><dt>Astronomical Events</dt><dd>Don't miss the next meteor shower!</dd><dd>Upcoming lunar and solar eclipses.</dd></dl>

      Finally, after months of preparation, the crew is ready to embark on their journey to Mars. **Stay tuned** for live updates and exclusive coverage!"
    `)

    expect(result.data?.html).toMatchInlineSnapshot(`
      "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html id="__vue-email" lang="en" dir="ltr"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>Test Space (test email 🧪🧪🧪)</title><meta name="description" content="Welcome to Space 🚀 This is a test email to test formatting of various elements.🧪"><style data-id="__vue-email-style"> tbody{font-size: 1rem; line-height: 1.65;} h1, h2{ line-height: 1.2; } h3, h4, h5{ line-height: 1.4; } h5, h6{font-weight: bold;} ol, ul, dd, dt{ font-size: 1rem; line-height: 1.65;} dt{font-weight: bold; margin-top: 0.5rem;} dd{margin-inline-start: 1.5rem;} ul, ol{padding-inline-start: 1.5rem;} img, figure{max-width: 100%; height: auto; } img[data-emoji]{display: inline;} figure img{border-radius: .5rem; display: block;} figcaption{font-size: 0.8rem; text-align: center; color: #666; margin-top: 0.5rem;} @media (prefers-color-scheme: dark) { } a{ transition: opacity 0.2s;} a:hover{opacity: 0.8;} </style></meta></meta></meta></meta></head><div id="__vue-email-preview" style="display: none; overflow: hidden; line-height: 1px; opacity: 0; max-height: 0; max-width: 0">Welcome to Space 🚀 This is a test email to test formatting of various elements.🧪<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div></div><body data-id="__vue-email-body" style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;; background-color: rgb(255,255,255); color: rgb(14,15,17);" class="dark:bg-gray-900 dark:text-white"><table align="center" width="100%" data-id="__vue-email-container" role="presentation" cellspacing="0" cellpadding="0" border="0" style="max-width:37.5em; padding-top: 2rem;
          padding-bottom: 2rem; padding-left: 1rem;
          padding-right: 1rem; max-width: 600px;" class="py-8 px-4 max-w-[600px]"><tbody><tr style="width: 100%"><td><table align="center" width="100%" data-id="__vue-email-section" border="0" cellpadding="0" cellspacing="0" role="presentation" class="mb-6" style="margin-bottom: 1.5rem;"><tbody><tr><td><td data-id="__vue-email-column" role="presentation" class="w-[22px]" style="width: 22px;"><a data-id="__vue-email-link" style="color: #067df7; text-decoration: none" href="https://www.fiction.com" target="_blank"><img data-id="__vue-email-img" style="display:block;outline:none;border:none;text-decoration:none; border-radius: 0.375rem; border-width: 2px !important; border-color: rgb(255,255,255,0.1) !important; border-style: solid !important;" src="https://factor-tests.s3.amazonaws.com/fiction-relative-media/med664ea37560cdfc8dfce09a7d-fiction-icon.png?blurhash=U9EMLDD%2500%3Fb9FWBay%25M00Rj~qxu_3%25Mt74n" class="rounded-md !border-2 !border-white/10 !border-solid" width="22"/></a></td><td data-id="__vue-email-column" role="presentation" class="pl-3" style="padding-left: 0.75rem;"><a data-id="__vue-email-link" style="color:#067df7;text-decoration:none; color: rgb(100,110,130); font-weight: 400; font-size: 14px;" href="https://www.fiction.com" target="_blank" class="dark:text-gray-300">Fiction</a></td></td></tr></tbody></table><table align="center" width="100%" data-id="__vue-email-section" border="0" cellpadding="0" cellspacing="0" role="presentation" style="font:&#39;Geist&#39;, -apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;;"><tbody><tr><td><p data-id="__vue-email-text" style="font-size:14px;line-height:24px;margin:16px 0;font-weight:bold;font-size:24px;line-height:1.33; margin-top: 0px;
          margin-bottom: 0px;" class="my-0">Welcome to Space 🚀</p><p data-id="__vue-email-text" style="font-size:14px;line-height:24px;margin:16px 0;font-weight:normal;font-size:24px;line-height:1.33; margin-top: 0px;
          margin-bottom: 0px; color: rgb(100,110,130);" class="my-0 text-gray-500"><span>This is a test email to test formatting of various elements.🧪</span> ↘ </p></td></tr></tbody></table><hr data-id="__vue-email-hr" style="width:100%;border:none;border-top:1px solid #eaeaea; margin-top: 2rem;
          margin-bottom: 2rem; border-color: rgb(222,223,226);" class="dark:border-gray-700"><div data-id="__vue-email-markdown" class="body-content"><h1 data-id="vue-email-heading" style="font-weight:500;padding-top:20;font-size:2.5rem">Welcome to the <a href="#" style="color:#2C67FF" data-id="vue-email-link" target="_blank">Galactic Gazette</a>! Your Ultimate Source for Space Adventures!</h1>

      <p data-id="vue-email-text" style="font-size:1.1rem;line-height:1.65;font-weight:normal"><em data-id="vue-email-text" style="font-style:italic">Discover the universe, one newsletter at a time! ✨</em></p>

      <p data-id="vue-email-text" style="font-size:1.1rem;line-height:1.65;font-weight:normal"/><figure><img alt="Earth from space" src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&amp;w=4472&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"><figcaption><a href="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&amp;w=4472&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" target="_blank">Earth from Space</a></figcaption></img></figure><p/>

      <p data-id="vue-email-text" style="font-size:1.1rem;line-height:1.65;font-weight:normal">Imagine a world where <mark>space travel</mark> is as common as taking a bus. Our latest article explores the <strong data-id="vue-email-text" style="font-weight:bold">future of interstellar journeys</strong>. Is <del>space tourism</del> now a reality?</p>

      <h2 data-id="vue-email-heading" style="font-weight:500;padding-top:20;font-size:2rem">Breaking News: The Andromeda Galaxy is Closer than We Thought!</h2>

      <p data-id="vue-email-text" style="font-size:1.1rem;line-height:1.65;font-weight:normal"/><figure><img alt="Andromeda galaxy" src="https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&amp;w=4474&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"><figcaption><a href="https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&amp;w=4474&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" target="_blank">The Andromeda Galaxy</a></figcaption></img></figure><p/>

      <p data-id="vue-email-text" style="font-size:1.1rem;line-height:1.65;font-weight:normal">New research indicates that our neighboring galaxy, <strong data-id="vue-email-text" style="font-weight:bold">Andromeda</strong>, might be on a collision course with the Milky Way. Experts weigh in on what this means for <sup>space</sup> enthusiasts and astronomers alike.</p>

      <h3 data-id="vue-email-heading" style="font-weight:500;padding-top:20;font-size:1.75rem">Stunning Eclipse Captured by Space Station</h3>

      <p data-id="vue-email-text" style="font-size:1.1rem;line-height:1.65;font-weight:normal"/><figure><img alt="Eclipse" src="https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?q=80&amp;w=2268&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"><figcaption><a href="https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?q=80&amp;w=2268&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" target="_blank">Spectacular Eclipse</a></figcaption></img></figure><p/>

      <strong data-id="vue-email-text" style="font-weight:bold">Check out these amazing photos</strong> of the recent solar eclipse taken from the <a href="#" style="color:#2C67FF" data-id="vue-email-link" target="_blank">International Space Station</a>. Witness the awe-inspiring beauty of our universe.
      <ul><li style="padding:.5rem 0"><strong data-id="vue-email-text" style="font-weight:bold">🎆 Latest Discovery:</strong> New exoplanet in the habitable zone.</li>
      <li style="padding:.5rem 0"><mark>SpaceX</mark> announces new moon mission.</li>
      <li style="padding:.5rem 0">NASA's next rover to search for signs of life on Mars.</li>
      <li style="padding:.5rem 0">Galactic Federation holds first interstellar summit.</li>
      <li style="padding:.5rem 0">Exclusive Interview: Astronaut shares their experiences from space.</li></ul>

      <h2 data-id="vue-email-heading" style="font-weight:500;padding-top:20;font-size:2rem">Astronaut's Guide to Surviving Space</h2>

      <p data-id="vue-email-text" style="font-size:1.1rem;line-height:1.65;font-weight:normal"/><figure><img alt="Astronaut" src="https://images.unsplash.com/photo-1576174464184-fb78fe882bfd?q=80&amp;w=4000&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"><figcaption><a href="https://images.unsplash.com/photo-1576174464184-fb78fe882bfd?q=80&amp;w=4000&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" target="_blank">Life in Space</a></figcaption></img></figure><p/>

      <p data-id="vue-email-text" style="font-size:1.1rem;line-height:1.65;font-weight:normal">Learn about the <em data-id="vue-email-text" style="font-style:italic">challenges and rewards</em> of living and working in space from our <strong data-id="vue-email-text" style="font-weight:bold">featured astronaut</strong>. From <sup>zero gravity</sup> workouts to eating <sub>dehydrated meals</sub>, get an inside look at astronaut life.</p>

      <h3 data-id="vue-email-heading" style="font-weight:500;padding-top:20;font-size:1.75rem">Fun Facts About Space:</h3>

      <h4 data-id="vue-email-heading" style="font-weight:500;padding-top:20;font-size:1.5rem">Did You Know?</h4>

      <p data-id="vue-email-text" style="font-size:1.1rem;line-height:1.65;font-weight:normal">The <strong data-id="vue-email-text" style="font-weight:bold">International Space Station</strong> travels at a speed of approximately 28,000 kilometers per hour (17,500 miles per hour).</p>

      <ol><li style="padding:.5rem 0">The sun's core is about 27 million degrees Fahrenheit.</li>
      <li style="padding:.5rem 0">Venus is the hottest planet in our solar system.</li>
      <li style="padding:.5rem 0">Jupiter has the shortest day of all the planets.</li>
      <li style="padding:.5rem 0">Saturn's rings are made of ice and rock.</li>
      <li style="padding:.5rem 0">The moon is drifting away from Earth at a rate of 3.8 centimeters per year.</li>
      </ol>
      <hr style="border:none;border-bottom:1px solid #646E82;opacity:.5;margin:2rem 0" data-id="vue-email-hr">

      <h5 data-id="vue-email-heading" style="font-weight:500;padding-top:20;font-size:1.25rem">Space Technology Advancements</h5>

      <p data-id="vue-email-text" style="font-size:1.1rem;line-height:1.65;font-weight:normal"><del>Old satellite technology</del> is being replaced with cutting-edge advancements. Learn more about the latest in space tech!</p>

      <blockquote style="padding:0 0 0 1.5rem;margin:1.5rem 0;border-left:4px solid #646E82;background-color:transparent;font-size:1.45em;font-style:italic">
      <p data-id="vue-email-text" style="font-size:1.1rem;line-height:1.65;font-weight:normal">"The universe is under no obligation to make sense to you." - Neil deGrasse Tyson</p>

      </blockquote>
      <h6 data-id="vue-email-heading" style="font-weight:500;padding-top:20;font-size:1rem">Space Exploration: The Final Frontier</h6>

      <p data-id="vue-email-text" style="font-size:1.1rem;line-height:1.65;font-weight:normal">Discover the latest missions and milestones in space exploration. From Mars rovers to deep space probes, <a href="#" style="color:#2C67FF" data-id="vue-email-link" target="_blank">stay updated</a> with our comprehensive coverage.</p>

      <hr style="border:none;border-bottom:1px solid #646E82;opacity:.5;margin:2rem 0" data-id="vue-email-hr">

      <p data-id="vue-email-text" style="font-size:1.1rem;line-height:1.65;font-weight:normal"/><dl><dt>Galactic Economy</dt><dd>How space mining is revolutionizing the economy.</dd><dt>Space Tourism</dt><dd>Upcoming missions you can join as a tourist.</dd><dt>Astronomical Events</dt><dd>Don't miss the next meteor shower!</dd><dd>Upcoming lunar and solar eclipses.</dd></dl><p/>

      <p data-id="vue-email-text" style="font-size:1.1rem;line-height:1.65;font-weight:normal">Finally, after months of preparation, the crew is ready to embark on their journey to Mars. <strong data-id="vue-email-text" style="font-weight:bold">Stay tuned</strong> for live updates and exclusive coverage!</p></hr></hr></div><table align="center" width="100%" data-id="__vue-email-section" border="0" cellpadding="0" cellspacing="0" role="presentation" class="mt-12 mb-8 text-left" style="margin-top: 3rem; margin-bottom: 2rem; text-align: left;"><tbody><tr><td><table align="center" width="100%" data-id="__vue-email-section" border="0" cellpadding="0" cellspacing="0" role="presentation" class="inline-block" style="display: inline-block;"><tbody><tr><td><td data-id="__vue-email-column" role="presentation" class=""><a data-id="__vue-email-button" style="line-height:100%;text-decoration:none;display:inline-block;max-width:100%;white-space:nowrap; background-color: rgb(37,99,235); color: rgb(255,255,255); padding-top: 0.75rem;
          padding-bottom: 0.75rem; padding-left: 1rem;
          padding-right: 1rem; border-radius: 0.375rem; font-size: 16px; font-weight: 700; user-select: none;" href="#" target="_blank" class="dark:bg-blue-600 hover:opacity-80">Confirm email address &#x2192;</a></td></td></tr></tbody></table></td></tr></tbody></table><hr data-id="__vue-email-hr" style="width:100%;border:none;border-top:1px solid #eaeaea; margin-top: 3rem;
          margin-bottom: 3rem; border-color: rgb(100,110,130); opacity: 0.3;" class="my-12 border-gray-500 opacity-30"><table align="center" width="100%" data-id="__vue-email-section" border="0" cellpadding="0" cellspacing="0" role="presentation" class="dark:text-gray-500 text-normal" style="margin-top: 2rem; text-align: left; color: rgb(179,185,197); font-size: 0.75rem;
          line-height: 1rem;"><tbody><tr><td><td data-id="__vue-email-column" role="presentation" class="w-[65%] align-top" style="width: 65%; vertical-align: top;"><img data-id="__vue-email-img" style="display:block;outline:none;border:none;text-decoration:none;" src="https://factor-tests.s3.amazonaws.com/fiction-relative-media/med664ea376d4fe0302372fc100-fiction-email-footer.png?blurhash=U2DS%5D%5D~q00_N00_4%25M4n00_N%3FcIU~q9F%25M-%3B" width="80" alt="Personal Marketing Tools by Fiction"><p data-id="__vue-email-text" style="font-size: 14px; line-height: 24px; margin: 16px 0;"><a data-id="__vue-email-link" style="color:#067df7;text-decoration:none; color: rgb(179,185,197); margin-top: 1rem;" href="https://www.fiction.com" target="_blank" class="text-normal dark:text-gray-500">Personal Marketing Tools by Fiction ↗ </a></p></img></td><td data-id="__vue-email-column" role="presentation" class="w-[35%] text-right text-gray-400 align-top text-xs" style="width: 35%; text-align: right; color: rgb(122,133,153); vertical-align: top; font-size: 0.75rem;
          line-height: 1rem;"><a data-id="__vue-email-link" style="color:#067df7;text-decoration:none; color: rgb(179,185,197);" href="https://www.fiction.com/unsubscribe" target="_blank" class="text-normal"> Unsubscribe </a></td></td></tr></tbody></table></hr></hr></td></tr></tbody></table></body></html>"
    `)

    expect(result.status).toBe('success')

    expect(result.data?.html).toContain(confirmEmail.subject)
    expect(result.data?.html).toContain(confirmEmail.heading)
    expect(result.data?.html).toContain(confirmEmail.subHeading)
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

    testUtils.fictionEmail.isTest = true
  })
})
