import type { StandardUserConfig } from '@fiction/site/schema'
import { createOption } from '@fiction/ui'
import { z } from 'zod/v4'

// Define schema for map styling
const mapStyles = [
  'satellite',
  'streets',
  'outdoors',
  'light',
  'dark',
  'satellite',
  'satellite-streets',
  'mode',
  'navigation-night',
  'navigation-day',
] as const

// Define aspect ratio options
const aspectRatios = [
  'square',
  'video',
  'landscape',
  'portrait',
  'ultrawide',
  'custom',
] as const

// Schema for a single marker
const MarkerSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  label: z.string().optional(),
})

// Schema for a single map configuration
const mapSchema = z.object({
  lat: z.number().optional(),
  lng: z.number().optional(),
  zoom: z.number().optional(),
  pitch: z.number().optional(),
  mapStyle: z.enum(mapStyles).optional(),
  markers: z.array(MarkerSchema).optional(),
  aspectRatio: z.enum(aspectRatios).optional(),
  customRatio: z.string().optional(),
})

// Main user config schema
export const schema = z.object({
  maps: z.array(mapSchema).optional(),
})

export type MapUserConfig = z.infer<typeof mapSchema>
type MarkerConfig = z.infer<typeof MarkerSchema>
export type UserConfig = z.infer<typeof schema> & StandardUserConfig

export const defaultMap = {
  lat: 33.652199,
  lng: -117.747719,
  zoom: 13,
  pitch: 0,
  mapStyle: 'mode' as const,
  markers: [{ lat: 33.652199, lng: -117.747719, label: 'Headquarters' }],
  aspectRatio: 'landscape' as const,
}

export function getOptions() {
  return [
    createOption({
      schema,
      input: 'group',
      label: 'Content',
      icon: { class: 'i-tabler-map' },
      key: 'group.maps',
      options: [
        createOption({
          schema,
          input: 'InputList',
          label: 'Maps',
          key: 'maps',
          props: {
            itemName: 'Map',
            itemLabel: args => `Map ${(args?.item as MapUserConfig)?.mapStyle || (args.index ? args.index + 1 : '')}`,
          },
          options: [
            createOption({
              input: 'group',
              key: 'locationGroup',
              label: 'Location',
              icon: { class: 'i-tabler-map-pin' },
              options: [
                createOption({
                  schema,
                  key: 'maps.0.lat',
                  label: 'Latitude',
                  input: 'InputNumber',
                  props: {
                    step: 0.000001,
                    precision: 6,
                  },
                }),
                createOption({
                  schema,
                  key: 'maps.0.lng',
                  label: 'Longitude',
                  input: 'InputNumber',
                  props: {
                    step: 0.000001,
                    precision: 6,
                  },
                }),
              ],
            }),

            createOption({
              input: 'group',
              key: 'settingsGroup',
              label: 'Settings',
              icon: { class: 'i-tabler-settings' },
              options: [
                createOption({
                  schema,
                  key: 'maps.0.zoom',
                  label: 'Zoom Level',
                  input: 'InputRange',
                  props: { min: 1, max: 20 },
                }),
                createOption({
                  schema,
                  key: 'maps.0.pitch',
                  label: 'Tilt Angle',
                  input: 'InputRange',
                  props: { min: 0, max: 85 },
                }),
                createOption({
                  schema,
                  key: 'maps.0.mapStyle',
                  label: 'Map Style',
                  input: 'InputSelect',
                  list: mapStyles.map(style => ({
                    label: style.charAt(0).toUpperCase() + style.slice(1).replace(/-/g, ' '),
                    value: style,
                  })),
                }),
                createOption({
                  schema,
                  key: 'maps.0.aspectRatio',
                  label: 'Aspect Ratio',
                  input: 'InputSelect',
                  list: aspectRatios.map(ratio => ({
                    label: ratio.charAt(0).toUpperCase() + ratio.slice(1),
                    value: ratio,
                  })),
                }),
                createOption({
                  schema,
                  key: 'maps.0.customRatio',
                  label: 'Custom Aspect Ratio',
                  input: 'InputText',
                  props: { placeholder: '16:9' },
                }),
              ],
            }),

            createOption({
              input: 'group',
              key: 'markersGroup',
              label: 'Markers',
              icon: { class: 'i-tabler-map-pin' },
              options: [
                createOption({
                  schema,
                  input: 'InputList',
                  label: 'Markers',
                  key: 'maps.0.markers',
                  props: {
                    itemName: 'Location Pin',
                    itemLabel: args => (args?.item as MarkerConfig)?.label ?? 'Location Pin',
                  },
                  options: [
                    createOption({
                      schema,
                      key: 'maps.0.markers.0.lat',
                      label: 'Latitude',
                      input: 'InputNumber',
                      props: {
                        step: 0.000001,
                        precision: 6,
                      },
                    }),
                    createOption({
                      schema,
                      key: 'maps.0.markers.0.lng',
                      label: 'Longitude',
                      input: 'InputNumber',
                      props: {
                        step: 0.000001,
                        precision: 6,
                      },
                    }),
                    createOption({
                      schema,
                      key: 'maps.0.markers.0.label',
                      label: 'Tooltip Label',
                      input: 'InputText',
                      props: {
                        placeholder: 'Location description',
                      },
                    }),
                  ],
                }),
              ],
            }),

          ],
        }),
      ],
    }),

  ]
}

export function getDefaultConfig(): UserConfig {
  return {
    maps: [defaultMap],
  }
}

export function getDemoConfigs(templateId: string): Record<string, { templateId: string, userConfig: UserConfig }> {
  return {
    default: {
      templateId,
      userConfig: getDefaultConfig(),
    },
    multiLocation: {
      templateId,
      userConfig: {
        maps: [{
          ...defaultMap,
          lat: 34.0522,
          lng: -118.2437,
          zoom: 12,
          mapStyle: 'navigation-night',
          aspectRatio: 'ultrawide',
          markers: [
            { lat: 34.0522, lng: -118.2437, label: 'LA Headquarters' },
            { lat: 34.0407, lng: -118.2468, label: 'Downtown Office' },
          ],
        }],
      },
    },
    satelliteView: {
      templateId,
      userConfig: {
        maps: [{
          ...defaultMap,
          mapStyle: 'satellite',
          zoom: 15,
          pitch: 60,
          aspectRatio: 'square',
        }],
      },
    },
    gridLayout: {
      templateId,
      userConfig: {
        maps: [
          { ...defaultMap, mapStyle: 'light', aspectRatio: 'landscape' },
          { ...defaultMap, mapStyle: 'dark', aspectRatio: 'landscape' },
          { ...defaultMap, mapStyle: 'satellite', aspectRatio: 'landscape' },
          { ...defaultMap, mapStyle: 'streets', aspectRatio: 'landscape' },
        ],
      },
    },
  }
}

export async function getConfig(args: { templateId: string }) {
  const { templateId } = args
  return {
    schema,
    options: getOptions(),
    userConfig: getDefaultConfig(),
    demoPage: {
      cards: Object.values(getDemoConfigs(templateId)),
    },
  }
}
