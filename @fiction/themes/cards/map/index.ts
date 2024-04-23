import { vue } from '@fiction/core'
import { CardTemplate, createCard } from '@fiction/site'
import { z } from 'zod'
import { InputOption } from '@fiction/ui'
import { standardOption } from '../inputSets'

// Define schema for the markers within the maps array
const markerSchema = z.object({
  lat: z.number(),
  lng: z.number(),
})
const mapStyles = ['satellite', 'streets', 'outdoors', 'light', 'dark', 'satellite', 'satellite-streets'] as const

// Define the schema for maps as used in UserConfig
export const mapSchema = z.object({
  lat: z.number().optional(),
  lng: z.number().optional(),
  zoom: z.number().optional(),
  pitch: z.number().optional(),
  markers: z.array(markerSchema).optional(),
  mapStyle: z.enum(mapStyles).optional(),
})

export type MapSchemaConfig = z.infer<typeof mapSchema>

const UserConfigSchema = z.object({
  maps: z.array(mapSchema).optional(),
})

export type UserConfig = z.infer<typeof UserConfigSchema>

const mapBase = {
  lat: 33.652199,
  lng: -117.747719,
  zoom: 13,
  markers: [{ lat: 33.652199, lng: -117.747719 }],
  mapStyle: 'streets' as const,
}

const templateId = 'map'
export const templates = [
  new CardTemplate({
    templateId,
    category: ['other'],
    description: 'map with markers, powered by Mapbox',
    icon: 'i-tabler-map',
    iconTheme: 'amber',
    isPublic: true,
    el: vue.defineAsyncComponent(() => import('./ElCard.vue')),
    options: [

      standardOption.inputList({ label: 'Maps', key: 'maps', options: [
        new InputOption({ key: 'lat', label: 'Latitude', input: 'InputNumber', schema: ({ z }) => z.number() }),
        new InputOption({ key: 'lng', label: 'Longitude', input: 'InputNumber', schema: ({ z }) => z.number() }),
        new InputOption({ key: 'zoom', label: 'Zoom', input: 'InputRange', schema: ({ z }) => z.number(), props: { min: 1, max: 20 } }),
        new InputOption({ key: 'pitch', label: 'Pitch', input: 'InputRange', schema: ({ z }) => z.number(), props: { min: 0, max: 100 } }),
        new InputOption({ key: 'mapStyle', label: 'Map Style', input: 'InputSelect', schema: ({ z }) => z.enum(mapStyles), props: { list: mapStyles } }),
        standardOption.inputList({ label: 'Markers', key: 'markers', options: [
          new InputOption({ key: 'lat', label: 'Latitude', input: 'InputNumber', schema: ({ z }) => z.number() }),
          new InputOption({ key: 'lng', label: 'Longitude', input: 'InputNumber', schema: ({ z }) => z.number() }),
        ] }),
      ] }),
    ],
    userConfig: { spacing: { spacingClass: 'py-8' }, maps: [mapBase] },
    schema: UserConfigSchema,
  }),
] as const

// export function demo() {
//   return createCard({
//     slug: 'card-map',
//     cards: [
//       createCard({ templateId, templates, userConfig: { } }),
//       createCard({ templateId, templates, userConfig: { layout: 'left' } }),
//     ],
//   })
// }
