import type { template as heroTemplate } from '@fiction/cards/content-hero'
import type { CardFactory } from '@fiction/site/cardFactory'
import { BlendModesSchema, colorThemeUser, UiOriginSchema } from '@fiction/core'
import { createOption } from '@fiction/ui'
import { z } from 'zod'

// Individual shape properties
const ShapeSchema = z.object({
  shape: z.enum([
    'circle',
    'square',
    'triangle',
    'hexagon',
    'diamond',
    'star',
  ]).optional().describe('Geometric shape to display'),

  style: z.object({
    color: z.string().optional().describe('Custom color (hex or rgb)'),
    theme: z.enum(colorThemeUser).optional().describe('Use theme color'),
    opacity: z.number().min(0).max(100).optional().describe('Shape transparency'),
    blendMode: BlendModesSchema.optional().describe('Blend mode with background'),
    scale: z.number().min(0.1).max(5).optional().describe('Size multiplier'),
  }).optional(),

  animation: z.object({
    rotate: z.number().min(-360).max(360).optional().describe('Rotation angle'),
    duration: z.number().min(0).max(10).optional().describe('Animation duration in seconds'),
    delay: z.number().min(0).max(10).optional().describe('Animation start delay'),
  }).optional(),

  position: z.object({
    origin: UiOriginSchema.optional().describe('Anchor point position'),
    offsetX: z.number().min(-100).max(100).optional().describe('Horizontal offset in %'),
    offsetY: z.number().min(-100).max(100).optional().describe('Vertical offset in %'),
    zIndex: z.number().min(-10).max(10).optional().describe('Stack order'),
  }).optional(),
}).describe('Individual shape configuration')

// Main schema for shape effect
export const schema = z.object({
  shapes: z.array(ShapeSchema).optional().describe('Array of shapes to display'),

}).describe('Shape effect configuration')

export type Shape = z.infer<typeof ShapeSchema>
export type UserConfig = z.infer<typeof schema>

const PRESETS: Record<string, UserConfig> = {
  // Basic shapes with rotation
  basicShapes: {
    shapes: [
      {
        shape: 'circle',
        style: {
          opacity: 15,
          scale: 2,
          color: '#3B82F6', // blue
          blendMode: 'multiply',
        },
        position: {
          origin: 'topRight',
          offsetX: -20,
          offsetY: 20,
        },
        animation: {
          rotate: 360,
          duration: 20,
        },
      },
      {
        shape: 'triangle',
        style: {
          opacity: 12,
          scale: 1.5,
          color: '#10B981', // green
          blendMode: 'multiply',
        },
        position: {
          origin: 'bottomLeft',
          offsetX: 20,
          offsetY: -20,
        },
        animation: {
          rotate: -360,
          duration: 25,
          delay: 2,
        },
      },
    ],
  },

  // Interactive shapes
  interactive: {
    shapes: [
      {
        shape: 'hexagon',
        style: {
          opacity: 20,
          scale: 1.8,
          color: '#6366F1', // indigo
          blendMode: 'multiply',
        },
        position: {
          origin: 'middleLeft',
          offsetX: 30,
        },
        animation: {
          rotate: 360,
          duration: 30,
        },
      },
      {
        shape: 'star',
        style: {
          opacity: 15,
          scale: 1.2,
          color: '#EC4899', // pink
          blendMode: 'multiply',
        },
        position: {
          origin: 'middleRight',
          offsetX: -30,
        },
        animation: {
          rotate: -360,
          duration: 35,
          delay: 3,
        },
      },
    ],
  },

  // Blending demonstration
  blendingShapes: {
    shapes: [
      {
        shape: 'circle',
        style: {
          opacity: 20,
          scale: 2.5,
          color: '#8B5CF6', // purple
          blendMode: 'overlay',
        },
        position: {
          origin: 'middleLeft',
          offsetX: 40,
        },
        animation: {
          rotate: 360,
          duration: 40,
        },
      },
      {
        shape: 'circle',
        style: {
          opacity: 20,
          scale: 2.5,
          color: '#F59E0B', // amber
          blendMode: 'multiply',
        },
        position: {
          origin: 'middleRight',
          offsetX: -40,
        },
        animation: {
          rotate: -360,
          duration: 45,
          delay: 4,
        },
      },
    ],
  },
}

