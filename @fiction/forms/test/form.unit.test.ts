/**
 * @vitest-environment happy-dom
 */

import { beforeEach, describe, expect, it } from 'vitest'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import type { FormSettings } from '../form'
import { Form } from '../form'
import { FictionForms } from '..'

describe('form', async () => {
  let formSettings: FormSettings
  let form: Form
  const testUtils = await createSiteTestUtils()

  const fictionForms = new FictionForms(testUtils)

  const initialized = await testUtils.init()

  const orgId = initialized.orgId

  const createFormResponse = await fictionForms.queries.ManageForm.serve({
    _action: 'create',
    orgId,
    fields: {
      title: 'Test Form',
      description: 'A test form for submissions',
      status: 'published',
      card: {
        cards: [
          {
            cardId: 'card1',
            userConfig: {
              cardType: 'input',
              key: 'name',
              title: 'What is your name?',
              inputType: 'text',
            },
          },
          {
            cardId: 'card2',
            userConfig: {
              cardType: 'input',
              key: 'email',
              title: 'What is your email?',
              inputType: 'email',
            },
          },
          {
            cardId: 'card3',
            userConfig: { cardType: 'end' },
          },
        ],
      },
    },
  }, { server: true })

  const createdForm = createFormResponse.data?.[0]
  if (!createdForm?.formId) {
    throw new Error('Failed to create test form')
  }

  beforeEach(() => {
    formSettings = {
      fictionForms,
      formId: createdForm?.formId,
      orgId,
      card: {
        cards: [
          { cardId: 'card1', userConfig: { cardType: 'input', key: 'name', title: 'Name' } },
          { cardId: 'card2', userConfig: { cardType: 'input', key: 'email', title: 'Email' } },
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
    expect(form.percentComplete.value).toBe(0) // 1 out of 2 input cards
    form.setActiveId({ cardId: 'card2', drawer: 'toggle' })
    expect(form.percentComplete.value).toBe(50) // 2 out of 2 input cards
  })

  it('should set and get form values', () => {
    form.setUserValue({ value: 'John Doe', cardId: 'card1' })
    expect(form.getUserValue({ cardId: 'card1' })).toBe('John Doe')

    form.setUserValue({ value: 'john@example.com', cardId: 'card2' })
    expect(form.getUserValue({ cardId: 'card2' })).toBe('john@example.com')

    expect(form.formValues.value).toEqual({
      name: 'John Doe',
      email: 'john@example.com',
    })
  })

  it('should clear form values', () => {
    form.setUserValue({ value: 'John Doe', cardId: 'card1' })
    form.setUserValue({ value: 'john@example.com', cardId: 'card2' })

    form.clearFormValue('card1')
    expect(form.getUserValue({ cardId: 'card1' })).toBeUndefined()
    expect(form.getUserValue({ cardId: 'card2' })).toBe('john@example.com')

    form.clearAllFormValues()
    expect(form.formValues.value).toEqual({
      name: undefined,
      email: undefined,
    })
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
    expect(config.formId).toBe(createdForm?.formId)
    expect(config.card).toBeDefined()
  })

  it('should submit form successfully', async () => {
    form.setUserValue({ value: 'John Doe', cardId: 'card1' })
    form.setUserValue({ value: 'john@example.com', cardId: 'card2' })

    const result = await form.submitForm()

    expect(result.status).toBe('success')

    const createdSub = result.data?.[0]

    expect(createdSub?.orgId).toBe(orgId)

    const submissionId = createdSub?.submissionId

    if (!submissionId) {
      throw new Error('Submission ID not found')
    }

    // Retrieve the submitted record
    const listResponse = await fictionForms.queries.ManageSubmission.serve({
      _action: 'list',
      orgId,
      where: { submissionId },
    }, { server: true })

    expect(listResponse.status).toBe('success')
    expect(listResponse.data).toBeDefined()
    expect(listResponse.data?.length).toBe(1)

    const submission = listResponse.data?.[0]
    expect(submission?.formId).toBe(form.settings.formId)
    expect(submission?.userValues).toEqual({
      name: 'John Doe',
      email: 'john@example.com',
    })
  })
})
