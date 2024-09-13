/**
 * @vitest-environment happy-dom
 */

import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import InputList from '../InputList.vue'

describe('yourComponent', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(InputList, {
      props: { modelValue: [{ name: 'Item 1', _key: 'key1' }], options: [], depth: 0 },
    })
  })

  afterAll(async () => {
    wrapper.unmount()
  })

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('adds a new item correctly', async () => {
    await wrapper.find('[data-test="add"]').trigger('click')
    await wrapper.find('[data-test="add"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.length).toBe(2)
  })

  it('handles empty modelValue correctly', () => {
    wrapper = mount(InputList, {
      props: { modelValue: [], options: [], depth: 0 },
    })
    expect(wrapper.findAll('[data-drag-id]').length).toBe(0)
  })
})
