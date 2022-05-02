<template>
  <div>
    <div class="mx-auto w-full max-w-screen-xl">
      <div class="py-12 lg:flex">
        <div
          id="content-wrapper"
          class="
            w-full
            min-w-0
            flex-auto
            lg:static lg:max-h-full lg:overflow-visible
          "
        >
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>
