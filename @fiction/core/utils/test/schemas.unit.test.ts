import { describe, expect, it } from 'vitest'
import { z } from 'zod/v4'
import { processSchemas, SchemaUtility } from '../schema2'

describe('schemaUtility - type safe', () => {
  const schemaUtil = new SchemaUtility()

  describe('type safety validation', () => {
    it('should provide correct types for parsed results', () => {
      const cardSchemas = [
        {
          id: 'testCard',
          schema: z.object({
            title: z.string().meta({ ai: true }),
            count: z.number().meta({ ai: false }),
            optional: z.string().optional().meta({ ai: true }),
          }),
        },
        {
          id: 'secondCard',
          schema: z.object({
            name: z.string().meta({ ai: true }),
            active: z.boolean(),
          }),
        },
      ] as const // Important: use 'as const' for proper type inference

      const { combinedSchema } = schemaUtil.processSchemas(cardSchemas)

      const testData = {
        testCard: {
          title: 'Test Title',
          count: 42,
          optional: 'Optional Value',
        },
        secondCard: {
          name: 'Second Card',
          active: true,
        },
      }

      const result = combinedSchema.parse(testData)

      // TypeScript now knows the exact structure
      expect(result.testCard.title).toBe('Test Title')
      expect(result.testCard.count).toBe(42)
      expect(result.testCard.optional).toBe('Optional Value')
      expect(result.secondCard.name).toBe('Second Card')
      expect(result.secondCard.active).toBe(true)
    })

    it('should handle missing optional fields with correct types', () => {
      const cardSchemas = [
        {
          id: 'cardWithOptional',
          schema: z.object({
            required: z.string().meta({ ai: true }),
            optional: z.string().optional().meta({ ai: true }),
            defaulted: z.string().default('default').meta({ ai: false }),
          }),
        },
      ] as const

      const { combinedSchema } = schemaUtil.processSchemas(cardSchemas)

      const testData = {
        cardWithOptional: {
          required: 'Required Value',
        },
      }

      const result = combinedSchema.parse(testData)

      // TypeScript knows these properties exist
      expect(result.cardWithOptional.required).toBe('Required Value')
      expect(result.cardWithOptional.defaulted).toBe('default')
      expect(result.cardWithOptional.optional).toBeUndefined()
    })

    it('should work with the standalone function', () => {
      const cardSchemas = [
        {
          id: 'functionTest',
          schema: z.object({
            value: z.string().meta({ ai: true }),
          }),
        },
      ] as const

      const { combinedSchema } = processSchemas(cardSchemas)

      const testData = {
        functionTest: {
          value: 'test value',
        },
      }

      const result = combinedSchema.parse(testData)
      expect(result.functionTest.value).toBe('test value')
    })
  })

  describe('complex type scenarios', () => {
    it('should handle nested objects with proper typing', () => {
      const cardSchemas = [
        {
          id: 'nestedCard',
          schema: z.object({
            header: z.object({
              title: z.string().meta({ ai: true }),
              subtitle: z.string().optional().meta({ ai: false }),
            }),
            content: z.object({
              body: z.string().meta({ ai: true }),
              metadata: z.object({
                author: z.string(),
                date: z.string(),
              }),
            }),
          }),
        },
      ] as const

      const { combinedSchema } = schemaUtil.processSchemas(cardSchemas)

      const testData = {
        nestedCard: {
          header: {
            title: 'Main Title',
            subtitle: 'Sub Title',
          },
          content: {
            body: 'Content body',
            metadata: {
              author: 'John Doe',
              date: '2024-01-01',
            },
          },
        },
      }

      const result = combinedSchema.parse(testData)

      // Deep type safety
      expect(result.nestedCard.header.title).toBe('Main Title')
      expect(result.nestedCard.content.body).toBe('Content body')
      expect(result.nestedCard.content.metadata.author).toBe('John Doe')
    })

    it('should handle arrays with proper typing', () => {
      const cardSchemas = [
        {
          id: 'arrayCard',
          schema: z.object({
            items: z.array(
              z.object({
                name: z.string().meta({ ai: true }),
                value: z.number(),
                tags: z.array(z.string()).meta({ ai: true }),
              }),
            ).meta({ ai: true }),
          }),
        },
      ] as const

      const { combinedSchema } = schemaUtil.processSchemas(cardSchemas)

      const testData = {
        arrayCard: {
          items: [
            {
              name: 'Item 1',
              value: 10,
              tags: ['tag1', 'tag2'],
            },
            {
              name: 'Item 2',
              value: 20,
              tags: ['tag3'],
            },
          ],
        },
      }

      const result = combinedSchema.parse(testData)

      // Array type safety
      expect(result.arrayCard.items).toHaveLength(2)
      expect(result.arrayCard.items[0].name).toBe('Item 1')
      expect(result.arrayCard.items[0].tags).toEqual(['tag1', 'tag2'])
      expect(result.arrayCard.items[1].value).toBe(20)
    })

    it('should maintain AI path extraction with full typing', () => {
      const cardSchemas = [
        {
          id: 'aiCard',
          schema: z.object({
            aiField: z.string().meta({ ai: true }),
            normalField: z.string(),
            nestedAI: z.object({
              title: z.string().meta({ ai: true }),
              description: z.string().meta({ ai: false }),
            }).meta({ ai: true }),
          }),
        },
      ] as const

      const { aiDotPaths } = schemaUtil.processSchemas(cardSchemas)

      expect(Object.keys(aiDotPaths)).toEqual([
        'aiCard.aiField',
        'aiCard.nestedAI',
        'aiCard.nestedAI.title',
      ])
    })
  })

  describe('type inference edge cases', () => {
    it('should handle empty schema array', () => {
      const cardSchemas = [] as const

      const { combinedSchema, aiDotPaths } = schemaUtil.processSchemas(cardSchemas)

      expect(Object.keys(combinedSchema.shape)).toHaveLength(0)
      expect(Object.keys(aiDotPaths)).toHaveLength(0)

      // Should parse empty object
      const result = combinedSchema.parse({})
      expect(result).toEqual({})
    })

    it('should handle single schema with proper typing', () => {
      const cardSchemas = [
        {
          id: 'singleCard',
          schema: z.object({
            uniqueField: z.string().meta({ ai: true }),
          }),
        },
      ] as const

      const { combinedSchema } = schemaUtil.processSchemas(cardSchemas)

      const testData = {
        singleCard: {
          uniqueField: 'unique value',
        },
      }

      const result = combinedSchema.parse(testData)
      expect(result.singleCard.uniqueField).toBe('unique value')
    })

    it('should preserve validation with typing', () => {
      const cardSchemas = [
        {
          id: 'validatedCard',
          schema: z.object({
            email: z.string().email().meta({ ai: true }),
            age: z.number().min(0).max(120),
            url: z.string().url().optional(),
          }),
        },
      ] as const

      const { combinedSchema } = schemaUtil.processSchemas(cardSchemas)

      const validData = {
        validatedCard: {
          email: 'test@example.com',
          age: 25,
          url: 'https://example.com',
        },
      }

      const result = combinedSchema.parse(validData)
      expect(result.validatedCard.email).toBe('test@example.com')
      expect(result.validatedCard.age).toBe(25)
      expect(result.validatedCard.url).toBe('https://example.com')

      // Invalid data should still throw
      const invalidData = {
        validatedCard: {
          email: 'invalid-email',
          age: 150,
        },
      }

      expect(() => combinedSchema.parse(invalidData)).toThrow()
    })
  })

  describe('dotpaths', () => {
    it('should combine multiple card schemas', () => {
      const cardSchemas = [
        {
          id: 'card1',
          schema: z.object({
            title: z.string().meta({ ai: true }),
            content: z.string().meta({ ai: true }),
          }),
        },
        {
          id: 'card2',
          schema: z.object({
            title: z.string().meta({ ai: true }),
            items: z.array(z.string()).meta({ ai: false }),
          }),
        },
      ]

      const { combinedSchema } = schemaUtil.processSchemas(cardSchemas)

      expect(Object.keys(combinedSchema.shape)).toEqual(['card1', 'card2'])
    })

    it('should extract paths to AI-generated fields', () => {
      const cardSchemas = [
        {
          id: 'card1',
          schema: z.object({
            title: z.string().meta({ ai: true }),
            content: z.string().meta({ ai: false }),
          }),
        },
      ]

      const { aiDotPaths } = schemaUtil.processSchemas(cardSchemas)

      expect(Object.keys(aiDotPaths)).toContain('card1.title')
      expect(Object.keys(aiDotPaths)).not.toContain('card1.content')
    })

    it('should correctly handle nested schemas', () => {
      const cardSchemas = [
        {
          id: 'nestedCard',
          schema: z.object({
            header: z.object({
              title: z.string().meta({ ai: true }),
              subtitle: z.string().meta({ ai: false }),
            }),
            body: z.object({
              content: z.string().meta({ ai: true }),
              tags: z.array(z.string().meta({ ai: false })),
            }),
          }),
        },
      ]

      const { aiDotPaths } = schemaUtil.processSchemas(cardSchemas)

      expect(Object.keys(aiDotPaths)).toContain('nestedCard.header.title')
      expect(Object.keys(aiDotPaths)).toContain('nestedCard.body.content')
      expect(Object.keys(aiDotPaths)).not.toContain('nestedCard.header.subtitle')
    })

    it('should respect [@ai-ignore] markers', () => {
      const cardSchemas = [
        {
          id: 'buttonCard',
          schema: z.object({
            buttons: z.array(
              z.object({
                label: z.string().meta({ ai: true }),
                href: z.string().meta({ ai: true }),
                target: z.string().meta({ ai: false }),
              }),
            ).meta({ ai: true }),
          }),
        },
      ]

      const { aiDotPaths } = schemaUtil.processSchemas(cardSchemas)

      expect(Object.keys(aiDotPaths)).toContain('buttonCard.buttons')
      expect(Object.keys(aiDotPaths)).toContain('buttonCard.buttons.0.label')
      expect(Object.keys(aiDotPaths)).toContain('buttonCard.buttons.0.href')
      expect(Object.keys(aiDotPaths)).not.toContain('buttonCard.buttons.0.target')
    })

    it('should handle arrays of objects', () => {
      const cardSchemas = [
        {
          id: 'listCard',
          schema: z.object({
            items: z.array(
              z.object({
                title: z.string().meta({ ai: true }),
                description: z.string().meta({ ai: true }),
              }),
            ).meta({ ai: true }),
          }),
        },
      ]

      const { aiDotPaths } = schemaUtil.processSchemas(cardSchemas)

      expect(Object.keys(aiDotPaths)).toContain('listCard.items')
      expect(Object.keys(aiDotPaths)).toContain('listCard.items.0.title')
      expect(Object.keys(aiDotPaths)).toContain('listCard.items.0.description')
    })

    it('should handle deeply nested array structures', () => {
      const cardSchemas = [
        {
          id: 'deeplyNestedCard',
          schema: z.object({
            sections: z.array(
              z.object({
                title: z.string().meta({ ai: true }),
                subsections: z.array(
                  z.object({
                    subtitle: z.string().meta({ ai: true }),
                    points: z.array(z.string().meta({ ai: true })),
                  }),
                ).meta({ ai: true }),
              }),
            ).meta({ ai: true }),
          }),
        },
      ]

      const { aiDotPaths } = schemaUtil.processSchemas(cardSchemas)

      expect(Object.keys(aiDotPaths)).toMatchInlineSnapshot(`
        [
          "deeplyNestedCard.sections",
          "deeplyNestedCard.sections.0.title",
          "deeplyNestedCard.sections.0.subsections",
          "deeplyNestedCard.sections.0.subsections.0.subtitle",
          "deeplyNestedCard.sections.0.subsections.0.points",
          "deeplyNestedCard.sections.0.subsections.0.points.0",
        ]
      `)
    })

    it('should handle mixed AI and non-AI fields in complex structures', () => {
      const cardSchemas = [
        {
          id: 'complexCard',
          schema: z.object({
            header: z.object({
              title: z.string().meta({ ai: true }),
              subtitle: z.string().meta({ ai: false }),
              emphasis: z.boolean().meta({ ai: false }),
            }),
            content: z.object({
              sections: z.array(
                z.object({
                  title: z.string().meta({ ai: true }),
                  body: z.string().meta({ ai: true }),
                  media: z.object({
                    url: z.string().meta({ ai: false }),
                    alt: z.string().meta({ ai: true }),
                    type: z.string().meta({ ai: false }),
                  }),
                }),
              ).meta({ ai: true }),
            }),
            footer: z.object({
              copyright: z.string().meta({ ai: false }),
              links: z.array(
                z.object({
                  text: z.string().meta({ ai: true }),
                  url: z.string().meta({ ai: false }),
                }),
              ),
            }),
          }),
        },
      ]

      const { aiDotPaths } = schemaUtil.processSchemas(cardSchemas)

      expect(Object.keys(aiDotPaths)).toContain('complexCard.header.title')
      expect(Object.keys(aiDotPaths)).toContain('complexCard.content.sections')
      expect(Object.keys(aiDotPaths)).toContain('complexCard.content.sections.0.title')
      expect(Object.keys(aiDotPaths)).toContain('complexCard.content.sections.0.body')
      expect(Object.keys(aiDotPaths)).toContain('complexCard.content.sections.0.media.alt')
      expect(Object.keys(aiDotPaths)).toContain('complexCard.footer.links.0.text')

      expect(Object.keys(aiDotPaths)).not.toContain('complexCard.header.subtitle')
      expect(Object.keys(aiDotPaths)).not.toContain('complexCard.header.emphasis')
      expect(Object.keys(aiDotPaths)).not.toContain('complexCard.footer.copyright')
      expect(Object.keys(aiDotPaths)).not.toContain('complexCard.content.sections.media.type')
    })
  })
})
