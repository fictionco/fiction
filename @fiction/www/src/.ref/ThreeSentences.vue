<script lang="ts" setup>
import ElInput from '@factor/ui/ElInput.vue'
</script>

<template>
  <div class="mx-auto my-24 max-w-md space-y-6">
    <h1 class="font-3xl font-extrabold">
      Three Sentence Policy
    </h1>
    <h2 class="font-bold">
      The Problem
    </h2>
    <div class="text-theme-500">
      Long messages in email (and similar) are hard to respond to and to read.
      Long messages are ultimitely hard to read, and poorly understood. They
      also result in continuous email overflow for those that recieve lots of
      email.
    </div>
    <h2 class="font-bold">
      The Solution
    </h2>
    <div class="text-theme-500 space-y-6">
      <p>
        In order to encourage effective communication, send emails and message
        like people want to receive it, concisely. Limit yourself to three
        sentences per response, or change medium to a more appropriate one.
      </p>

      <p>
        "Three Sentences" is a policy that all messages (DMs, emails) regardless
        of recipient or subject will be three sentences or less.
      </p>

      <p>It's that simple.</p>
    </div>

    <div class="text-xs">
      * To begin using this system, optionally copy this text and paste it into
      your e-mail signature:
    </div>
    <ElInput
      input="InputTextarea"
      input-class="font-mono"
      :value="`--------------------------------------------\nQ: Why is this email three sentences or less?\nA: https://www.fiction.com/three-sentences`"
      :rows="5"
    />

    <div class="mt-16 text-center">
      <a
        href="https://www.fiction.com"
        class="text-theme-200 hover:text-theme-800"
      >
        <svg
          class="inline-block h-8 w-8"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M34.5005 41H17.187C16.0637 41 15.0057 40.5523 14.211 39.7352L1.01935 26.2084C0.0221016 25.1882 -0.272797 23.6627 0.265224 22.3287C0.805496 20.9924 2.06388 20.1269 3.47534 20.1269H19.6407V3.55352C19.6407 2.11105 20.4827 0.820906 21.7838 0.266998C23.0647 -0.279986 24.591 0.0315868 25.5702 1.03554L38.7686 14.5671C39.5633 15.3864 40 16.4688 40 17.6182V35.364C39.9977 38.4728 37.5328 41 34.5005 41ZM17.9119 34.9024H34.0525V18.3544L25.5882 9.67651V26.2245H9.4476L17.9119 34.9024Z"
            fill="currentColor"
          />
        </svg>
      </a>
    </div>
  </div>
</template>
