<script lang="ts" setup>
import 'mapbox-gl/dist/mapbox-gl.css'
import type { GeoJSONSource, LngLatLike } from 'mapbox-gl'
import mapboxgl from 'mapbox-gl'
import { vue } from '@factor/api'

export interface LocationData {
  latitude: number
  longitude: number
  city: string
  countryCode: string
  language: string
  timezone: string
}

const props = defineProps({
  container: { type: String, default: 'mapbox' },
  longitude: { type: Number, default: -117.778_471 },
  latitude: { type: Number, default: 33.535_439 },
  zoom: { type: Number, default: 16 },
  data: { type: Array as vue.PropType<LocationData[]>, default: () => [] },
})
vue.onMounted(() => {
  mapboxgl.accessToken
    = 'pk.eyJ1IjoiYXJwb3dlcnMiLCJhIjoiY2ppbTAwOHByMGRndzNwcGVrZjh6MTliYSJ9.6mzQ1mYxwSp_mjzpwVXnhA'

  const mapbox = new mapboxgl.Map({
    container: props.container,
    center: [props.longitude, props.latitude],
    style: 'mapbox://styles/arpowers/ckod14pyb2i2l17lsjyeqra4c',
    attributionControl: false,
    zoom: 0.5,
  })

  const mbData = vue.computed<GeoJSON.Feature[]>(() => {
    const d = props.data
      .filter(_ => _.latitude && _.longitude)
      .map((_) => {
        return {
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [_.longitude, _.latitude],
          },
          properties: {
            city: _.city,
            countryCode: _.countryCode,
            language: _.language,
            timezone: _.timezone,
          },
        }
      })

    return d
  })

  mapbox.on('load', () => {
    const data = {
      type: 'FeatureCollection' as const,
      features: [] as GeoJSON.Feature[],
    }
    mapbox.addSource('visitors', {
      type: 'geojson',
      data,

      cluster: true,
      clusterMaxZoom: 0, // Max zoom to cluster points on
      clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
    })

    vue.watch(
      () => mbData.value,
      () => {
        data.features = mbData.value
        const s = mapbox.getSource('visitors') as GeoJSONSource
        s.setData(data)
      },
      { immediate: true },
    )

    mapbox.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'visitors',
      filter: ['has', 'point_count'],
      paint: {
        // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)

        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#5233ff',
          150,
          '#3e26bf',
          600,
          '#28197d',
        ],
        'circle-radius': ['step', ['get', 'point_count'], 20, 150, 30, 600, 40],
      },
    })

    mapbox.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'visitors',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 14,
      },
      paint: { 'text-color': '#fff' },
    })

    mapbox.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'visitors',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': '#5233ff',
        'circle-radius': 4,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff',
      },
    })

    // inspect a cluster on click
    mapbox.on('click', 'clusters', (e) => {
      const features = mapbox.queryRenderedFeatures(e.point, {
        layers: ['clusters'],
      })
      const properties = features[0].properties
      const clusterId = properties?.cluster_id as number

      if (!clusterId)
        return

      const s = mapbox.getSource('visitors') as GeoJSONSource
      s.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err)
          return

        const point = features[0].geometry as GeoJSON.Point

        mapbox.easeTo({
          center: point.coordinates as LngLatLike,
          zoom,
        })
      })
    })

    // When a click event occurs on a feature in
    // the unclustered-point layer, open a popup at
    // the location of the feature, with
    // description HTML from its properties.
    mapbox.on('click', 'unclustered-point', (e) => {
      const f = e.features?.[0]

      if (!f)
        return

      const point = f.geometry as GeoJSON.Point
      const properties = f.properties
      const coordinates = [...point.coordinates]

      // Ensure that if the map is zoomed out such that
      // multiple copies of the feature are visible, the
      // popup appears over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180)
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360

      if (!properties)
        return

      const html = Object.entries(properties)
        .map(
          ([key, value]: [string, string]) =>
            `<strong>${key}</strong>: ${value}`,
        )
        .join('</br>')

      new mapboxgl.Popup()
        .setLngLat(coordinates as LngLatLike)
        .setHTML(`<div style='padding: 5px;'>${html}</div>`)
        .addTo(mapbox)
    })

    mapbox.on('mouseenter', 'unclustered-point', () => {
      mapbox.getCanvas().style.cursor = 'pointer'
    })

    mapbox.on('mouseleave', 'unclustered-point', () => {
      mapbox.getCanvas().style.cursor = ''
    })

    mapbox.on('mouseenter', 'clusters', () => {
      mapbox.getCanvas().style.cursor = 'pointer'
    })
    mapbox.on('mouseleave', 'clusters', () => {
      mapbox.getCanvas().style.cursor = ''
    })
  })
})
</script>

<template>
  <div class="mapper-wrap h-full w-full">
    <div class="mapper relative h-full overflow-hidden rounded-md">
      <div
        :id="container"
        class="h-full w-full outline-none focus:outline-none focus:ring-0"
      />
    </div>
  </div>
</template>

<style>
.mapboxgl-ctrl-logo {
  display: none !important;
}
.mapboxgl-popup-close-button {
  font-size: 22px;
  padding: 4px;
  opacity: 0.4;
}

.mapboxgl-popup-close-button:focus {
  outline: none !important;
}
</style>
