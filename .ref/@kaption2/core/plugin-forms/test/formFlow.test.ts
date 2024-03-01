/**
 * @vitest-environment jsdom
 * https://vitest.dev/config/#environment
 */
import { beforeAll, describe, expect, it } from 'vitest'
import { Form } from '../form'
import { getLogicResult } from '../logic'

describe('forms flow', () => {
  beforeAll(async () => {
    // const utils = await createKaptionTestUtils()
    // testUtils = utils as CurrentTestUtils
    // testUtils.initialized = await testUtils.init()
  })

  it('handles logic', () => {
    let r: string | undefined

    r = getLogicResult({
      logic: [
        { operator: '==', value: 'test', skipTo: 'testCard' },
        { operator: '==', value: 'test2', skipTo: 'another' },
      ],
      value: 'test',
    })

    expect(r).toBe('testCard')

    r = getLogicResult({
      logic: [{ operator: '!=', value: 'test', skipTo: 'testCard' }],
      value: 'test',
    })

    expect(r).toBe(undefined)

    r = getLogicResult({
      logic: [{ operator: '==', value: 'test', skipTo: 'result1' }],
      value: ['test'],
    })

    expect(r).toBe('result1')

    r = getLogicResult({
      logic: [{ operator: '!=', value: 'test', skipTo: 'result2' }],
      value: ['test'],
    })

    expect(r).toBe(undefined)

    r = getLogicResult({
      logic: [{ operator: '<>', value: 'test2', skipTo: 'result2' }],
      value: ['test1', 'test2'],
    })

    expect(r).toBe('result2')

    r = getLogicResult({
      logic: [{ operator: '><', value: 'test2', skipTo: 'result2' }],
      value: ['test1', 'test2'],
    })

    expect(r).toBe(undefined)

    r = getLogicResult({
      logic: [{ operator: '<>', value: 'hello', skipTo: 'yes' }],
      value: 'hello world',
    })

    expect(r).toBe('yes')

    r = getLogicResult({
      logic: [{ operator: '><', value: 'hello', skipTo: 'yes' }],
      value: 'hello world',
    })

    expect(r).toBe(undefined)
  })

  it('gets views', async () => {
    const theForm = new Form({
      userConfig: {
        formName: 'Kaption Form',
        cards: [
          {
            cardKey: 'welcome',
            userConfig: {
              cardTypeKey: 'welcomeCard',
            },
          },
          {
            cardId: 'firstGroup',
            userConfig: {
              cardTypeKey: 'group',
              cards: [
                {
                  cardKey: 'first',
                  userConfig: {
                    cardTypeKey: 'multipleChoice',
                    choices: ['X', 'Y', 'Z'].join(`\n`),
                    logic: [
                      { operator: '==', value: 'Y', skipTo: 'third' },
                      { operator: '==', value: 'Z', skipTo: 'end' },
                    ],
                  },
                  cardValue: ['Y'],
                },
              ],
            },
          },
          {
            userConfig: {
              cardTypeKey: 'group',
              cards: [
                {
                  cardKey: 'second',
                  userConfig: {
                    cardTypeKey: 'multipleChoice',
                    choices: ['X', 'Y', 'Z'].join(`\n`),
                  },
                },
              ],
            },
          },
          {
            userConfig: {
              cardTypeKey: 'group',
              cards: [
                {
                  cardKey: 'third',
                  userConfig: {
                    cardTypeKey: 'multipleChoice',
                    choices: ['X', 'Y', 'Z'].join(`\n`),
                  },
                },
              ],
            },
          },
          {
            userConfig: {
              cardTypeKey: 'group',
              cards: [
                {
                  cardKey: 'fourth',
                  userConfig: {
                    cardTypeKey: 'multipleChoice',
                    choices: ['X', 'Y', 'Z'].join(`\n`),
                    noFlow: true,
                  },
                },
              ],
            },
          },
        ],
      },
    })

    expect(theForm.cardsList.value.map(f => f.cardKey.value))
      .toMatchInlineSnapshot(`
        [
          "welcome",
          "group (1.2)",
          "first",
          "group (1.3)",
          "second",
          "group (1.4)",
          "third",
          "group (1.5)",
          "fourth",
        ]
      `)

    expect(
      theForm.cardsList.value.map(f => f.cardKey.value).length,
    ).toMatchInlineSnapshot('9')

    expect(theForm.nextList.value.map(f => f.cardKey.value))
      .toMatchInlineSnapshot(`
        [
          "group (1.2)",
          "first",
          "group (1.3)",
          "second",
          "group (1.4)",
          "third",
          "group (1.5)",
          "fourth",
          "End Card",
        ]
      `)

    expect(theForm.flowList.value.map(f => f.cardKey.value))
      .toMatchInlineSnapshot(`
        [
          "first",
          "third",
          "End Card",
        ]
      `)

    theForm.updateCard({ selector: 'first', cardValue: ['Z'] })

    expect(theForm.flowList.value.map(f => f.cardName.value))
      .toMatchInlineSnapshot(`
        [
          "first",
          "fourth",
          "End Card",
        ]
      `)

    expect(theForm.inputsList.value.map(f => f.cardName.value))
      .toMatchInlineSnapshot(`
        [
          "first",
          "second",
          "third",
          "fourth",
        ]
      `)
  })
})
