import type { MapUserConfig } from '@fiction/cards/user/maps'
import { cardConfig } from '@fiction/cards'
import ImageOffice from './img/fiction-office.webp'
import ImageAndrew from './img/team-ap.webp'
import ImageDean from './img/team-ds.webp'
import ImageMorgan from './img/team-mj.webp'

export async function getAboutPage() {
  const topHeroCard = cardConfig({
    templateId: 'cardHeroV1',
    userConfig: {
      items: [
        {
          superTitle: {
            icon: { class: 'i-tabler-home' },
            theme: 'primary',
            text: 'About Fiction',
          },
          title: `Your Story Matters`,
          subTitle: `Create a perfect version of yourself online.`,

          media: {
            format: 'image',
            url: ImageOffice,
          },
          layout: 'justify',
        },
      ],
    },
  })

  const teamCard = cardConfig({
    templateId: 'cardPeopleV1',
    userConfig: {

      title: `Team`,
      subTitle: 'Meet the Founders',
      items: [
        {
          title: 'Andrew Powers',
          subTitle: 'Co-Founder',
          content: 'Andrew obsesses over making Fiction intuitive, so you can focus on your story, not the tech.',
          media: {
            format: 'image',
            url: ImageAndrew,
          },
          action: {
            buttons: [{
              label: 'LinkedIn',
              theme: 'cyan',
              icon: { class: 'i-tabler-brand-linkedin' },
              href: 'https://www.linkedin.com/in/arpowers',
            }],
          },
        },
        {
          title: 'Morgan Jones',
          subTitle: 'Co-Founder',
          content: 'Morgan ensures your experience with Fiction is seamless, from start to stunning finish.',
          media: {
            format: 'image',
            url: ImageMorgan,
          },
          action: {
            buttons: [{
              label: 'LinkedIn',
              theme: 'cyan',
              icon: { class: 'i-tabler-brand-linkedin' },
              href: 'https://www.linkedin.com/in/morgan-jones-mba',
            }],
          },
        },
        {
          title: 'Dean Stoecker',
          subTitle: 'Special Advisor',
          content: `Dean, a visionary in AI and data, guides Fiction's strategic direction with his wealth of experience.`,
          media: {
            format: 'image',
            url: ImageDean,
          },
          action: {
            buttons: [{
              label: 'LinkedIn',
              theme: 'cyan',
              icon: { class: 'i-tabler-brand-linkedin' },
              href: 'https://www.linkedin.com/in/dean-stoecker',
            }],
          },
        },
      ],
      layout: 'mediabox',
    },
  })

  const mapIrvine: MapUserConfig = {
    lat: 33.5427,
    lng: -117.7854,
    zoom: 15,
    pitch: 60,
    markers: [{ lat: 33.5427, lng: -117.7854, label: 'Orange County, CA' }],
    mapStyle: 'satellite',
  }

  const mapSaltLake: MapUserConfig = {
    lat: 40.7608,
    lng: -111.8910,
    zoom: 8,
    pitch: 80,
    markers: [{ lat: 40.7608, lng: -111.8910, label: 'Salt Lake City, UT' }],
    mapStyle: 'outdoors',
  }

  const mapCard = cardConfig({ templateId: 'cardMapsV1', userConfig: { maps: [mapIrvine, mapSaltLake] } })

  return cardConfig({
    regionId: 'main',
    templateId: 'cardPageWrapV1',
    slug: 'about',
    title: 'About',
    nav: 'hide',
    cards: [
      cardConfig({
        templateId: 'cardPageAreaV1',
        cards: [
          topHeroCard,
          teamCard,
          mapCard,
        ],
      }),
    ],
  })
}
