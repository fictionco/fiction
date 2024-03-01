<template>
  <!-- This example requires Tailwind CSS v2.0+ -->
  <div class="inset-x-0 py-2 sm:py-5">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="rounded-lg border border-slate-200 p-2 sm:p-3">
        <div class="flex flex-wrap items-center justify-between">
          <div class="flex w-0 flex-1 items-center">
            <span class="bg-primary-500 flex rounded-lg p-2 text-white">
              <!-- Heroicon name: outline/speakerphone -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            <p class="ml-3 truncate font-semibold">
              Looking for PageLines?
            </p>
          </div>
          <div
            class="order-3 mt-2 w-full shrink-0 sm:order-2 sm:mt-0 sm:w-auto"
          >
            <router-link
              to="/pagelines"
              class="bg-primary-500 hover:bg-primary-600 flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm"
            >
              Access PageLines Resources
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
