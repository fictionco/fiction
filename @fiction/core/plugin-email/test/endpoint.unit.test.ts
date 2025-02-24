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
      title: 'Voyage to Space 🚀',
      subTitle: 'This is to test formatting of various elements.🧪',
      bodyHtml: sampleHtml,
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
      mediaFooter: { url: footerImage.url },
      company: 'Some Company',
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
        "<html xmlns="http://www.w3.org/1999/xhtml" lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark"><title>Test Space (test email 🧪🧪🧪)</title><style type="text/css">
                /* Base typography */
                body { line-height: 1.6; font-size: 18px; }
                p {
                margin: 1.5em 0;
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
                margin: 1.5em 0;
                padding-left: 1.5em;
                font-size: 18px;
                }
                li { margin: 0.5em 0; }
                li p { margin: 0; }
                dt {
                font-weight: 600;
                margin-top: 1em;
                }
                dd { margin-left: 1.5em; }

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
                margin: 2em 0;
                text-align: center;
                }
                figcaption {
                margin-top: 0.75em;
                font-size: 16px;
                color: v-bind(textColorSubdued);
                }

                /* Links */
                a {
                color: v-bind(primaryColor);
                text-decoration: none;
                transition: opacity 0.2s;
                }
                a:hover { opacity: 0.8; }

                /* Dark mode optimization */
                @media (prefers-color-scheme: dark) {
                body { background: v-bind(bgColor); }
                .dark-img {
                filter: brightness(0.8) contrast(1.2);
                }
                }

                /* Mobile optimization */
                @media only screen and (max-width: 600px) {
                body { font-size: 15px; }
                h1 { font-size: 1.75em; }
                h2 { font-size: 1.5em; }
                }
              </style></head><body style="margin:0;padding:0;"><!-- Preview Text Hack --><div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;font-family:sans-serif;">Voyage to Space 🚀 -- This is to test formatting of various elements.🧪 <!-- Prevent Gmail app from showing funky characters --> ‌ ‌ ‌ ‌ ‌  ‌ ‌ ‌ ‌ ‌  ‌ ‌ ‌ ‌ ‌  <!-- Force preview text to fill available space --> ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ ͏ </div><!-- Main Container --><div style="width:100%;max-width:600px;margin:0 auto;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif;color:#0e0f11;"><!-- Super Title --><table style="margin-bottom:16px;"><tbody><tr><td><img src="https://fiction-media-dev.s3.amazonaws.com/fiction-relative-media/med67bbf278308514c8c9f01f66-fiction-icon.png?blurhash=U9EMLDD%2500%3Fb9FWBay%25M00Rj%7Eqxu_3%25Mt74n" width="22" alt="" style="vertical-align:middle;border-radius:6px;border:2px solid rgba(255,255,255,0.1);"></td><td><a href="https://www.fiction.com" style="color:#0e0f11;text-decoration:none;margin-left:.5em;font-weight: 600;font-size:.9em;">Fiction</a></td></tr></tbody></table><!-- Title Section --><h1 style="margin:0 0 8px;font-size:24px;line-height:1.33;">Voyage to Space 🚀</h1><h3 style="margin:0;font-weight:normal;font-size:24px;line-height:1.33;color:#394151;">This is to test formatting of various elements.🧪</h3><hr style="border:none;border-top:1px solid #DEDFE2;margin:3em 0; width: 5em;"><!-- Featured Image --><!----><!-- Content --><div><h1>Welcome to the <a href="#">Galactic Gazette</a>! Your Ultimate Source for Space Adventures!</h1>
        <p><em>Discover the universe, one newsletter at a time! ✨</em></p>
        <figure><img src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&amp;w=4472&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Earth from space"><figcaption><a href="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&amp;w=4472&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">Earth from Space</a></figcaption></figure>

        <p>Imagine a world where <mark>space travel</mark> is as common as taking a bus. Our latest article explores the <strong>future of interstellar journeys</strong>. Is <del>space tourism</del> now a reality?</p>
        <p><a href="https://www.fiction.com">Subscribe Now 🚀</a></p>
        <h2>Breaking News: The Andromeda Galaxy is Closer than We Thought!</h2>
        <figure><img src="https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&amp;w=4474&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Andromeda galaxy"><figcaption><a href="https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&amp;w=4474&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">The Andromeda Galaxy</a></figcaption></figure>

        <p>New research indicates that our neighboring galaxy, <strong>Andromeda</strong>, might be on a collision course with the Milky Way. Experts weigh in on what this means for <sup>space</sup> enthusiasts and astronomers alike.</p>
        <h3>Stunning Eclipse Captured by Space Station</h3>
        <figure><img src="https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?q=80&amp;w=2268&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Eclipse"><figcaption><a href="https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?q=80&amp;w=2268&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">Spectacular Eclipse</a></figcaption></figure>

        <p><strong>Check out these amazing photos</strong> of the recent solar eclipse taken from the <a href="https://www.fiction.com">International Space Station</a>. Witness the awe-inspiring beauty of our universe.</p>
        <ul>
        <li><strong>🎆 Latest Discovery:</strong> New exoplanet in the habitable zone.</li>
        <li><mark>SpaceX</mark> announces new moon mission.</li>
        <li>NASA&#39;s next rover to search for signs of life on Mars.</li>
        <li>Galactic Federation holds first interstellar summit.</li>
        <li>Exclusive Interview: Astronaut shares their experiences from space.</li>
        </ul>
        <p><strong>🌟 Editor&#39;s Pick:</strong> Don&#39;t miss our exclusive interview with veteran astronaut Sarah Chen about life aboard the ISS!</p>
        <h2>Astronaut&#39;s Guide to Surviving Space</h2>
        <figure><img src="https://images.unsplash.com/photo-1576174464184-fb78fe882bfd?q=80&amp;w=4000&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Astronaut"><figcaption><a href="https://images.unsplash.com/photo-1576174464184-fb78fe882bfd?q=80&amp;w=4000&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">Life in Space</a></figcaption></figure>

        <p>Learn about the <em>challenges and rewards</em> of living and working in space from our <strong>featured astronaut</strong>. From <sup>zero gravity</sup> workouts to eating <sub>dehydrated meals</sub>, get an inside look at astronaut life.</p>
        <h3>Fun Facts About Space:</h3>
        <h4>Did You Know?</h4>
        <p>The <strong>International Space Station</strong> travels at a speed of approximately 28,000 kilometers per hour (17,500 miles per hour).</p>
        <ol>
        <li>The sun&#39;s core is about 27 million degrees Fahrenheit.</li>
        <li>Venus is the hottest planet in our solar system.</li>
        <li>Jupiter has the shortest day of all the planets.</li>
        <li>Saturn&#39;s rings are made of ice and rock.</li>
        <li>The moon is drifting away from Earth at a rate of 3.8 centimeters per year.</li>
        </ol>
        <hr>
        <h5>Space Technology Advancements</h5>
        <p><del>Old satellite technology</del> is being replaced with cutting-edge advancements. Learn more about the latest in space tech!</p>
        <blockquote>
        <p>&quot;The universe is under no obligation to make sense to you.&quot; - Neil deGrasse Tyson</p>
        </blockquote>
        <h6>Space Exploration: The Final Frontier</h6>
        <p>Discover the latest missions and milestones in space exploration. From Mars rovers to deep space probes, <a href="https://www.fiction.com">stay updated</a> with our comprehensive coverage.</p>
        <hr>
        <dl><dt>Galactic Economy</dt><dd>How space mining is revolutionizing the economy.</dd><dt>Space Tourism</dt><dd>Upcoming missions you can join as a tourist.</dd><dt>Astronomical Events</dt><dd>Don't miss the next meteor shower!</dd><dd>Upcoming lunar and solar eclipses.</dd></dl>

        <p>Finally, after months of preparation, the crew is ready to embark on their journey to Mars. <strong>Stay tuned</strong> for live updates and exclusive coverage!</p></div><!-- Buttons --><div style="margin:32px 0;"><!--[--><a href="#" style="display:inline-block;border-radius:9999px;font-weight:600;text-decoration:none;padding:8px 12px;font-size:16px;background-color:#2563eb;color:white;">Confirm email address &#x2192;</a><!--]--></div><hr style="border:none;border-top:1px solid #DEDFE2;margin:3em 0; width: 5em;"><!-- Footer --><div style="margin-top:2em;"><!-- Footer Links --><div style="margin-bottom:32px;"><!--[--><!--]--></div><!-- Company Info --><div style="font-size:13px;opacity:0.6;"><div>© 2025 </div><!----></div><!-- Legal Footer --><table style="width:100%;margin-top:32px;" cellpadding="0" cellspacing="0"><tr><td><a href="https://www.fiction.com/unsubscribe" style="color:#0e0f11;text-decoration:none;font-size:13px;opacity:0.6;">Unsubscribe</a><span style="font-size:13px;opacity:0.6;">  •  </span><a href="/privacy" style="color:#0e0f11;text-decoration:none;font-size:13px;opacity:0.6;">Privacy</a><span style="font-size:13px;opacity:0.6;">  •  </span><a href="/terms" style="color:#0e0f11;text-decoration:none;font-size:13px;opacity:0.6;">Terms</a></td><td style="text-align:right;"><a href="https://www.fiction.com" target="_blank" rel="noopener" style="color:#0e0f11;text-decoration:none;font-size:13px;opacity:0.6;"> Created with Fiction </a></td></tr></table></div></div></body></html>"
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
