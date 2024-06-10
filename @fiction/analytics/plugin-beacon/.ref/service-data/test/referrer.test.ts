import { describe, expect } from 'vitest'
import { TheReferrerUtility } from '../referrer'

describe('referrer', () => {
  it('enrichReferrer', async () => {
    const results = await TheReferrerUtility.enrichReferrer(
      'https://www.yahoo.com',
    )

    expect(results).toMatchInlineSnapshot(`
      {
        "canonical": "http://www.yahoo.com",
        "description": "Latest news coverage, email, free stock quotes, live scores and video are just the beginning. Discover more every day at Yahoo!",
        "image": "https://s.yimg.com/cv/apiv2/social/images/yahoo_default_logo.png",
        "medium": "search",
        "referrerNiceName": "Yahoo!",
        "searchParameter": "",
        "searchTerm": "",
        "title": "Yahoo | Mail, Weather, Search, Politics, News, Finance, Sports & Videos",
      }
    `)
  })

  it('referralParameters', async () => {
    const results = await TheReferrerUtility.getReferralParameters(
      `https://www.yahoo.com`,
      `https://www.kaption.co?utm_medium=test&utm_source=anotherTest&utm_campaign=testing&utm_content=yes`,
    )

    expect(results).toMatchInlineSnapshot(`
      {
        "referralCampaign": "testing",
        "referralCanonicalUrl": "http://www.yahoo.com",
        "referralContent": "yes",
        "referralDescription": "Latest news coverage, email, free stock quotes, live scores and video are just the beginning. Discover more every day at Yahoo!",
        "referralImage": "https://s.yimg.com/cv/apiv2/social/images/yahoo_default_logo.png",
        "referralMedium": "test",
        "referralSource": "anotherTest",
        "referralTerm": undefined,
        "referralTitle": "Yahoo | Mail, Weather, Search, Politics, News, Finance, Sports & Videos",
      }
    `)
  })
})