function getOptions() {
  return [
    createOption({
      schema,
      key: 'shapes',
      label: 'Shape Elements',
      input: 'InputList',
      props: {
        itemLabel: 'Shape',
        sortable: true,
      },
      options: [
        createOption({
          schema,
          key: 'shapes.0.shape',
          label: 'Shape Type',
          input: 'InputSelect',
          props: {
            options: [
              { label: 'Circle', value: 'circle' },
              { label: 'Square', value: 'square' },
              { label: 'Triangle', value: 'triangle' },
              { label: 'Hexagon', value: 'hexagon' },
              { label: 'Diamond', value: 'diamond' },
              { label: 'Star', value: 'star' },
            ],
          },
        }),

        createOption({
          schema,
          key: 'shapes.0.style',
          label: 'Appearance',
          input: 'group',
          options: [
            createOption({
              schema,
              key: 'shapes.0.style.color',
              label: 'Color',
              input: 'InputColor',
            }),
            createOption({
              schema,
              key: 'shapes.0.style.theme',
              label: 'Use Theme Color',
              input: 'InputSelect',
              props: {
                options: [
                  { label: 'Primary', value: 'primary' },
                  { label: 'Theme', value: 'theme' },
                ],
              },
            }),
            createOption({
              schema,
              key: 'shapes.0.style.opacity',
              label: 'Opacity',
              input: 'InputRange',
              props: {
                min: 0,
                max: 100,
                step: 5,
              },
            }),
            createOption({
              schema,
              key: 'shapes.0.style.blendMode',
              label: 'Blend Mode',
              input: 'InputSelect',
              props: {
                options: [
                  { label: 'Normal', value: 'normal' },
                  { label: 'Multiply', value: 'multiply' },
                  { label: 'Screen', value: 'screen' },
                  { label: 'Overlay', value: 'overlay' },
                ],
              },
            }),
            createOption({
              schema,
              key: 'shapes.0.style.scale',
              label: 'Size Scale',
              input: 'InputRange',
              props: {
                min: 0.1,
                max: 5,
                step: 0.1,
              },
            }),
          ],
        }),

        createOption({
          schema,
          key: 'position',
          label: 'Position',
          input: 'group',
          options: [
            createOption({
              schema,
              key: 'shapes.0.position.origin',
              label: 'Anchor Point',
              input: 'InputSelect',
              props: {
                options: [
                  { label: 'Top Left', value: 'topLeft' },
                  { label: 'Top Center', value: 'topCenter' },
                  { label: 'Top Right', value: 'topRight' },
                  { label: 'Middle Left', value: 'middleLeft' },
                  { label: 'Middle Center', value: 'middleCenter' },
                  { label: 'Middle Right', value: 'middleRight' },
                  { label: 'Bottom Left', value: 'bottomLeft' },
                  { label: 'Bottom Center', value: 'bottomCenter' },
                  { label: 'Bottom Right', value: 'bottomRight' },
                ],
              },
            }),
            createOption({
              schema,
              key: 'shapes.0.position.offsetX',
              label: 'X Offset (%)',
              input: 'InputRange',
              props: {
                min: -100,
                max: 100,
                step: 5,
              },
            }),
            createOption({
              schema,
              key: 'shapes.0.position.offsetY',
              label: 'Y Offset (%)',
              input: 'InputRange',
              props: {
                min: -100,
                max: 100,
                step: 5,
              },
            }),
            createOption({
              schema,
              key: 'shapes.0.position.zIndex',
              label: 'Layer Order',
              input: 'InputRange',
              props: {
                min: -10,
                max: 10,
                step: 1,
              },
            }),
          ],
        }),

        createOption({
          schema,
          key: 'animation',
          label: 'Animation',
          input: 'group',
          options: [
            createOption({
              schema,
              key: 'shapes.0.animation.rotate',
              label: 'Rotation (deg)',
              input: 'InputRange',
              props: {
                min: -360,
                max: 360,
                step: 45,
              },
            }),
            createOption({
              schema,
              key: 'shapes.0.animation.duration',
              label: 'Duration (s)',
              input: 'InputRange',
              props: {
                min: 0,
                max: 45,
                step: 5,
              },
            }),
            createOption({
              schema,
              key: 'shapes.0.animation.delay',
              label: 'Delay (s)',
              input: 'InputRange',
              props: {
                min: 0,
                max: 10,
                step: 0.5,
              },
            }),
          ],
        }),
      ],
    }),

  ]
}

function getDefaultConfig(): UserConfig {
  return PRESETS.basicShapes
}

export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  const { templateId, factory } = args

  const demoPage = {
    cards: [
      // Basic shapes and positioning
      await factory.fromTemplate<typeof heroTemplate>({
        templateId: 'cardHeroV1',
        userConfig: {
          title: 'Basic Shapes & Rotation',
          subTitle: 'Basic example showing shape positioning and continuous rotation animations. Notice the gentle circular and triangular motion.',
          layout: 'center',
          action: {
            buttons: [
              { label: 'Configure Shapes', theme: 'primary' },
              { label: 'Watch Demo', theme: 'default' },
            ],
          },
        },
        effects: [
          { templateId, userConfig: PRESETS.basicShapes },
        ],
      }),

      // Interactive features
      await factory.fromTemplate<typeof heroTemplate>({
        templateId: 'cardHeroV1',
        userConfig: {
          title: 'Interactive Shapes',
          subTitle: 'Move your cursor around to see the shapes follow. Hover over the shapes to trigger scale effects. The shapes maintain continuous rotation while following movement.',
          layout: 'center',
          action: {
            buttons: [
              { label: 'Try Interaction', theme: 'primary' },
              { label: 'Learn More', theme: 'default' },
            ],
          },
        },
        effects: [
          { templateId, userConfig: PRESETS.interactive },
        ],
      }),

      // Blending demonstration
      await factory.fromTemplate<typeof heroTemplate>({
        templateId: 'cardHeroV1',
        userConfig: {
          title: 'Blend Modes & Opacity',
          subTitle: 'Demonstration of overlapping shapes with different blend modes. The circles use "overlay" and "multiply" blend modes with increased opacity for rich color mixing.',
          layout: 'center',
          action: {
            buttons: [
              { label: 'Explore Blending', theme: 'primary' },
              { label: 'View Guide', theme: 'default' },
            ],
          },
        },
        effects: [
          { templateId, userConfig: PRESETS.blendingShapes },
        ],
      }),
    ],
  }

  return {
    schema,
    options: getOptions(),
    userConfig: getDefaultConfig(),
    demoPage,
  }
}
