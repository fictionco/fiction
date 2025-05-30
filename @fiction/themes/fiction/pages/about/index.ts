import type { MapUserConfig } from '@fiction/cards/user/maps'
import { cardConfig } from '@fiction/cards'
import ImageAndrew from './img/ap.webp'
import ImageOffice from './img/fiction-office.webp'
import ImageGirlComputer from './img/girl-computer.webp'
import ImageMorgan from './img/morgan.jpg'
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

  const missionHeroCard = cardConfig({
    templateId: 'cardHeroV1',
    userConfig: {
      items: [
        {
          superTitle: {
            icon: { class: 'i-tabler-x' },
            text: 'The Struggle',
            theme: 'red',
          },
          title: `“This Feels Impossible”`,
          subTitle: `74% of professionals have no online presence. Clunky tools, tech overwhelm, and fear of looking unprofessional stop them cold.`,

          media: {
            format: 'image',
            url: ImageGirlComputer,
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
            text: 'Our Promise',
            theme: 'green',
          },
          title: `Authentic Presence, Made Simple`,
          subTitle: `You're not a tech expert, and you shouldn't have to be. Fiction lets you create a polished, authentic digital identity with ease—no coding, no stress.`,

          media: {
            format: 'image',
            url: ImagePro,
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
      subTitle: `Here to Make It Easy`,
      title: `Meet Your Team`,
      items: [
        {
          title: 'Andrew Powers',
          subTitle: 'Co-Founder / CEO',
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
          subTitle: 'Co-Founder / Sales',
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
          missionHeroCard,
          missionHeroCard2,
          teamCard,
          mapCard,
        ],
      }),
    ],
  })
}
