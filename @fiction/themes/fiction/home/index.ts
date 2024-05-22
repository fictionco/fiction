import { createCard } from '@fiction/site/theme'
import { templates } from '../templates'
import selena from './img/selena.jpg'
import dean from './img/dean2.jpg'
import rogan from './img/rogan.jpg'
import obama from './img/obama.webp'
import andrew from './img/andrew.jpg'

export function page() {
  return createCard({
    templates,
    regionId: 'main',
    templateId: 'wrap',
    slug: '_home',
    title: 'Home',
    userConfig: {
      seoTitle: 'Fiction - Personal Marketing Platform',
      seoDescription: 'A platform to build your personal brand, powered by AI.',
    },
    cards: [
      createCard({
        templates,
        templateId: 'area',
        userConfig: { },
        cards: [
          createCard({
            templates,
            templateId: 'hero',
            userConfig: {
              superHeading: 'The #1 Platform for Personal Marketing',
              heading: `Build Your Personal Brand`,
              subHeading: `Tell your story &mdash; Create opportunities &mdash; Real results, guaranteed.`,
              actions: [
                {
                  name: 'Create Account',
                  href: '/app?reload=1',
                  btn: 'primary',
                  icon: 'i-tabler-user',
                },
                {
                  name: 'View Tour',
                  href: '/tour',
                },
              ],
            },
          }),
          createCard({
            templates,
            templateId: 'marquee',
            userConfig: {
              items: [
                {
                  name: 'Andrew Powers',
                  desc: 'Founder, Fiction.com',
                  tags: ['Tech'],
                  media: {
                    url: `${andrew}?blurhash=UbD%2Be.f%2B9an%24~UbIE2aeskaeV%40W%3BM%7BaeoLbb`,
                  },
                  href: 'https://www.andrewpowers.com',
                },

                {
                  name: 'Selena Gomez',
                  desc: 'Personal Site',
                  tags: ['Music'],
                  media: {
                    url: selena,
                  },
                },
                {
                  name: 'Dean Stoecker',
                  desc: 'Founder, Alteryx',
                  tags: ['Executive'],
                  media: {
                    url: dean,
                  },
                },
                {
                  name: 'Joe Rogan',
                  desc: 'Personal Site',
                  tags: ['Politics'],
                  media: {
                    url: rogan,
                  },
                },
                {
                  name: 'Barack Obama',
                  desc: 'Personal Site',
                  tags: ['Politics'],
                  media: {
                    url: obama,
                  },
                },
              ],
            },
          }),
          createCard({
            templates,
            templateId: 'logos',
            userConfig: {
              items: [
                {
                  name: 'The New York Times',
                  href: 'https://www.nytimes.com/2024/04/05/opinion/ezra-klein-podcast-nilay-patel.html',
                  media: {
                    format: 'html',
                    html: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 300 60" >
            <style>.B{fill:currentColor}</style><g transform="translate(1.181 5.339) scale(.7874)"><defs><path id="A" d="m375.3 11 .7 50.8H2L1.3 11z"/></defs><clipPath id="B"><use xlink:href="#A"/></clipPath><path d="M13 39.2V25.5l-4.5 1.8s-1.1 2.3-.9 5.7c.1 2.7 1.7 5.8 2.9 7.2zM25.1 11c1 .1 2.7.6 3.9 1.6 1.3 1.2 1.6 3.1 1.2 4.8-.4 1.5-.9 2.3-2.5 3.4S24.9 22 24.9 22v6.6L28 31l-3.1 2.8v9s2.6-2.1 4.6-6.2c0 0 .1-.2.3-.7.2 1.1.1 3.4-1.2 6.2-1 2.2-2.7 4.2-5 5.4-3.9 2.1-6.9 2.3-10 1.7-3.7-.7-7.1-2.7-9.3-6.2C2.7 40.5 2 37.7 2 34.6c.1-6.1 4.8-11.3 10.2-13.3.7-.2.9-.4 1.8-.5-.4.3-.9.6-1.5 1-1.7 1.1-3.2 3.3-3.9 5L19 22.3v14.1l-8.3 4.1c1 1.3 3.9 3.2 6.4 3.5 4.2.5 7-1.1 7-1.1v-9.2L21 31l3.1-2.4V22c-1.8-.2-4.3-1-5.5-1.3-1.9-.4-8.1-2.1-9.1-2.3-1-.1-2.2-.1-2.9.5s-1.2 1.8-.9 2.8c.2.6.6.9.9 1.2 0 0-.4 0-1-.4-1.2-.7-2.1-2-2.2-3.7A6.2 6.2 0 0 1 6 13.4c1.6-1 3.4-1.6 5.5-1.3 3.1.4 7.2 2.1 10.9 3 1.4.3 2.5.4 3.5-.1.5-.3 1.3-1.2.6-2.3-.8-1.3-2.3-1.3-3.6-1.5 1.2-.2 1.4-.2 2.2-.2" clip-path="url(#B)" class="B"/><defs><path id="C" d="m375.3 11 .7 50.8H2L1.3 11z"/></defs><clipPath id="D"><use xlink:href="#C"/></clipPath><path d="M65.8 35.6 61 39V27.8zm-.2-10.8-5.3 3.1-5 2.6v13L53.4 45l.3.3 1.9-1.5 5.9 5.1 10.2-7.8-.2-.3-5.7 4.3L61 41v-1.6l9.3-6.6z" clip-path="url(#D)" class="B"/><defs><path id="E" d="m375.3 11 .7 50.8H2L1.3 11z"/></defs><clipPath id="F"><use xlink:href="#E"/></clipPath><path d="M38.8 54c1.3.3 3.7.5 6.6-.9 3.2-1.5 4.4-4.8 4.4-8.1l.1-4.7V29.9l2-1.5-.2-.3-2 1.5-4.3-5-6.6 4.9V12.9l-6.7 5.5c.3.2 1.8.4 1.8 1.8v23.3l-3.5 2.2.2.3 1.5-1.1 4.2 3.8 6.6-5.1-.2-.3-1.6 1.2-2.2-1.5V30l2.6-1.6 3.6 3.7v11.2c0 3-.8 6.5-2.4 8.3s-2.2 1.9-3.9 2.4" clip-path="url(#F)" class="B"/><defs><path id="G" d="m375.3 11 .7 50.8H2L1.3 11z"/></defs><clipPath id="H"><use xlink:href="#G"/></clipPath><path d="M84.6 52.8c-2.6-.3-3.7-1.8-3.7-3.1 0-.8.8-2.3 2.4-2.5s3.2.5 4.6 2.1l6.1-6.5-.3-.3-1.6 1.8c-1.7-1.8-3.7-3-6.1-3.3V21.1L101.5 49s.4.3 1.1.3c.6 0 .4-.4.4-.4V20.8c1.3 0 3-.7 4-1.7 3-3 1.8-6.3 1.5-6.7-.2 1.4-1.3 2.9-3.2 2.9-2.5 0-4-1.8-4-1.8L95 20.3l.3.3 1.7-1.9c2.1 1.9 3.3 2.1 4.9 2.2v16.3L90.6 16.5c-1.1-1.7-2.7-3.2-5.2-3.2-2.9 0-5 2.5-5.3 4.6-.3 2.4 0 3 0 3s.4-2.7 2.1-2.7c1.5 0 2 .8 2.7 1.8v6.6c-1.6.1-5.4.3-5.7 4.5 0 1.6 1 3.2 1.9 3.7 1.1.7 2 .7 2 .7s-1.3-.7-.9-2.1c.4-1.2 2.7-1.4 2.8-.9v8.4c-1.3 0-5 .1-6.9 3.5-1.1 2-1 4.3.1 5.9 1 1.4 3 3.1 6.4 2.5" clip-path="url(#H)" class="B"/><defs><path id="I" d="m375.3 11 .7 50.8H2L1.3 11z"/></defs><clipPath id="J"><use xlink:href="#I"/></clipPath><path d="M118.2 35.6 113 39V27.8zm-.2-10.8-5.4 3.1-4.7 2.6v13L106 45l.3.3 1.9-1.5 5.5 5.1 10.2-7.8-.2-.3-5.7 4.3-4.6-4.2v-1.6l9.3-6.6z" clip-path="url(#J)" class="B"/><defs><path id="K" d="m375.3 11 .7 50.8H2L1.3 11z"/></defs><clipPath id="L"><use xlink:href="#K"/></clipPath><path d="m132.4 49.2-5-4-2.2 1.5-.2-.3 2.2-1.6V33.5c.1-4.6-4.4-3.5-4.1-8.4.1-2.2 2.3-3.8 3.4-4.3 1.2-.6 2.4-.6 2.4-.6s-2.1 1.2-1.6 3c.8 2.8 5.6 3 5.7 6.7v12.8l3.1 2.8.9-.7V30.9l-1.4-1.9 5-4.3 4.6 3.9-2.1 1.8v12.3l4.6 3.4.8-.5V30.9l-1.9-1.8 5-4.4 4.7 3.7 1.9-1.6.2.3-4.2 3.6v12l-10.7 6.4L138 45z" clip-path="url(#L)" class="B"/><defs><path id="M" d="m375.3 11 .7 50.8H2L1.3 11z"/></defs><clipPath id="N"><use xlink:href="#M"/></clipPath><g class="B"><path d="M352.3 35.6 347 39V27.8zm-.1-10.8-5.4 3.1-4.9 2.6v13l-2.1 1.5.3.3 1.9-1.5 5.9 5.1 10.2-7.8-.2-.3-5.7 4.3-4.7-4.2v-1.6l9.3-6.6z" clip-path="url(#N)"/><path d="m317 29.7 1.1-.9 2.9 3.6v10.7l-.9 1.2 4.2 4.5 4.5-4.3-1.8-1.7v-13l1.3-1 3.7 3.5V43l-1.5 1 4.7 4.9 6.2-5.5-.3-.3-1.5 1.3L337 42V29.8l2.5-1.7-.2-.3-2.3 1.7-4.2-4.6-6 4.6-4.3-4.4-5.8 4.4-4.3-4.4-6.2 5.2.2.3 2-1.6 2.8 3.1v10.8l-1.4 1.2 4.5 4.9 4.6-4.4-1.9-1.9zm-8.7 14.1-.2-.3-1.8 1.5-2.4-2.7V30.2l2.1-1.7-.3-.3-2 1.7-4.3-4.9-6.4 5 .8.2 1.6-1.3 2.6 2.9v12.3l-1.8 1.5.2.3 1.9-1.6 4.1 4.6zm-8.6-28 3.6 3.9-4.5 3.9-3.6-3.8z"/></g><defs><path id="O" d="m375.3 11 .7 50.8H2L1.3 11z"/></defs><clipPath id="P"><use xlink:href="#O"/></clipPath><path d="M275.2 39.2V25.5l-4.2 1.8s-1.1 2.3-.9 5.7c.1 2.7 1.7 5.8 2.9 7.2zm12-28.2c1.1.1 2.7.6 3.9 1.6 1.3 1.2 1.6 3.1 1.2 4.8-.4 1.5-.9 2.3-2.5 3.4s-2.8 1-2.8 1v6.6l3 2.6-3 2.6v8.9s2.5-1.8 4.6-5.9c0 0 .1-.2.3-.7.2 1.1.1 3.4-1.2 6.2-1 2.2-2.7 4.2-5 5.4-3.9 2.1-6.9 2.3-10 1.7-3.7-.7-7.1-2.7-9.3-6.2-1.6-2.5-2.3-5.3-2.3-8.4.1-6.1 4.8-11.3 10.2-13.3.6-.2.9-.4 1.8-.5-.4.3-.9.6-1.5 1-1.7 1.1-3.2 3.3-3.9 5l10.3-4.3v14.1l-8.2 3.9c1 1.3 3.9 3.2 6.4 3.5 4.2.5 6.9-1.3 6.9-1.3v-9.2l-3-2.6 3-2.6v-6.6c-1.8-.2-4.1-.8-5.4-1.1-1.9-.4-8.1-2.1-9.1-2.3-1-.1-2.2-.1-2.9.5s-1.2 1.8-.9 2.8c.2.6.6.9.9 1.2 0 0-.4 0-1-.4-1.2-.7-2.1-2-2.2-3.7a6.2 6.2 0 0 1 2.6-5.4c1.6-1 3.4-1.6 5.5-1.3 3.1.4 7.2 2.1 10.9 3 1.4.3 2.5.4 3.5-.1.5-.3 1.3-1.2.6-2.3-.8-1.3-2.3-1.3-3.6-1.5 1.1-.1 1.4-.1 2.2-.1" clip-path="url(#P)" class="B"/><defs><path id="Q" d="m375.3 11 .7 50.8H2L1.3 11z"/></defs><clipPath id="R"><use xlink:href="#Q"/></clipPath><path d="M365 27.4v6.5l2.8 1.9s4.8-3.8 6.6-7.2c0 0-2.2 2.9-5.1 2-2.5-.7-3.7-3.1-3.7-3.1m-5.5 17s2.1-3.4 5.8-2.7c3.5.7 5.1 4.3 5.1 4.3v-8.2l-2.9-2c-2.6 2.6-7.4 6.3-8 8.6m3.5 6.2c-.7.2-3.6-.5-4.3-3.5-.7-2.9 1.4-4.8 4.5-7.9l-3.7-3.3v-6.2s2.7-1.3 4.8-2.6l4.3-2.7s1.6 1.9 3.4 1.8c2.8-.2 2.7-2.4 2.6-2.9.5.8 1.8 3.3-3.2 8.8l4 3.1v8.1s-4.6 2.3-9.1 5.5c0 0-2.5-3-4.6-1.6-1.4 1.1-.7 2.7 1.3 3.4" clip-path="url(#R)" class="B"/><defs><path id="S" d="m375.3 11 .7 50.8H2L1.3 11z"/></defs><clipPath id="T"><use xlink:href="#S"/></clipPath><path d="m202 41.5 5.2 4.5V32.2l-5.2-4.6zm11.1-11.3 1.8-1.6.3.3-2.2 1.6v12.9l-5.2 3-4.8 2.8-6.1-5-1.6 1.4-.3-.3 2.1-1.4v-14h-.3l5.3-2.6 4.6-2.6z" clip-path="url(#T)" class="B"/><defs><path id="U" d="m375.3 11 .7 50.8H2L1.3 11z"/></defs><clipPath id="V"><use xlink:href="#U"/></clipPath><path d="m225.2 28.9 3.9-3.9s.5.5 1 .7c.3.1 1.5.7 2.5.1.6-.3.7-.4 1.3-1 .1 3-1.4 5.1-3.2 6-.8.4-3.4 1-5.8-1.7V43l2.9 2.1 2.1-1.6.2.3-6.4 5.2-4.9-4.3-1.8 1.6-.3-.3 2.2-2.3V31.8l-1.6-2.6-1.8 1.5-.3-.3 6.2-5.4z" clip-path="url(#V)" class="B"/><defs><path id="W" d="m375.3 11 .7 50.8H2L1.3 11z"/></defs><clipPath id="X"><use xlink:href="#W"/></clipPath><path d="m241.6 34.7 7.2-10.1s1 1.1 2.6 1.5c2.2.6 4.2-1.5 4.2-1.5-.4 2.7-1.8 5.8-4.7 6.3-2.6.4-5-1.5-5-1.5l-.5.7 10 14.6 2-1.7.3.3-6.9 5.8z" clip-path="url(#X)" class="B"/><defs><path id="Y" d="m375.3 11 .7 50.8H2L1.3 11z"/></defs><clipPath id="Z"><use xlink:href="#Y"/></clipPath><path d="M236 21.1c0-2.2-1.3-3.5-2.5-3.4l7.5-5.3v30.2l2.4 2.1 1.6-1.3.3.3L239 49l-4.3-3.9-1.7 1.5-.3-.3 3.4-2.5V21.1z" clip-path="url(#Z)" class="B"/><defs><path id="a" d="m375.3 11 .7 50.8H2L1.3 11z"/></defs><clipPath id="b"><use xlink:href="#a"/></clipPath><path d="M185.2 29.6s-.9 1-2.2 1c-1.4 0-2-1-2-1v4.1s.6-1 2-1 2.2.9 2.2.9zm-.2-8.8-2.5-2.6-1.5 1.1V29s.9 1.1 2.3 1.1S185 29 185 29zm-4 27.4s1.8.5 3.2-.6c1.5-1.2.8-2.8.8-2.8V34.4s-.4-1.1-1.7-1.1c-1.4 0-2.3 1.1-2.3 1.1zm-11-27.6c0-2-.9-3.2-2.2-3.2-2 0-2.5 2.7-2.5 2.7s-.4-2.1 1.5-4c1-1.1 2.9-2.6 5.9-1.9 3.1.7 4.3 3 4.3 5.1v28.1a15.4 15.4 0 0 0 1.6.3c.9.2 1.4.4 1.4.4V14.3h1v4.6l6.1-4.9 4.6 4 2.2-1.8.2.3-2.2 1.9v26.1c-.1 1.7-.4 3.4-2.1 4.4-3.7 2.1-8.2-.3-12.2-.9-3-.4-7.6-1-8.8 1.7-.4.9-.4 2.2 1 3.1 2.7 1.7 14.7-2.9 18.8-1.1 3.7 1.7 3.7 4.4 3.2 6.2-1 3.4-5.5 4.1-5.5 4.1s2.2-1.2 1.6-3.3c-.3-1-1-1.3-3.4-1.1-5.1.6-11.3 3-15.4 1.3-2.1-.9-3.6-3.4-3.5-6 .1-3.6 4.5-5.1 4.5-5.1V34.3c-.1-.5-2.4-.4-3 .6-.8 1.5 1 2.2 1 2.2s-1.4.2-2.6-1.1c-.6-.6-1.8-2.9-.2-5.1 1.3-1.8 2.9-2.1 4.9-2.3z" clip-path="url(#b)" class="B"/></g></svg>
            `,
                  },
                },

                {
                  name: 'The Guardian',
                  href: 'https://www.theguardian.com/technology/2022/nov/12/when-ai-can-make-art-what-does-it-mean-for-creativity-dall-e-midjourney',
                  media: {
                    format: 'html',
                    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 295 97"><path fill="currentColor" d="M66.9 51.7c1-.5 2.1-1.1 3.1-1.6.4-.2 1.8-.7 2-1.1.1-.2 0-.8 0-1.1v-2.4-17.1-16.7-2.2c0-.1.1-.8 0-.9-.1-.1-.9 0-1 0h-2.2c-.8 0-.7.1-1.2.7-1.9 2.5-3.8 5-5.7 7.6-.9 1.2-1.8 2.3-2.6 3.5-.6.8-.6.9-1.7.9l.3-6.6c.1-1.6.1-3.2.2-4.8 0-.6.1-1.2.1-1.8 0-.2-.1-.8 0-.9.2-.3 2-.1 2.5-.1h37.4c.2 0 1.1-.1 1.3 0 .2.1.1.7.1 1 .1 1.3.1 2.7.2 4 .1 2.9.2 5.7.4 8.6v.6c-.5 0-.9.1-1.3-.2-.4-.3-.7-.9-1-1.3-1.2-1.6-2.4-3.3-3.7-4.9l-3.6-4.8c-.2-.3-.5-1-.9-1.2-.3-.2-.9-.1-1.3-.1h-1.6c-.2 0-1-.1-1.2 0-.1.1 0 .1-.1.3-.2.8 0 1.8 0 2.6v34.8c0 .7-.2 1.7 0 2.4s1.8 1.2 2.5 1.5c.7.4 1.9.7 2.5 1.3.2.2.4 1.2.2 1.5-.1.1-.6 0-.7 0h-22c-.2 0-.9.1-1 0-.1-.4 0-1.2 0-1.5zm37.1-1.8V35.3 11.4 7.5c0-.6.2-1.5 0-2.1-.2-.7-1.4-.8-2.1-1.1-.4-.1-1.7-.4-1.9-.8v-.8h.3c.4-.2 1.2-.2 1.7-.3.9-.2 1.8-.3 2.6-.5 2-.4 4.1-.8 6.1-1.1 1.2-.2 2.4-.5 3.6-.7.3 0 1.5-.2 1.6 0 .1.1 0 .5 0 .6V21.4c3.8-3.8 10.4-5.9 15.7-4.6 4.6 1.1 6.1 5.4 6.1 9.8.1 5.6 0 11.1 0 16.7v4.5c0 .5-.2 1.7 0 2.2.1.2.5.3.7.5.7.4 1.5.8 2.2 1.2.1.1.4.2.4.3.1.1.1 1 0 1.1-.1.2-.1.1-.4.1-1.1.2-2.3 0-3.3 0H122.9c-.1 0-.6.1-.7 0-.1-.1-.1-1.2 0-1.3.3-.4 1.5-.8 1.9-1.1.3-.2 1.2-.5 1.4-.8.2-.3 0-1.4 0-1.7v-4.1c0-5.8.1-11.7 0-17.5 0-1.7-.3-3.7-2-4.6-.9-.5-2.1-.6-3.1-.6-.8 0-1.6.2-2.3.4-.6.2-1.7.6-2.1 1.1-.3.4-.1 1-.1 1.5V48.1c0 .5-.2 1.5 0 1.9.1.2.5.4.8.5.7.4 1.6.8 2.3 1.2.1.1.3.1.3.2.1.1.1 1 0 1.1-.1.1-.2.1-.4.1-1.1.1-2.3 0-3.4 0H101.1c-.1 0-.6.1-.7 0-.1-.1 0-1.1.1-1.3.3-.4 1.4-.8 1.8-1 .7-.3 1.2-.6 1.7-.9zm47.5-13.8c.2 4.4 1.6 9.3 5.6 11.7 2.1 1.2 4.7 1.6 7.1 1.4 2.9-.3 5.3-1.7 7.8-3 0 .4.1 1.1 0 1.5-.2.4-.7.9-1 1.2-.4.4-.9.9-1.4 1.3-1.7 1.4-3.6 2.4-5.6 3.1-3.8 1.3-8.2 1.2-12.1.2-3.1-.8-5.9-2.3-8-4.7-2.1-2.4-3.3-5.5-3.8-8.7-1.1-6.9.2-14.8 5.9-19.4 5-4 13-4.8 18.9-2.4 7.2 2.9 8.4 11.1 8.4 17.9h-19.1c-.9-.1-1.8-.1-2.7-.1zm-.2-1.7c2-.1 4-.2 6.1-.4 1.2-.1 2.5-.1 3.7-.2.2 0 .7 0 .9-.1.3-.2.1-2.2.1-2.6-.1-3.6-.2-8-2.3-11.1-1.5-2.2-3.8-1.8-5.2.2-2.9 3.9-3.3 9.7-3.3 14.2zM-.1 70.9c0-5.6 1.1-11.4 4.2-16.1 3-4.6 7.8-7.6 13-9.1 6.3-1.8 13.3-1.6 19.8-.4 1.4.3 2.8.6 4.1 1 .2.1 1.1.3 1.2.5v.3c.3 1.2.1 2.7.1 3.9.1 3.1.1 6.3.2 9.4-.4 0-1.1.1-1.4 0-.2-.1-.4-.6-.5-.8-.8-1.2-1.6-2.4-2.3-3.7-1.7-2.7-3.5-5.4-5.2-8.1-.9-1.5-3.4-1.5-5-1.5-1.8 0-3.6.3-5.1 1.2-3.4 2.1-5 6.2-5.9 9.9-1.4 5.9-1.3 12.1-1 18.1.3 4.6.7 9.5 2.5 13.7 1.1 2.6 3 4.9 5.9 5.5.9.2 1.8.2 2.8.1.6-.1 2.7-.2 3-.8.1-.2 0-.7 0-.9v-1.7-10.6-4.1c0-.7.2-1-.4-1.4-.7-.4-1.5-.8-2.2-1.3-.5-.3-1.5-.6-1.8-1-.2-.2-.3-1.3-.1-1.5.1-.2.1-.1.4-.1.9-.2 2.1 0 3 0h15.5c1 0 2.1-.1 3.1 0h.4c.1.1.1 1.5 0 1.7-.2.3-1.2.7-1.6.9-.7.4-1.5.8-2.2 1.3-.8.4-.7.4-.7 1.3v16.3c0 .2.1.7 0 .9-.2.5-2.3.8-2.9 1-1.7.5-3.5.9-5.3 1.2-3.5.6-7 .8-10.5.7-5.6-.2-11.5-1.4-16.1-4.8-4-2.9-6.6-7.3-7.8-12.1C.2 77-.1 73.9-.1 70.9zM46 61.8c0-.2-.1-1 0-1.1.1-.1.2 0 .3-.1.6-.3 1.4-.3 2.1-.4 2.3-.4 4.6-.8 7-1.2 1.8-.3 3.6-.7 5.3-.9.5-.1 1.1-.1 1.6.1.5.1.3 0 .4.4.2 1.2 0 2.6 0 3.8v20.9c0 2.5-.7 7.1 1.7 8.6 1.2.8 2.9.8 4.3.5 1.1-.2 3.2-1 3.6-2.2.1-.3 0-.7 0-1v-2.1-13.9-6.4-2.1c0-.2.1-.8 0-1-.3-.3-1.3-.6-1.6-.7-.6-.2-1.1-.5-1.7-.7-.2-.1-.9-.2-1-.4-.1-.1-.1-1 0-1.1.1-.1.1 0 .2-.1.5-.3 1.4-.2 1.9-.3 4.1-.7 8.3-1.6 12.5-2.2.5-.1 1-.1 1.5 0s.3-.1.4.4c.2 1 0 2.4 0 3.5v28.8c0 .3-.1.8 0 1.2.1.3 0 .2.5.4 1 .4 2.1.9 3.1 1.3.3.1.4.1.5.3.1.2.1.9 0 .9-.2.2-1.2.1-1.4.2-2.2.3-4.4.5-6.7.8-2 .2-4 .5-5.9.7-.4.1-.8.1-1.2 0-.2 0-.8 0-.9-.1-.1-.2 0-1 0-1.2v-1.7c0-.3.2-1.1 0-1.4-.2-.3-.6.1-.9.3-.8.7-1.7 1.4-2.6 1.9-3.3 2-7.4 2.9-11.2 2.1-2.8-.6-5.2-2.2-6.4-4.9-.9-1.9-1.1-4-1.1-6V73.8 67v-2.3c0-.2.1-.8 0-1-.2-.3-1.4-.6-1.7-.8-1-.4-1.8-.7-2.6-1.1zm94.3-3.8c.2 0 1.1 0 1.2.2.1.1 0 .8 0 .9v8.8c0 .3-.1.8 0 1.1v.2c.4.4.5-.9.6-1 .9-3.7 2.6-8 6.4-9.5.7-.3 1.4-.4 2.1-.5.6 0 2.3-.2 2.6.3.1.2 0 .7 0 .9V69.6c-2.4-.5-5.1-.4-7.4.1-1.1.2-2.1.5-3.1 1-.5.2-.6.1-.7.5-.1.4 0 1.1 0 1.5V92c0 .2-.1.5 0 .7.2.3.9.5 1.2.6.5.3 1.1.6 1.6.9.2.1.5.2.6.4.1.1.1 1.3 0 1.4-.1.1-.7 0-.9 0h-16.6c-.5 0-1.4.2-1.8 0h-.3c-.1-.1 0-1.2 0-1.3.2-.6 1.5-1 2.1-1.3.4-.2 1.2-.5 1.4-.9.1-.2 0-.8 0-1v-2.1-25.7c0-.1.1-.6 0-.7-.1-.1-.6-.2-.8-.2-.6-.2-1.2-.4-1.8-.5-.6-.2-2.1-.3-1.6-1.3.1-.3.5-.2.9-.3 4.4-.8 8.7-1.6 13.1-2.4.4-.2.8-.2 1.2-.3zm37.7.9v-8-2.3c0-.3.1-.9 0-1.2-.1-.2-.5-.3-.8-.4-.8-.3-1.6-.6-2.5-.9-.6-.2-.9-.1-.9-.8 0-.6-.1-.4.4-.5 1.1-.4 2.4-.4 3.5-.6 3.3-.6 6.5-1.2 9.8-1.8.7-.1 1.4-.3 2.1-.2.8.1.9-.1.9.6.1 1.6 0 3.3 0 4.9v43.8c0 .4-.1.4.2.6.6.4 1.6.6 2.2.8.4.1 1.5.3 1.7.6.1.1.1 1.2 0 1.3-.1.1-.7.1-.8.1-1.4.2-2.7.4-4.1.5-3.1.4-6.2.8-9.4 1.2-.5.1-1.7.3-1.9-.1-.2-.4 0-1.7 0-2.1 0-.3.2-1.6 0-1.8-.2-.2-2.4 1.8-2.7 2-1.2.8-2.5 1.4-3.9 1.8-2.2.6-4.7.6-6.9.1-9.6-2.2-11.6-13.6-10.8-21.9.4-4.4 1.8-8.8 4.8-12 2.8-2.9 6.6-4.4 10.5-4.7 3-.3 5.9-.1 8.6 1zm0 31.9V66.2v-4.6c0-.6-.1-.7-.8-1.1-1.4-.8-3.2-1.1-4.7-.5-2.3.9-3.4 3.6-4 5.8-1.2 4-1.3 8.3-1.2 12.5.1 3.6.2 8 2.2 11.2 1.8 2.8 5.9 3.5 8.5 1.3zM211.1 58c.5.1 1.1-.1 1.3.4.1.3 0 1 0 1.3V91c0 .4-.1 1 0 1.4.1.4.5.5.9.7.6.3 1.1.6 1.7.9.2.1.8.3.9.6 0 .1.1 1.3 0 1.4h-.3c-.6.1-1.4 0-2.1 0h-15.2c-.4 0-1.5.2-1.8 0-.2-.1-.3-1.3-.1-1.5.2-.3.9-.5 1.2-.6.6-.3 1.2-.7 1.8-1 .5-.3.4-.2.4-.6.2-1.5 0-3.2 0-4.7v-7.9-14.4c0-.4.1-1.1 0-1.5-.1-.4-.6-.4-1-.6-.7-.3-1.3-.5-2-.8-.2-.1-1-.2-1.2-.5-.1-.1-.1-1.1 0-1.2.1-.1.3 0 .4-.1.8-.3 1.7-.3 2.6-.5 1.3-.2 2.5-.5 3.8-.7 2.5-.4 4.9-.9 7.4-1.3.5.1.9 0 1.3-.1zm1.4-9.3c-.2 6-8.3 8.6-12 3.9-1.7-2.2-1.8-5.2-.3-7.5s4.4-3.3 7.1-2.7c3 .6 5.2 3.2 5.2 6.3zm43.8 43.9V68.5v-4.6c0-.1.1-.6 0-.7-.1-.2-.7-.3-.9-.3l-1.8-.6c-.3-.1-1.1-.2-1.3-.5-.2-.2-.1-.7-.1-1 0-.6.2-.5.8-.6l6.6-1.2 6.6-1.2c.4-.1.7-.2 1.1-.2.2 0 1.2 0 1.4.1.1.1 0 .7 0 .9v1.9c0 .3-.2 1.2 0 1.5.2.4.6 0 .9-.3.9-.7 1.8-1.3 2.8-1.8 3.6-2 7.9-2.9 12-2.3 2.8.4 5.1 1.9 6.1 4.6.7 1.9.8 3.9.8 5.9v22.8c0 .4-.1 1.1 0 1.5.1.4.4.5.9.7.5.3 1.1.6 1.6.9.2.1.9.3 1 .6.1.2.1 1.2 0 1.3-.1.2.1 0-.2.1-.4.2-1.3 0-1.8 0h-14.3c-.6 0-2.9.3-3.2-.1-.1-.1-.1-1.2 0-1.4.1-.2.7-.4.9-.5.6-.3 1.1-.6 1.7-.9.2-.1.8-.3.9-.5.1-.2 0-.6 0-.8v-2.2-7-13.5c0-1.6.1-3.4-.9-4.8-.8-1.2-2.2-1.5-3.6-1.6-1.1 0-2.1.1-3.1.4-.5.2-2 .6-2.3 1.2-.1.2 0 .6 0 .8V91c0 .3-.1 1 0 1.3.1.4.7.5 1 .7.5.3 1.1.6 1.6.9.2.1.6.3.7.4.1.1.1 1.3 0 1.4 0 .1-.1 0-.2 0-.4.2-1.4 0-1.8 0h-16.8c-.5 0-.6.1-.7-.2-.1-.2-.1-1.1 0-1.3.1-.2.7-.4.9-.5 1-.1 1.8-.6 2.7-1.1zm-21.2-18.4c0-2.6.1-5.3-.1-8-.3-2.9-1.1-6.1-4.4-6.7-1-.2-2.8-.5-3.5.3-.7.7-1.2 1.7-1.8 2.5l-5.1 6.9c-.3.4-.6 1.2-1 1.4-.1.1-1.1.1-1.1 0-.1-.1 0-.8 0-1v-8.1c0-.3-.1-.8 0-1.1.2-.5 2.4-.8 2.9-1 2.8-.7 5.7-1.2 8.6-1.4 4.1-.3 8.7-.2 12.5 1.6 3 1.4 4.9 3.9 5.4 7.1.3 1.6.2 3.4.2 5v20c0 .3-.2 1.1 0 1.3.1.1.6.2.7.2.8.2 1.5.4 2.3.6.5.1.6.1.6.6s.1.5-.5.7c-.7.3-1.4.6-2.1.8-3.7 1.1-9.5 1.4-12.2-2-.2-.3-.8-1.6-1.1-1.7-.4-.1-1.6 1.5-2 1.8-1.6 1.4-3.7 2.2-5.8 2.5-3.9.5-8.1-.3-10.5-3.7-2-2.9-2.4-7.4-.9-10.6 2.7-6.1 10.7-6.7 16.5-7.7.7 0 1.5-.2 2.4-.3zm0 16.6V76c-3 .2-6.1.4-7.2 3.7-.8 2.2-.8 4.8-.5 7.1.2 1.6.6 3.6 2.1 4.6 1.6 1.1 4.3.9 5.6-.6zM108.5 74.2c0-2.6.1-5.3-.1-8-.3-2.9-1.1-6.1-4.4-6.7-1-.2-2.8-.5-3.5.3-.7.7-1.2 1.7-1.8 2.5l-5.1 6.9c-.3.4-.6 1.2-1 1.4-.1.1-1.1.1-1.1 0-.1-.1 0-.8 0-1v-8c0-.3-.1-.8 0-1.1.2-.5 2.3-.8 2.9-1 2.8-.7 5.7-1.2 8.5-1.4 4.1-.3 8.7-.2 12.5 1.6 3 1.4 4.9 3.9 5.4 7.1.3 1.6.2 3.4.2 5v20c0 .3-.2 1.1 0 1.3.1.1.6.2.7.2.8.2 1.5.4 2.3.6.5.1.6.1.6.6s.1.5-.5.7c-.7.3-1.4.6-2.1.8-3.7 1.1-9.5 1.4-12.2-2-.2-.3-.8-1.6-1.1-1.7-.4-.1-1.6 1.5-1.9 1.8-1.6 1.4-3.7 2.2-5.8 2.5-3.9.5-8.1-.3-10.5-3.7-2-2.9-2.4-7.4-.9-10.6 2.7-6.1 10.7-6.7 16.4-7.7.8-.1 1.6-.3 2.5-.4zm0 16.6V76c-3 .2-6.1.4-7.2 3.7-.8 2.2-.8 4.8-.5 7.1.2 1.6.6 3.6 2.1 4.6 1.6 1.1 4.3.9 5.6-.6z"/></svg>`,
                  },
                },
                {
                  name: 'TechCrunch',
                  href: 'https://techcrunch.com/sponsor/fluency/the-ai-revolution-using-artificial-intelligence-to-unlock-massive-time-savings/',
                  media: {
                    format: 'html',
                    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 60"><path fill="currentColor" d="M13.53 41.967v10H9.86v-10h-3.7v-3.2h11.07v3.2zm12.26 6.04h-5.85a1.56 1.56 0 0 0 1.68 1.59 5.17 5.17 0 0 0 2.57-.7l1.33 2.2a7.68 7.68 0 0 1-4 1.14c-3 0-4.63-2.12-4.63-5.16 0-3.42 1.93-5.18 4.53-5.18s4.42 1.8 4.42 5.48c-.04.24-.04.45-.05.62zm-4.5-3.63c-.78 0-1.2.53-1.32 1.52h2.83c-.17-1-.5-1.52-1.5-1.52zm10.82 7.83c-2.9 0-4.64-1.85-4.64-5.2 0-3 1.54-5.14 4.72-5.14a4.13 4.13 0 0 1 3.81 2.24l-2.34 1.8c-.47-.86-.8-1.28-1.53-1.28s-1.3.87-1.3 2.44.47 2.38 1.4 2.38c.64 0 1.1-.36 1.72-1.3l2.15 1.68c-1.16 1.7-2.23 2.37-4 2.37zm11.6-.2v-5.63c0-1.3-.43-1.63-1.13-1.63s-1.16.34-1.16 1.6v5.67h-3.4v-12.4l3.4-1.36v4.5a3.84 3.84 0 0 1 2.5-.87c2.17 0 3.2 1.46 3.2 4.06v6.07z" fill="currentColor"/><path fill="currentColor" d="M55.27 52.207c-3.93 0-6-2.9-6-6.82 0-4.25 2.5-6.82 6-6.82 3.25 0 4.53 1.4 5.44 3.9l-3.32 1.3c-.48-1.23-.93-2-2.14-2-1.53 0-2.2 1.53-2.2 3.63s.64 3.62 2.23 3.62c1.15 0 1.64-.62 2.36-1.87l3.1 1.65a5.69 5.69 0 0 1-5.48 3.42zm13.86-6.4a2.13 2.13 0 0 0-1.58-.83c-.83 0-1.34.4-1.34 1.6v5.4h-3.4v-9.9h3.4v.72a3 3 0 0 1 3.72-.51zm8.1 6.18v-.66a3.76 3.76 0 0 1-2.48.87c-2.17 0-3.2-1.46-3.2-4.07v-6.03h3.4v5.6c0 1.28.44 1.62 1.14 1.62s1.13-.34 1.13-1.58v-5.64h3.42v9.92zm11.56 0v-5.63c0-1.3-.44-1.63-1.13-1.63s-1.16.34-1.16 1.6v5.67h-3.4v-9.9h3.4v.66a3.84 3.84 0 0 1 2.5-.87c2.17 0 3.2 1.46 3.2 4.06v6.07zm10.05.2c-2.9 0-4.65-1.85-4.65-5.2 0-3 1.55-5.14 4.72-5.14a4.16 4.16 0 0 1 3.82 2.24l-2.34 1.77c-.48-.86-.8-1.28-1.53-1.28s-1.3.87-1.3 2.44.47 2.38 1.4 2.38c.64 0 1.1-.36 1.72-1.3l2.15 1.68c-1.15 1.74-2.23 2.4-3.98 2.4zm11.6-.2v-5.63c0-1.3-.43-1.63-1.13-1.63s-1.15.34-1.15 1.6v5.67h-3.4v-12.4l3.4-1.36v4.5a3.79 3.79 0 0 1 2.49-.87c2.18 0 3.2 1.46 3.2 4.06v6.07z"/><path d="M34.525 7.753v7.936h7.925v15.86h7.936v-15.86h7.925V7.753zm31.722 15.86v-7.925H58.31v15.86h23.797v-7.936zm0-15.86h15.86v7.936h-15.86z" fill="currentColor"/></svg>`,
                  },
                },
              ],
              label: 'As Seen On',
            },
          }),
        ],

      }),

    ],
  })
}
