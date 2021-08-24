<template>
  <!-- Hero card -->
  <div class="pt-20">
    <div class="relative py-20">
      <div class="absolute inset-x-0 bottom-0 h-1/2" />
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div
          class="
            relative
            shadow-xl
            sm:rounded-2xl sm:overflow-hidden
            py-16
            sm:py-24
          "
        >
          <div class="relative px-4 sm:px-6 lg:px-8">
            <h1
              class="
                text-center text-4xl
                font-extrabold
                tracking-tight
                sm:text-5xl
                lg:text-6xl
              "
            >
              <span class="block">PageLines </span>
              <span class="block text-primary-500"> Legacy Resources</span>
            </h1>
            <p class="mt-6 max-w-lg mx-auto text-center text-xl sm:max-w-xl">
              As of 2016, PageLines has been in legacy mode. We've redirected
              traffic to current websites. Feel free to contact us with any
              questions and access PageLines resources below.
            </p>
          </div>
          <div
            class="
              p-12
              grid grid-cols-1
              gap-x-6 gap-y-12
              sm:grid-cols-2
              lg:mt-16 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16
            "
          >
            <div>
              <div>
                <span
                  class="
                    flex
                    items-center
                    justify-center
                    h-12
                    w-12
                    rounded-md
                    bg-primary-500
                    text-white
                  "
                >
                  <!-- Heroicon name: outline/inbox -->
                  <svg
                    class="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </span>
              </div>
              <div class="mt-6">
                <h3 class="text-lg font-medium">
                  <a
                    href="https://www.pagelines.com/resources"
                    class="hover:text-primary-500"
                    >PageLines Documentation &rarr;</a
                  >
                </h3>
                <p class="mt-2 text-base text-bluegray-500">
                  Documentation and resources for using PageLines
                </p>
              </div>
            </div>

            <div>
              <div>
                <span
                  class="
                    flex
                    items-center
                    justify-center
                    h-12
                    w-12
                    rounded-md
                    bg-primary-500
                    text-white
                  "
                >
                  <!-- Heroicon name: outline/users -->
                  <svg
                    class="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </span>
              </div>
              <div class="mt-6">
                <h3 class="text-lg font-medium">
                  <a
                    href="https://www.pagelines.com/my-account"
                    class="hover:text-primary-500"
                    >PageLines Account &rarr;</a
                  >
                </h3>
                <p class="mt-2 text-base text-bluegray-500">
                  Access your account, downloads and other account resources.
                </p>
              </div>
            </div>

            <div>
              <div>
                <span
                  class="
                    flex
                    items-center
                    justify-center
                    h-12
                    w-12
                    rounded-md
                    bg-primary-500
                    text-white
                  "
                >
                  <!-- Heroicon name: outline/document-report -->
                  <svg
                    class="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </span>
              </div>
              <div class="mt-6">
                <h3 class="text-lg font-medium">
                  <a
                    href="https://www.pagelines.com/extensions"
                    class="hover:text-primary-500"
                    >PageLines Extensions &rarr;</a
                  >
                </h3>
                <p class="mt-2 text-base text-bluegray-500">
                  View the available extensions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {}
</script>
