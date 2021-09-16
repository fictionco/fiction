<template>
  <div>
    <div class="w-full max-w-screen-xl mx-auto">
      <div class="lg:flex py-12">
        <div
          id="content-wrapper"
          class="
            min-w-0
            w-full
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
