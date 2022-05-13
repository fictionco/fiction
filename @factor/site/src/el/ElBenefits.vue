<template>
  <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <h2 class="text-center text-2xl font-bold tracking-tight sm:text-4xl">
        Why you'll love using Factor
      </h2>
      <p class="mt-4 text-center text-lg text-slate-500 md:text-xl">
        Factor will help you launch websites and applications faster.
      </p>
    </div>

    <div class="pt-16">
      <h2 class="sr-only">
        Factor will help you launch websites and applications faster.
      </h2>
      <dl class="space-y-10 md:grid md:grid-cols-3 md:gap-8 md:space-y-0">
        <div v-for="(benefit, i) in benefits" :key="i">
          <div
            class="h-12 w-12 overflow-hidden rounded-md shadow-lg"
            v-html="benefit.icon"
          ></div>
          <div class="mt-5">
            <dt class="text-xl font-bold leading-6">
              {{ benefit.title }}
            </dt>
            <dd class="mt-2 text-base text-slate-500">
              {{ benefit.text }}
            </dd>
          </div>
        </div>
      </dl>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { vue } from "@factor/api"

const benefits = vue.ref([
  {
    icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 48V0h48v48H0z" fill="#40CF8F"/><path d="M14.3 36.4a2.5 2.5 0 002.7.3 15 15 0 0114 0c.9.5 2 .3 2.8-.3a15 15 0 10-19.5 0z" fill="#D5FAD0"/><path d="M12 23v-.3a12 12 0 015.5-8.6l1.4-.7.7-.3.8-.3.8-.2.8-.2 1.6-.2a12.2 12.2 0 017.5 2.2c.4.3.9.5 1.2.9l1 1 .8 1c1.1 1.4 2 3.1 2.3 5a1 1 0 01-2.1.4v-.4a11.2 11.2 0 00-1.8-4l-.6-.8-.9-.9c-.2-.3-.6-.5-1-.8a11 11 0 00-6.4-2h-1.4l-.7.2c-.2 0-.5 0-.7.2l-.7.2-.6.2-1.2.6a10.8 10.8 0 00-5.3 7.6v.4a.5.5 0 01-1-.1z" fill="#40CF8F"/><path d="M23 24l9.8-8.8a.7.7 0 011 1L25 26a1.5 1.5 0 01-2-2z" fill="#008167"/>
</svg>`,
    title: "Dynamic Power, Static Scale",
    text: "Weild the scalability of a statically hosted site with the power of a full featured   endpoint framework.",
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200">
  <path fill="#814AE6" d="M0 200V0h200v200H0z"/>
  <rect width="129" height="108" x="36" y="46" stroke="#B389FF" stroke-width="4" rx="7"/>
  <rect width="23" height="8" x="47" y="55" fill="#F0E8FF"/>
  <rect width="107" height="67" x="47" y="75" fill="#B389FF"/>
  <path fill="#F0E8FF" d="M104 58h14v3h-14v-3zM122 58h14v3h-14v-3zM140 58h14v3h-14v-3z"/>
</svg>`,
    title: "Full Control",
    text: "Get a standardized structure without it getting in your way. Your app controls all features and all UI.",
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200">
  <path fill="#FECB42" d="M0 200V0h200v200H0z"/>
  <path fill="#FFEFC6" fill-rule="evenodd" d="M45 63.3V45h18.3v10H55v8.3H45zM118.3 45H81.7v10h36.6V45zm18.4 0v10h8.3v8.3h10V45h-18.3zM155 81.7h-10v36.6h10V81.7zm0 55h-10v8.3h-8.3v10H155v-18.3zM118.3 155v-10H81.7v10h36.6zm-55 0v-10H55v-8.3H45V155h18.3zM45 118.3h10V81.7H45v36.6z" clip-rule="evenodd"/>
  <path fill="#CF7C3D" d="M114.8 150c.5.3 1.1.5 1.7.5a3.2 3.2 0 003-2l9-21.1 21-9a3.2 3.2 0 00.4-5.7L92.6 81a3.2 3.2 0 00-4.5 4l25.5 63.6c.3.6.7 1 1.2 1.4z"/>
</svg>`,
    title: "Simple yet powerful",
    text: "Factor simplifies your life by helping you use standards and best-practices without having to think about them.",
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200">
  <path fill="#5233ff" d="M0 200V0h200v200H0z"/>
  <path fill="#A5CCFF" d="M130.7 86.7h-78c-3.7 0-6.7 3-6.7 6.7v40.7c0 11.2 9.1 20.4 20.3 20.4H107c11.2 0 20.3-9.2 20.3-20.4h3.4a23.7 23.7 0 000-47.4zm0 37.2h-3.4V97h3.4a13.6 13.6 0 010 27z"/>
  <path fill="#fff" d="M79.2 77a3.4 3.4 0 01-3.4 2.9h-3.5c-2 0-3.7-1.8-3.4-3.8.8-6 3.5-11.5 7.7-15.8 3-3.2 5-7.1 5.6-11.4.3-1.7 1.7-2.9 3.4-2.9h3.5c2 0 3.7 1.8 3.5 3.8-.9 6.8-3.9 13-8.6 17.9a17.2 17.2 0 00-4.8 9.3zm23.7 0a3.4 3.4 0 01-3.3 2.9H96c-2.1 0-3.8-1.8-3.5-3.8.8-6 3.5-11.5 7.8-15.8 3-3.2 5-7.1 5.5-11.4.3-1.7 1.7-2.9 3.5-2.9h3.4c2.1 0 3.7 1.8 3.5 3.8-.8 6.8-3.8 13-8.6 17.9a17.2 17.2 0 00-4.8 9.3z"/>
</svg>`,
    title: "Easy to use",
    text: "Nobody likes reading technical docs. Factor is built for people that like to save time, not debug.",
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200">
  <path fill="#241553" d="M0 200V0h200v200H0z"/>
  <path fill="#8D91FF" d="M146.5 143.3H53.7a8.2 8.2 0 01-8.1-8.2v-17.3l36.8-34.5 35.5 24.6 36.8-41.5V133c0 4.6-3.6 10.2-8.2 10.2z"/>
  <path fill="#ACDAFF" d="M117.9 112L82.4 87.3l-36.8 34.5V64.2c0-4.5 3.6-8.2 8.1-8.2h92.8c4.6 0 8.2 3.7 8.2 8.2v6.3L118 111.9z"/>
  <path fill="#241553" d="M43.4 118.8a3 3 0 004.2 4.4l-4.2-4.4zM82.1 86l1.8-2.5-2-1.4-1.9 1.7 2.1 2.2zm35.4 25.5l-1.8 2.4 2.2 1.6 1.8-2-2.2-2zm39.2-39a3 3 0 10-4.4-4l4.4 4zM47.6 123.2l36.6-35-4.2-4.4-36.6 35 4.2 4.4zm32.8-34.8l35.3 25.5 3.6-4.8-35.4-25.6-3.5 5zm39.3 25.1l37-41-4.4-4-37 41 4.4 4z"/>
</svg>`,
    title: "Search optimized",
    text: "Build universal apps with VueJS. Get better SEO results with server-rendered apps.",
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200">
  <path fill="#FF5B66" d="M0 200V0h200v200H0z"/>
  <path fill="#FFFAF2" d="M100 48c-12 0-23.7 4-33.3 11.3a55.8 55.8 0 00-17.8 65 55.6 55.6 0 0022.6 27.2l.4-.2 17.5-29.6a21 21 0 01-9-23.6 21 21 0 017.4-11 20.5 20.5 0 0132.3 11.3 21.3 21.3 0 01-9.4 23.5l17.4 29.4.4.2A55.6 55.6 0 00153 88.8a55.8 55.8 0 00-19.7-29.5A54.4 54.4 0 00100 48z"/>
</svg>`,
    title: "Free and open-source",
    text: "Factor is built on open-source and uses the same license as projects like WordPress and Linux.",
  },
])
</script>
