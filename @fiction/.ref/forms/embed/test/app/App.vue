<script setup lang="ts">
import { vue } from '@fiction/core'

const count = vue.ref(0)
</script>

<template>
  <div class="text-theme-700 mx-auto my-24 max-w-lg px-4 text-left font-sans">
    <h1 class="text-2xl font-semibold">
      Test Site
    </h1>

    <div class="card text-theme-500 my-2 cursor-pointer text-xs uppercase">
      <div @click="count++">
        count is {{ count }}
      </div>
    </div>

    <div class="max-w-lg space-y-4">
      <div class="my-8">
        <button
          type="button"
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          data-kaption-embed="http://localhost:12321/633ad52cd8bbb81b5efda7cf?ui=slideover&promptEvent=click&promptDisplay=inline"
        >
          Launch Me
        </button>
      </div>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec aliquet
        urna turpis, nec sodales lorem lobortis at.
      </p>
      <p>
        Ut iaculis mi tellus, id porttitor sapien interdum eu. In et iaculis
        urna, tristique consequat purus. Nulla gravida tortor non viverra
        rutrum. Donec tincidunt porttitor fringilla.
      </p>
      <p>
        Orci varius natoque penatibus et magnis dis parturient montes, nascetur
        ridiculus mus.
      </p>
      <p>
        Nam id ante augue. Suspendisse faucibus sodales purus ut gravida. Sed
        pulvinar dui id augue imperdiet, vitae euismod velit faucibus. Ut cursus
        ultrices massa lacinia vulputate.
      </p>
      <p>
        In nec augue hendrerit, pellentesque ligula eget, blandit risus. Nulla
        facilisi. Donec euismod magna nisl, eget consectetur sapien pellentesque
        aliquet.
      </p>

      <p>
        Suspendisse sed pulvinar orci, id sollicitudin eros. Nulla vulputate sem
        ut diam molestie, a pharetra enim pharetra. Orci varius natoque
        penatibus et magnis dis parturient montes, nascetur ridiculus mus. In
        laoreet tempus venenatis. Morbi mollis turpis a mauris sagittis
        ultrices. Donec in mauris ultrices, ultrices mi et, blandit tellus.
        Pellentesque vestibulum sollicitudin gravida.
      </p>
    </div>
  </div>
</template>
