import { describe, expect, it } from 'vitest'
import { vue } from '../libraries'
import { getNested, setNested } from '../obj'

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

describe('setNested with isMerge functionality', () => {
  it('merges objects at the specified path', async () => {
    const data = {
      a: {
        b: {
          x: 1,
          y: 2,
        },
      },
    }

    const newValue = {
      y: 3,
      z: 4,
    }

    const result = setNested<typeof data>({ data, path: 'a.b', value: newValue, isMerge: true })

    expect(result).toMatchInlineSnapshot(`
      {
        "a": {
          "b": {
            "x": 1,
            "y": 3,
            "z": 4,
          },
        },
      }
    `)

    expect(result.a.b).toEqual({ x: 1, y: 3, z: 4 })
  })

  it('replaces non-object existing value with object when isMerge is true', async () => {
    const data = {
      a: {
        b: 'initial',
      },
    }

    const newValue = { c: 3 }

    const result = setNested<typeof data>({ data, path: 'a.b', value: newValue, isMerge: true })

    expect(result.a.b).toEqual(newValue)
  })

  it('properly handles nested object merge', async () => {
    const data = {
      a: {
        b: {
          c: {
            d: 1,
            e: 2,
          },
        },
      },
    }

    const newValue = {
      d: 3, // This should overwrite the existing d
      f: 4, // This should be added
    }

    const result = setNested<typeof data>({ data, path: 'a.b.c', value: newValue, isMerge: true })

    expect(result.a.b.c).toEqual({ d: 3, e: 2, f: 4 })
  })

  it('does not merge when isMerge is false', async () => {
    const data = {
      a: {
        b: {
          x: 1,
        },
      },
    }

    const newValue = {
      y: 2,
    }

    const result = setNested<typeof data>({ data, path: 'a.b', value: newValue, isMerge: false })

    // newValue should replace the existing value at 'a.b' entirely
    expect(result.a.b).toEqual(newValue)
  })

  it('merges arrays', async () => {
    const data = {
      a: {
        b: [1, 2],
      },
    }

    const newValue = [3, 4]

    const result = setNested<typeof data>({ data, path: 'a.b', value: newValue, isMerge: true })

    // newValue should replace the existing array at 'a.b' entirely
    expect(result.a.b).toEqual([1, 2, 3, 4])
  })
})
