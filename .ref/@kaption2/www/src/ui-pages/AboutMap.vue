<script lang="ts" setup>
import mapboxgl from 'mapbox-gl'
import { onMounted } from 'vue'

const props = defineProps({
  container: { type: String, default: 'mapbox' },
  longitude: { type: Number, default: -117.778_471 },
  latitude: { type: Number, default: 33.535_439 },
  zoom: { type: Number, default: 10 },
})
onMounted(() => {
  mapboxgl.accessToken
    = 'pk.eyJ1IjoicmF5bG9wZXphbGVtYW4iLCJhIjoiY2trcHc3ODY4MGNycTJwcGE0MW5pcDNnMSJ9.gHtN2ew2g26gY7KSMzFBpw'

  const mapbox = new mapboxgl.Map({
    container: props.container,
    minZoom: 14,
    zoom: props.zoom,
    center: [props.longitude, props.latitude], // [-117.783652, 33.541252]
    style: {
      version: 8,
      sources: {
        satellite: {
          type: 'raster',
          url: 'mapbox://mapbox.satellite',
          tileSize: 256,
        },
      },
      layers: [
        {
          id: 'background',
          type: 'background',
          paint: {
            'background-color': 'rgb(4,7,14)',
          },
        },
        {
          id: 'satellite',
          type: 'raster',
          source: 'satellite',
        },
      ],
    },
  })

  // Disable zoom on scroll
  mapbox.scrollZoom.disable()

  // Disable zoom on double-click
  mapbox.doubleClickZoom.disable()

  // Location Marker
  new mapboxgl.Marker().setLngLat([-117.776_98, 33.535_96]).addTo(mapbox)
})
</script>

<template>
  <div class="mapper-wrap">
    <div class="mapper overflow-hidden">
      <div
        :id="container"
        class="h-screen w-full outline-none focus:outline-none focus:ring-0"
      />
    </div>
  </div>
</template>
