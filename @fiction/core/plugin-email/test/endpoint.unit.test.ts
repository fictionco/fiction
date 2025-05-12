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
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Test Space (test email 👀)</title>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <meta name="description" content="Voyage to Space 🚀 -- This is to test formatting of various elements.🧪">
        <meta name="color-scheme" content="light dark">
        <meta name="supported-color-schemes" content="light dark">
        <style>
               /* Base typography */
                body { line-height: 1.6; font-size: 18px; }

                p, ul, ol, dl {
                margin-top: 1.5em;
                margin-bottom: 1.5em;
                }



                figure,  pre, table, .x-button-container {
                 margin-top: 2em;
                 margin-bottom: 2em;
                }

                p, ul, ol, dl, blockquote, pre, table {
                font-size: 18px;
                }

                /* Headers */
                h1, h2, h3, h4, h5, h6 {
                margin: 1.5em 0 0.75em;
                line-height: 1.3;
                }
                h1 { font-size: 36px; }
                h2 { font-size: 27px; }
                h3 { font-size: 22px; }
                h4 { font-size: 20px; }
                h5 { font-size: 18px; }
                h6 { font-size: 18px; }

                /* Lists and definition terms */
                ul, ol, dl {
                padding-left: 1.5em;
                font-size: 18px;
                }
                ul {list-style-type: disc;}
                ol {list-style-type: decimal;}
                li { margin: 0.5em 0; }
                li p { margin: 0; }
                dt {
                font-weight: 600;
                margin-top: 1em;
                }
                dd { margin-left: 1.5em; }



                blockquote {

                  margin-left: 1em;
                  padding-left: 1.5em;
                  font-style: italic;
                  border-left: 3px solid #b3b9c5;
                }

                blockquote p, blockquote{
                  line-height: 1.5;
                  font-size: 20px;
                }

                blockquote p {
                  margin: 1em 0;
                }
                blockquote p:first-child {
                  margin-top: 0;
                }
                blockquote p:last-child {
                  margin-bottom: 0;
                }

                pre{
                  padding: 1em;
                  background-color: #e6e9f1;
                  border-radius: 0.5em;
                  overflow-x: auto;
                  font-size:16px;
                }
                pre code {
                  background-color: transparent;
                  padding: 0;
                  border-radius: 0;
                }

                code {
                  background-color: #e6e9f1;
                  padding: 0.1em 0.3em;
                  border-radius: 0.3em;
                  font-size:16px;
                }

                .prose-content table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 1.5em 0;
                }
                .prose-content tbody tr:nth-child(odd) {
                  background-color: rgba(0,0,0,.05);
                }
                .prose-content table td {
                  vertical-align: top;
                  text-align: center;
                }

                /* Images and figures */
                img {
                  max-width: 100%;
                  height: auto;
                  border-radius: 0.5em;
                }
                img[data-emoji] {
                  display: inline;
                  border-radius: 0;
                  vertical-align: -0.1em;
                }
                figure {
                  text-align: center;
                }
                figcaption {
                  margin-top: 0.75em;
                  font-size: 16px;
                  color: #394151;
                }
                /* Links */
                #themed-content a{
                  color: #e11d48;
                  text-decoration: underline;
                }
                #themed-content a:hover {
                  color: #f43f5e;
                }

                #themed-footer {
                  color: #0e0f11
                }
                #themed-footer a {
                  color: inherit;
                  text-decoration: none;
                }
                #themed-footer a:hover {
                text-decoration: underline;
                }

                #last-line a, #last-line span, #last-line  {
                  font-size: 13px;
                }
                #last-line a {
                  color: #646E82;
                  text-decoration: none;
                }
                #last-line a:hover {
                  text-decoration: underline;
                }

                #last-line span {
                  opacity: 0.6;
                  margin: 0 1em;
                }


                .x-button {
                  display: inline-block;
                  padding: 12px 18px;
                  background-color: #e11d48;
                  color: #ffffff !important;
                  text-decoration: none !important;
                  border-radius: 9999px;
                  font-weight: 600;
                  margin: 0 auto;
                  text-align: center;
                  mso-padding-alt: 0;
                  mso-text-raise: 7.5pt;
                  font-size: 16px;
                  line-height: 1;
                }

                .x-button.naked {
                  background-color: rgba(229,231,235,0.4);
                  color: #e11d48;
                }

                .x-button img {
                  vertical-align: -0.3em;
                }

                .x-button:hover {
                  background-color: #f43f5e;
                }

                .x-button.sm{
                  padding: 8px 16px;
                  font-size: 14px;
                }

                .x-button.lg{
                  padding: 14px 24px;
                  font-size: 18px;
                }

                hr { border: none; border-top: 1px solid rgba(0,0,0,.1); margin: 2em 0; }</style>
        </head><body  style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif;font-size:18px;color:#0e0f11">


        <div><!-- Preview Text Hack --><div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;font-family:sans-serif;">Voyage to Space 🚀 -- This is to test formatting of various elements.🧪 <!-- Prevent Gmail app from showing funky characters --> ‌ ‌ ‌ ‌ ‌  ‌ ‌ ‌ ‌ ‌  ‌ ‌ ‌ ‌ ‌  <!-- Force preview text to fill available space --> ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ </div><!-- Main Container --><div style="width:100%;max-width:600px;margin:0 auto;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif;color:#0e0f11;"><!-- Super Title --><table style="margin-bottom:16px;"><tbody><tr><td><img src="https://fiction-media-dev.s3.amazonaws.com/fiction-relative-media/med67bbf278308514c8c9f01f66-fiction-icon.png?blurhash=U9EMLDD%2500%3Fb9FWBay%25M00Rj%7Eqxu_3%25Mt74n" width="22" alt="Logo" style="display:block;border-radius:5px;border:1.5px solid #ffffff;width:22px;height:22px;object-fit:cover;margin-right:8px;"></td><td><a href="https://www.fiction.com" style="color:#394151;text-decoration:none;font-weight:600;font-size:14px;">Fiction</a></td></tr></tbody></table><!-- Title Section --><div id="themed-content" class="themed-content"><h1 style="margin:0 0 8px;font-size:24px;line-height:1.33;">Voyage to Space 🚀</h1><h3 style="margin:0;font-weight:normal;font-size:24px;line-height:1.33;color:#394151;">This is to test formatting of various elements.🧪</h3><hr style="border:none;border-top:1px solid #b3b9c5;margin:3em 0; width: 5em;"><!-- Featured Image --><!----><!-- Content --><div class="prose-content"><h1>Welcome to the <a href="#">Galactic Gazette</a>! Your Ultimate Source for Space Adventures!</h1>
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
        </div><!-- Buttons --><div style="margin:32px 0;"><!--[--><a href="#" class="x-button">Confirm email address &#x2192;</a><!--]--></div></div><hr style="border:none;border-top:1px solid #b3b9c5;margin:3em 0; width: 5em;"><!-- Footer --><div id="themed-footer" style="margin-top:2em;"><!-- Footer Links --><div style="margin-bottom:32px;"><!--[--><a href="https://www.fiction.com" style="margin-right:16px;font-weight:600;color:inherit;font-size:13px;">View Website</a><!--]--></div><!-- CompanyName Info --><div style="font-size:13px;"><div>© 2025 Fiction Company, Inc.</div><div style="margin-top:4px;">1234 Fiction St, Fiction City, FI 12345</div></div><!-- Legal Footer --><table id="last-line" style="width:100%;margin-top:32px;" cellpadding="0" cellspacing="0"><tbody><tr><td><a href="https://www.fiction.com/unsubscribe">Unsubscribe</a><span>•</span><a href="mailto:admin@fiction.com">Report Abuse</a></td><td style="text-align:right;"><a href="https://www.fiction.com" target="_blank" rel="noopener"> Powered by Fiction.com </a></td></tr></tbody></table></div></div></div>


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
