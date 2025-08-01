/* eslint-disable no-irregular-whitespace */
import type { EmailSendConfig } from '..'
import { afterAll, describe, expect, it } from 'vitest'

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

  const { orgId, user } = await testUtils.init()

  afterAll(async () => testUtils.close())

  describe('sends a transactional email', async () => {
    const superImage = await testUtils.fictionEmail.emailImages().icon
    const confirmEmail: EmailSendConfig = {
      to: 'arpowers@gmail.com',
      senderName: 'Fiction.com',
      senderEmail: 'admin@fiction.com',
      subject: `Test Space (test email 👀)`,
      title: 'Voyage to Space 🚀',
      subTitle: 'This is to test formatting of various elements.🧪',
      content: sampleHtml,
      buttons: [
        {
          theme: 'primary',
          label: `Confirm email address &#x2192;`,
          href: '#',
        },
      ],
      superTitle: {
        icon: { url: superImage.url },
        text: 'Fiction',
        href: 'https://www.fiction.com',
      },
      footerLinks: [
        { label: 'View Website', href: 'https://www.fiction.com' },
      ],
      theme: 'rose',
      companyName: 'Fiction Company, Inc.',
      streetAddress: '1234 Fiction St, Fiction City, FI 12345',
      poweredByFiction: true,
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
          pattern: /<meta[^>]*content-type[^>]*charset=utf-8/,
        },
        {
          desc: 'Viewport meta',
          pattern: /<meta[^>]*viewport[^>]*width=device-width/,
        },
        {
          desc: 'Complete head section',
          pattern: /<head>[\s\S]*?<\/head>/,
        },
        {
          desc: 'Style definitions',
          pattern: /<style[\s\S]*?<\/style>/,
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

    it('renders html content', async () => {
      expect(result.data?.html).toMatchInlineSnapshot(`
        "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml"  lang="en" dir="ltr"><head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Test Space (test email 👀)</title>
        <style>
              /* Reset & Base */
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body, table, td { border-collapse: collapse; }
              img { border: 0; outline: none; text-decoration: none; max-width: 100%; height: auto; }

              /* Tufte-style Typography Hierarchy */
              .title {
                font-size: 24px;
                line-height: 1.2;
                font-weight: normal;
                margin: 0 0 8px;
                letter-spacing: -0.02em;
              }

              .subtitle {
                font-size: 18px;
                line-height: 1.5;
                font-weight: normal;
                margin: 0 0 48px;
                color: #646E82;
              }

              /* Content Prose - Typography */
              .prose p { margin: 24px 0; }
              .prose h1 {
                font-size: 32px;
                font-weight: normal;
                margin: 56px 0 24px;
                line-height: 1.2;
                letter-spacing: -0.02em;
              }
              .prose h2 {
                font-size: 24px;
                font-weight: normal;
                margin: 48px 0 24px;
                line-height: 1.2;
                letter-spacing: -0.02em;
              }
              .prose h3 {
                font-size: 18px;
                font-weight: 600;
                margin: 40px 0 16px;
                letter-spacing: -0.02em;
              }
              .prose h4 {
                font-size: 16px;
                font-weight: 600;
                margin: 32px 0 16px;
              }
              .prose h5 {
                font-size: 14px;
                font-weight: 600;
                margin: 32px 0 16px;
                text-transform: uppercase;
                letter-spacing: 0.1em;
              }
              .prose h6 {
                font-size: 14px;
                font-weight: normal;
                margin: 24px 0 16px;
                color: #646E82;
                font-style: italic;
              }

              /* Text formatting */
              .prose strong { font-weight: 600; }
              .prose em { font-style: italic; }
              .prose mark {
                background: #fef08a;
                padding: 4px 8px;
                border-radius: 3px;
              }
              .prose del {
                text-decoration: line-through;
                color: #646E82;
              }
              .prose sup, .prose sub {
                font-size: 11px;
                line-height: 0;
                position: relative;
                vertical-align: baseline;
              }
              .prose sup { top: -0.5em; }
              .prose sub { bottom: -0.25em; }

              /* Links - underlined, same color as surrounding text */
              .prose a {
                color: inherit;
                text-decoration: underline;
              }
              .prose a:hover {
                color: #e11d48;
              }

              /* Lists */
              .prose ul, .prose ol {
                margin: 24px 0;
                padding-left: 24px;
              }
              .prose li { margin: 8px 0; }

              /* Definition Lists */
              .prose dl {
                margin: 24px 0;
              }
              .prose dt {
                font-weight: 600;
                margin-top: 24px;
                margin-bottom: 8px;
              }
              .prose dd {
                margin-left: 24px;
                margin-bottom: 8px;
                color: #646E82;
              }

              /* Blockquotes */
              .prose blockquote {
                margin: 32px 0;
                padding-left: 24px;
                border-left: 2px solid #DEDFE2;
                font-style: italic;
                color: #646E82;
              }
              .prose blockquote footer {
                margin-top: 16px;
                font-size: 14px;
                font-style: normal;
                color: #7A8599;
              }

              /* Code */
              .prose code {
                font-family: "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Source Code Pro", monospace;
                font-size: 14px;
                background: #F8F9FD;
                padding: 4px 8px;
                border-radius: 3px;
              }

              .prose pre {
                font-family: "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Source Code Pro", monospace;
                font-size: 14px;
                background: #F8F9FD;
                padding: 24px;
                border-radius: 8px;
                margin: 32px 0;
                overflow-x: auto;
                line-height: 1.5;
              }
              .prose pre code {
                background: transparent;
                padding: 0;
                border-radius: 0;
              }

              /* Horizontal Rules */
              .prose hr {
                border: none;
                border-top: 1px solid #DEDFE2;
                margin: 48px 0;
                width: 100%;
              }

              /* Table Styling */
              .prose table {
                width: 100%;
                border-collapse: collapse;
                margin: 32px 0;
                font-family: "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Source Code Pro", monospace;
                font-size: 14px;
              }
              .prose table th {
                text-align: left;
                font-weight: 600;
                padding: 16px 8px;
                border-bottom: 2px solid #DEDFE2;
                background: #F8F9FD;
              }
              .prose table td {
                padding: 16px 8px;
                border-bottom: 1px solid #DEDFE2;
                vertical-align: top;
              }
              .prose table tbody tr:nth-child(even) {
                background: #F8F9FD;
              }

              /* Callouts & Editor's Pick */
              .prose .callout, .prose .editors-pick {
                background: #F8F9FD;
                padding: 24px;
                border-radius: 8px;
                margin: 32px 0;
                border: 1px solid #DEDFE2;
              }

              /* Footnotes */
              .prose .footnotes {
                margin-top: 56px;
                font-size: 14px;
                color: #646E82;
              }
              .prose .footnotes hr {
                margin: 32px 0 24px;
              }
              .prose .footnotes ol {
                font-family: "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Source Code Pro", monospace;
                font-size: 11px;
              }

              /* Buttons */
              .prose .x-button-container, .prose .button-container {
                margin: 32px 0;
                text-align: center;
              }

              .prose .x-button, .prose .button {
                display: inline-block;
                padding: 16px 24px;
                background-color: #e11d48;
                color: #fff !important;
                text-decoration: none !important;
                border-radius: 32px;
                font-weight: 600;
                font-size: 14px;
                line-height: 1.2;
                margin: 8px;
              }

              .prose .x-button.lg {
                padding: 24px 32px;
                font-size: 18px;
              }

              .prose .x-button:hover, .prose .button:hover {
                background-color: #f43f5e;
              }

              /* Footer */
              .footer {
                font-family: "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Source Code Pro", monospace;
                font-size: 11px;
                color: #7A8599;
                line-height: 1.5;
              }
              .footer a { color: inherit; text-decoration: none; }
              .footer a:hover { text-decoration: underline; }

              /* Media & Figures */
              .prose figure {
                margin: 48px 0;
                text-align: center;
              }
              .prose figure img {
                border-radius: 8px;
                display: block;
                margin: 0 auto;
              }
              .prose figcaption {
                margin-top: 16px;
                font-family: "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Source Code Pro", monospace;
                font-size: 11px;
                color: #646E82;
                text-align: center;
                font-style: italic;
              }
              .prose figcaption a {
                color: inherit;
                text-decoration: underline;
              }
              .prose figcaption a:hover {
                color: #e11d48;
              }

              .media {
                margin: 32px 0;
                text-align: center;
              }
              .media img {
                border-radius: 8px;
                display: block;
                margin: 0 auto;
              }
              .media-caption {
                margin-top: 16px;
                font-family: "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Source Code Pro", monospace;
                font-size: 11px;
                color: #646E82;
                text-align: center;
                font-style: italic;
              }

              /* Sender Header */
              .sender-header a {
                color: inherit;
                text-decoration: underline;
              }
              .sender-header a:hover {
                color: #e11d48;
              }
            </style>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <meta name="description" content="Voyage to Space 🚀 - This is to test formatting of various elements.🧪">
        <meta name="color-scheme" content="light dark">
        </head><body  style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Helvetica, Arial, sans-serif;font-size:16px;line-height:1.618;color:#0A0B0D">


        <div><!-- Preview Text --><div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">Voyage to Space 🚀 - This is to test formatting of various elements.🧪 ​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​</div><!-- Main Container --><div style="
            width: 100%;
            max-width: 550px;
            margin: 0 auto;
            padding: 40px 8px;
            font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Helvetica, Arial, sans-serif;
            font-size: 16px;
            line-height: 1.618;
            color: #0A0B0D;
          "><!-- Header --><header><!-- Simplified Sender Header --><div class="sender-header" style="
            font-size: 14px;
            color: #0A0B0D;
            margin: 0 0 48px;
          "><table style="width:100%;" cellpadding="0" cellspacing="0"><tr><td style="width:28px;vertical-align:middle;"><img src="https://media.fiction.com/_assets/fiction-icon.png" width="20" height="20" alt="" style="border-radius:50%;display:block;"></td><td style="vertical-align:middle;font-family:-apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Helvetica, Arial, sans-serif;font-weight:normal;">Fiction</td></tr></table></div><h1 class="title">Voyage to Space 🚀</h1><h2 class="subtitle">This is to test formatting of various elements.🧪</h2></header><!-- Divider after header - 6rem width --><hr style="border:none;border-top:1px solid #DEDFE2;margin:0 0 56px;width:5rem;"><!-- Featured Media --><!----><!-- Content --><div class="prose"><h1>Welcome to the <a href="#">Galactic Gazette</a>! Your Ultimate Source for Space Adventures!</h1>
        <p><em>Discover the universe, one newsletter at a time! ✨</em></p>

        <figure>
          <img src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=4472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Earth from space">
          <figcaption><a href="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=4472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">Earth from Space</a></figcaption>
        </figure>

        <p>Imagine a world where <mark>space travel</mark> is as common as taking a bus. Our latest article explores the <strong>future of interstellar journeys</strong>. Is <del>space tourism</del> now a reality?</p>

        <!-- Standard button format without inline styles -->
        <div class="x-button-container">
          <a href="https://www.fiction.com" class="x-button lg">Subscribe Now 🚀</a>
        </div>

        <h2>Breaking News: The Andromeda Galaxy is Closer than We Thought!</h2>

        <figure>
          <img src="https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=4474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Andromeda galaxy">
          <figcaption><a href="https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=4474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">The Andromeda Galaxy</a></figcaption>
        </figure>

        <p>New research indicates that our neighboring galaxy, <strong>Andromeda</strong>, might be on a collision course with the Milky Way. Experts weigh in on what this means for <sup>space</sup> enthusiasts and astronomers alike.</p>

        <!-- Added inline code example -->
        <p>Astronomers use the formula <code>d = v × t</code> to calculate cosmic distances, where d is distance, v is velocity, and t is time.</p>

        <h3>Stunning Eclipse Captured by Space Station</h3>

        <figure>
          <img src="https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?q=80&w=2268&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Eclipse">
          <figcaption><a href="https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?q=80&w=2268&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">Spectacular Eclipse</a></figcaption>
        </figure>

        <p><strong>Check out these amazing photos</strong> of the recent solar eclipse taken from the <a href="https://www.fiction.com">International Space Station</a>. Witness the awe-inspiring beauty of our universe.</p>

        <!-- Added code block example -->
        <pre><code>// JavaScript code to calculate light-years
        const lightYearInKm = 9.461e+12;
        const distanceToProximaCentauri = 4.246; // light-years
        const distanceInKm = distanceToProximaCentauri * lightYearInKm;
        </code></pre>

        <ul>
          <li><strong>🎆 Latest Discovery:</strong> New exoplanet in the habitable zone.</li>
          <li><mark>SpaceX</mark> announces new moon mission.</li>
          <li>NASA's next rover to search for signs of life on Mars.</li>
          <li>Galactic Federation holds first interstellar summit.</li>
          <li>Exclusive Interview: Astronaut shares their experiences from space.</li>
        </ul>

        <!-- Added a table for data presentation -->
        <table>
          <thead>
            <tr>
              <th>Planet</th>
              <th>Distance from Sun (AU)</th>
              <th>Diameter (km)</th>
              <th>Moons</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Mercury</td>
              <td>0.39</td>
              <td>4,880</td>
              <td>0</td>
            </tr>
            <tr>
              <td>Venus</td>
              <td>0.72</td>
              <td>12,104</td>
              <td>0</td>
            </tr>
            <tr>
              <td>Earth</td>
              <td>1.00</td>
              <td>12,756</td>
              <td>1</td>
            </tr>
            <tr>
              <td>Mars</td>
              <td>1.52</td>
              <td>6,792</td>
              <td>2</td>
            </tr>
          </tbody>
        </table>

        <div class="callout">
          <strong>🌟 Editor's Pick:</strong> Don't miss our exclusive interview with veteran astronaut Sarah Chen about life aboard the ISS!
        </div>

        <h2>Astronaut's Guide to Surviving Space</h2>

        <figure>
          <img src="https://images.unsplash.com/photo-1576174464184-fb78fe882bfd?q=80&w=4000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Astronaut">
          <figcaption><a href="https://images.unsplash.com/photo-1576174464184-fb78fe882bfd?q=80&w=4000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">Life in Space</a></figcaption>
        </figure>

        <p>Learn about the <em>challenges and rewards</em> of living and working in space from our <strong>featured astronaut</strong>. From <sup>zero gravity</sup> workouts to eating <sub>dehydrated meals</sub>, get an inside look at astronaut life.</p>

        <h3>Fun Facts About Space:</h3>
        <h4>Did You Know?</h4>
        <p>The <strong>International Space Station</strong> travels at a speed of approximately 28,000 kilometers per hour (17,500 miles per hour).</p>
        <ol>
          <li>The sun's core is about 27 million degrees Fahrenheit.</li>
          <li>Venus is the hottest planet in our solar system.</li>
          <li>Jupiter has the shortest day of all the planets.</li>
          <li>Saturn's rings are made of ice and rock.</li>
          <li>The moon is drifting away from Earth at a rate of 3.8 centimeters per year.</li>
        </ol>

        <hr>

        <h5>Space Technology Advancements</h5>
        <p><del>Old satellite technology</del> is being replaced with cutting-edge advancements. Learn more about the latest in space tech!</p>

        <blockquote>
          <p>"The universe is under no obligation to make sense to you."</p>
          <footer>- Neil deGrasse Tyson</footer>
        </blockquote>

        <!-- Added another button with standard class -->
        <div class="button-container">
          <a href="https://www.fiction.com/space-tech" class="button">Explore Space Tech</a>
        </div>

        <h6>Space Exploration: The Final Frontier</h6>
        <p>Discover the latest missions and milestones in space exploration. From Mars rovers to deep space probes, <a href="https://www.fiction.com">stay updated</a> with our comprehensive coverage.</p>

        <hr>

        <dl>
          <dt>Galactic Economy</dt>
          <dd>How space mining is revolutionizing the economy.</dd>
          <dt>Space Tourism</dt>
          <dd>Upcoming missions you can join as a tourist.</dd>
          <dt>Astronomical Events</dt>
          <dd>Don't miss the next meteor shower!</dd>
          <dd>Upcoming lunar and solar eclipses.</dd>
        </dl>


        <!-- Added footnote-style references -->
        <p>Finally, after months of preparation, the crew is ready to embark on their journey to Mars<sup id="fnref1"><a href="#fn1">1</a></sup>. <strong>Stay tuned</strong> for live updates and exclusive coverage!</p>

        <div class="footnotes">
          <hr>
          <ol>
            <li id="fn1">Mission details available at <a href="https://www.fiction.com/mars-mission">fiction.com/mars-mission</a> <a href="#fnref1">↩</a></li>
          </ol>
        </div>
        </div><!-- Action Buttons --><div style="margin:40px 0;"><!--[--><a href="#" class="btn" style="
            display: inline-block;
            padding: 16px 24px;
            background-color: #e11d48;
            color: #fff !important;
            text-decoration: none !important;
            border-radius: 32px;
            font-weight: 600;
            font-size: 14px;
            line-height: 1.2;
            margin: 8px 8px 8px 0;
          ">Confirm email address &#x2192;</a><!--]--></div><!-- Footer Divider --><hr style="
            border: none;
            border-top: 1px solid #DEDFE2;
            margin: 56px 0;
            width: 100%;
          "><!-- Footer --><footer class="footer"><!-- Footer Links --><div style="margin-bottom:32px;"><!--[--><a href="https://www.fiction.com" style="margin-right:16px;font-weight:500;">View Website</a><!--]--></div><!-- Company Info --><div style="margin-bottom:24px;"><div style="font-weight:500;margin-bottom:4px;"> © 2025 Fiction Company, Inc.</div><div>1234 Fiction St, Fiction City, FI 12345</div></div><!-- Legal Footer --><table style="width:100%;" cellpadding="0" cellspacing="0"><tr><td><a href="https://www.fiction.com/unsubscribe">Unsubscribe</a><span style="margin:0 8px;opacity:0.6;">•</span><a href="mailto:admin@fiction.com">Report</a></td><td style="text-align:right;"><a href="https://fiction.com" target="_blank" rel="noopener"> Powered by Fiction.com </a></td></tr></table></footer></div></div>


        </body></html>"
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
