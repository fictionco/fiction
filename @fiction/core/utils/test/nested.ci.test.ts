import { describe, expect, it } from 'vitest'
import { getNested, setNested } from '../obj'
import { vue } from '../libraries'

describe('utils:nested', () => {
  it('nestedPropertyUtil', async () => {
    const data = {
      a: {
        b: {
          c: 'hello',
        },
      },
    }

    const result = setNested<typeof data>({ data, path: 'a.b.c', value: 'world' })

    expect(result).toMatchInlineSnapshot(`
      {
        "a": {
          "b": {
            "c": "world",
          },
        },
      }
    `)

    expect(result.a.b.c).toBe('world')

    const result2 = getNested({
      data,
      path: 'a.b.c',
    })

    expect(result2).toMatchInlineSnapshot(`"hello"`)
    expect(result2).toBe('hello')

    const data2 = vue.ref({})

    const result3 = getNested({
      data: data2.value,
      path: 'a.b.c',
    })

    expect(result3).toMatchInlineSnapshot(`undefined`)
    expect(result3).toBe(undefined)
  })

  it('nestedPropertyUtil:array', async () => {
    const data = {
      a: {
        b: [
          { c: 'hello' },
          { c: 'hello' },
        ],
      },
    }

    const result = setNested<typeof data>({ data, path: 'a.b.1.c', value: 'world' })

    expect(result.a.b[1].c).toBe('world')

    expect(result).toMatchInlineSnapshot(`
      {
        "a": {
          "b": [
            {
              "c": "hello",
            },
            {
              "c": "world",
            },
          ],
        },
      }
    `)

    const r2 = getNested({ data: result, path: 'a.b.1.c' })

    expect(r2).toBe('world')
  })
})
