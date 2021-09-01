<template>
  <div class="py-6 px-4 sm:px-6 md:flex md:flex-col md:pl-0 md:pr-10 lg:pr-16">
    <blockquote class="mt-6 md:flex-grow md:flex md:flex-col">
      <div class="relative text-lg xl:text-2xl md:flex-grow">
        <svg
          class="
            absolute
            top-0
            left-0
            transform
            -translate-x-3 -translate-y-2
            h-8
            w-8
            text-bluegray-100
          "
          fill="currentColor"
          viewBox="0 0 32 32"
          aria-hidden="true"
        >
          <path
            d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"
          />
        </svg>
        <p class="relative font-bold">
          {{ quote.text }}
        </p>
      </div>
      <footer class="mt-8">
        <div class="flex items-start">
          <div
            class="flex-shrink-0 inline-flex rounded-full border-2 border-white"
          >
            <img
              class="h-12 w-12 rounded-full"
              :src="quote.image"
              :alt="`${quote.author} avatar`"
            />
          </div>
          <div class="ml-4">
            <div class="text-lg text-bluegray-800">
              {{ quote.author }}
            </div>
            <div class="text-base text-bluegray-400">{{ quote.context }}</div>
          </div>
        </div>
      </footer>
    </blockquote>
  </div>
</template>
<script lang="ts">
import { watch, ref } from "vue"
interface Quote {
  text: string
  author: string
  image: string
  context: string
}
import { stored, storeItem } from "@factor/api"
import { useRouter } from "vue-router"
import deming from "./img/edwards-deming.webp"
import napoleon from "./img/napoleon.webp"
import sondergaard from "./img/sondergaard.webp"
import fiorina from "./img/carly-fiorina.jpg"
import trifiro from "./img/trifiro.webp"
export default {
  setup() {
    const router = useRouter()
    const getRandomDifferent = (arr: Quote[], _last?: Quote): Quote => {
      return arr[Math.floor(Math.random() * arr.length)]
    }
    const quotes = [
      {
        text: "Without data you’re just a person with an opinion.",
        author: "Edwards Deming",
        context: "Professor, Columbia University",
        image: deming,
      },
      {
        text: "War is ninety percent information.",
        author: "Napoleon",
        context: "Leader",
        image: napoleon,
      },
      {
        text: "Information is the oil of the 21st century, and analytics is the combustion engine.",
        author: "Peter Sondergaard",
        context: "Head of Research, Gartner",
        image: sondergaard,
      },
      {
        text: "Data reveals impact, and with data, you can bring more science to your decisions.",
        author: "Matt Trifiro",
        context: "CEO, VaporIO",
        image: trifiro,
      },
      {
        text: "The goal is to turn data into information, and information into insight.",
        author: "Carly Fiorina",
        context: "CEO, HP",
        image: fiorina,
      },
    ]

    const getQuote = (): Quote => {
      const q = getRandomDifferent(quotes, stored("lastQuote"))
      storeItem("lastQuote", q)
      return q
    }
    const quote = ref(getQuote())

    watch(
      () => router.currentRoute.value.path,
      (v, old) => {
        if (v && v != old) quote.value = getQuote()
      },
    )

    return { quote }
  },
}
</script>
