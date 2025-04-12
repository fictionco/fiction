import type { MapUserConfig } from '@fiction/cards/user/maps'
import { cardConfig } from '@fiction/cards'
import ImageAndrew from './img/ap.webp'
import ImageOffice from './img/fiction-office.webp'
import ImageGirlComputer from './img/girl-computer.webp'
import ImagePro from './img/pro.webp'

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
          title: `Fiction's Story`,
          subTitle: `Helping people since 2023.`,

          media: {
            format: 'url',
            url: ImageOffice,
          },
          layout: 'justify',
        },
      ],
    },
  })

  const missionHeroCard = cardConfig({
    templateId: 'cardHeroV1',
    userConfig: {
      items: [
        {
          superTitle: {
            icon: { class: 'i-tabler-x' },
            text: 'The Problem',
            theme: 'red',
          },
          title: `74% of Professionals Remain Invisible`,
          subTitle: `Yet almost all of them have a story to tell. We built Fiction to help you share your work and ideas with the world.`,

          media: {
            format: 'url' as const,
            url: ImagePro,
          },
          layout: 'left',
          action: { buttons: [] },
        },
      ],
    },
  })

  const missionHeroCard2 = cardConfig({
    templateId: 'cardHeroV1',
    userConfig: {
      items: [
        {
          superTitle: {
            icon: { class: 'i-tabler-users' },
            text: 'Our Solution',
            theme: 'green',
          },
          title: `For busy, frustrated professionals`,
          subTitle: `We built Fiction after watching brilliant minds struggle to share their work online. Now 21,000+ professionals use our platform daily to build their legacy.`,

          media: {
            format: 'url',
            url: ImageGirlComputer,
          },
          layout: 'right',
          action: { buttons: [] },
        },
      ],
    },
  })

  const teamCard = cardConfig({
    templateId: 'cardPeopleV1',
    userConfig: {
      subTitle: `Expertise You Can Trust`,
      title: `Our Team`,
      items: [{
        title: 'Andrew Powers',
        subTitle: 'Founder & CEO',
        content: 'Andrew previously built platforms that empowered 70,000+ creators at PageLines.',
        media: {
          format: 'url',
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
      }],
      layout: 'mediabox',
    },
  })

  const mapIrvine: MapUserConfig = {
    lat: 33.5427,
    lng: -117.7854,
    zoom: 15,
    pitch: 60,
    markers: [{ lat: 33.5427, lng: -117.7854, label: 'Orange County, CA' }],
    mapStyle: 'satellite' as const,
  }

  const mapSaltLake: MapUserConfig = {
    lat: 40.7608,
    lng: -111.8910,
    zoom: 8,
    pitch: 80,
    markers: [{ lat: 40.7608, lng: -111.8910, label: 'Salt Lake City, UT' }],
    mapStyle: 'outdoors' as const,
  }

  const mapCard = cardConfig({
    templateId: 'cardMapsV1',
    userConfig: {
      maps: [mapIrvine, mapSaltLake],
    },
  })

  const valueCard = cardConfig({
    templateId: 'cardFaqV1',
    userConfig: {
      layout: 'visible',
      standard: {
        headers: {
          title: 'Values',
          subTitle: 'Basic principles that guide the company.',
        },
      },
      items: [
        {
          title: 'Karma',
          content: `Give genuinely. Returns follow naturally.`,
          icon: { iconId: 'target' },
        },
        {
          title: `Beauty`,
          content: `Elegance cuts through noise. Simplicity wins.`,
          icon: { class: 'i-tabler-sparkles' },
        },
        {
          title: `Discipline`,
          content: `Consistent excellence outperforms sporadic brilliance.`,
          icon: { iconId: 'sparkles' },
        },
      ],
    },
  })

  return cardConfig({
    regionId: 'main',
    templateId: 'cardPageWrapV1',
    slug: 'about',
    title: 'About',
    inNav: true,
    cards: [
      cardConfig({
        templateId: 'cardPageAreaV1',
        cards: [
          topHeroCard,
          missionHeroCard,
          missionHeroCard2,
          teamCard,
          mapCard,
          valueCard,
        ],
      }),
    ],
  })
}
