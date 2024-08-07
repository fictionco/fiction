/**
 * @vitest-environment happy-dom
 */

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Card } from '@fiction/site'
import { FictionObject } from '@fiction/core'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import type { FormSettings } from '../form'
import { Form } from '../form'
import { FictionForms } from '..'

describe('form', async () => {
  let formSettings: FormSettings
  let form: Form

  const testUtils = await createSiteTestUtils()

  const fictionForms = new FictionForms(testUtils)

  beforeEach(() => {
    formSettings = {
      fictionForms,
      formId: 'test-form',
      card: {
        cards: [
          { cardId: 'card1', userConfig: { cardType: 'input', path: 'name' } },
          { cardId: 'card2', userConfig: { cardType: 'input', path: 'email' } },
          { cardId: 'card3', userConfig: { cardType: 'end' } },
        ],
      },
    }
    form = new Form(formSettings)
  })

  it('should initialize with correct settings', () => {
    expect(form.settings).toEqual(formSettings)
    expect(form.formMode.value).toBe('standard')
    expect(form.slideTransition.value).toBe('next')
    expect(form.formValues.value).toEqual({})
  })

  it('should compute cards correctly', () => {
    expect(form.cards.value.length).toBe(3)
    expect(form.inputCards.value.length).toBe(2)
    expect(form.endCards.value.length).toBe(1)
  })

  it('should set active card correctly', () => {
    expect(form.activeCardId.value).toBe('card1')
    form.setActiveId({ cardId: 'card2', drawer: 'toggle' })
    expect(form.activeCardId.value).toBe('card2')
  })

  it('should navigate to next card', async () => {
    await form.nextCard()
    expect(form.activeCardId.value).toBe('card2')
    await form.nextCard()
    expect(form.activeCardId.value).toBe('card3')
  })

  it('should compute percent complete correctly', () => {
    expect(form.percentComplete.value).toBe(50) // 1 out of 2 input cards
    form.setActiveId({ cardId: 'card2', drawer: 'toggle' })
    expect(form.percentComplete.value).toBe(100) // 2 out of 2 input cards
  })

  it('should set and get form values', () => {
    form.setFormValue({ path: 'name', value: 'John Doe' })
    expect(form.getFormValue({ path: 'name' })).toBe('John Doe')

    form.setFormValue({ path: 'email', value: 'john@example.com' })
    expect(form.getAllFormValues()).toEqual({
      name: 'John Doe',
      email: 'john@example.com',
    })
  })

  it('should clear form values', () => {
    form.setFormValue({ path: 'name', value: 'John Doe' })
    form.clearFormValue('name')
    expect(form.getFormValue({ path: 'name' })).toBeUndefined()

    form.setFormValue({ path: 'email', value: 'john@example.com' })
    form.clearAllFormValues()
    expect(form.getAllFormValues()).toEqual({})
  })

  it('should compute isLastCard correctly', () => {
    expect(form.isLastCard.value).toBe(false)
    form.setActiveId({ cardId: 'card3', drawer: 'toggle' })
    expect(form.isLastCard.value).toBe(true)
  })

  it('should compute isSubmitCard correctly', () => {
    expect(form.isSubmitCard.value).toBe(false)
    form.setActiveId({ cardId: 'card2', drawer: 'toggle' })
    expect(form.isSubmitCard.value).toBe(true)
  })

  it('should generate correct form config', () => {
    const config = form.toConfig()
    expect(config.formId).toBe('test-form')
    expect(config.card).toBeDefined()
  })
})
