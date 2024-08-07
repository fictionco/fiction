import { abort } from '@fiction/core'
import { describe, expect, it } from 'vitest'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { FictionForms } from '..'

describe('submission endpoint', async () => {
  const testUtils = await createSiteTestUtils()

  const fictionForms = new FictionForms(testUtils)

  const initialized = await testUtils.init()

  const orgId = initialized.orgId
  const userId = initialized.user.userId

  if (!orgId || !userId) {
    throw abort('missing orgId or userId')
  }

  let formId: string

  it('create form for submissions', async () => {
    const r = await fictionForms.queries.ManageForm.serve({
      _action: 'create',
      orgId,
      fields: {
        title: 'Test Form for Submissions',
        description: 'A test form for submissions',
        status: 'published',
        card: {
          cards: [
            {
              cardId: 'card1',
              userConfig: {
                cardType: 'input',
                layout: 'left',
                alignment: 'left',
                path: 'name',
                title: 'What is your name?',
                placeholder: 'Enter your full name',
                isRequired: true,
                inputType: 'text',
              },
            },
            {
              cardId: 'card2',
              userConfig: {
                cardType: 'input',
                layout: 'right',
                alignment: 'center',
                path: 'email',
                title: 'What is your email?',
                placeholder: 'Enter your email address',
                isRequired: true,
                inputType: 'email',
              },
            },
          ],
        },
      },
    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data).toBeDefined()
    expect(r.data?.length).toBe(1)

    const createdForm = r.data?.[0]
    if (!createdForm?.formId) {
      throw abort('missing formId')
    }

    formId = createdForm.formId

    expect(createdForm.card).toBeDefined()
    expect(createdForm.card?.cards?.length).toBe(2)
    expect(createdForm.card?.cards?.[0].userConfig?.path).toBe('name')
    expect(createdForm.card?.cards?.[1].userConfig?.path).toBe('email')
  })

  it('create submission', async () => {
    const r = await fictionForms.queries.ManageSubmission.serve({
      _action: 'create',
      orgId,
      fields: {
        formId,
        userId,
        title: 'Test Form for Submissions submission',
        card: {
          cards: [
            {
              cardId: 'card1',
              userConfig: {
                cardType: 'input',
                path: 'name',
                title: 'What is your name?',
                inputType: 'text',
              },
            },
            {
              cardId: 'card2',
              userConfig: {
                cardType: 'input',
                path: 'email',
                title: 'What is your email?',
                inputType: 'email',
              },
            },
          ],
        },
        results: {
          name: 'John Doe',
          email: 'john@example.com',
        },
      },
    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data).toBeDefined()
    expect(r.data?.length).toBe(1)
    const submission = r.data?.[0]
    expect(submission?.orgId).toBe(orgId)
    expect(submission?.formId).toBe(formId)
    expect(submission?.userId).toBe(userId)
    expect(submission?.results).toEqual({
      name: 'John Doe',
      email: 'john@example.com',
    })
    expect(submission?.title).toBe('Test Form for Submissions submission')
    expect(submission?.card).toBeDefined()
    expect(submission?.card?.cards?.length).toBe(2)
    expect(r.indexMeta?.changedCount).toBe(1)
  })

  it('list submissions', async () => {
    const r = await fictionForms.queries.ManageSubmission.serve({
      _action: 'list',
      orgId,
    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data).toBeDefined()
    expect(r.data?.length).toBe(1)
    expect(r.data?.[0]?.formId).toBe(formId)
    expect(r.indexMeta?.count).toBe(1)
  })

  it('update submission', async () => {
    const listResponse = await fictionForms.queries.ManageSubmission.serve({
      _action: 'list',
      orgId,
    }, { server: true })

    const submissionId = listResponse.data?.[0]?.submissionId
    if (!submissionId) {
      throw abort('missing submissionId')
    }

    const r = await fictionForms.queries.ManageSubmission.serve({
      _action: 'update',
      orgId,
      where: [{ submissionId }],
      fields: {
        results: {
          name: 'Jane Doe',
          email: 'jane@example.com',
        },
      },
    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data).toBeDefined()
    expect(r.data?.length).toBe(1)
    const updatedSubmission = r.data?.[0]
    expect(updatedSubmission?.submissionId).toBe(submissionId)
    expect(updatedSubmission?.results).toEqual({
      name: 'Jane Doe',
      email: 'jane@example.com',
    })
    expect(r.indexMeta?.changedCount).toBe(1)
  })

  it('create another submission', async () => {
    const r = await fictionForms.queries.ManageSubmission.serve({
      _action: 'create',
      orgId,
      fields: {
        formId,
        userId,
        results: {
          name: 'Alice Smith',
          email: 'alice@example.com',
        },
        title: 'Another Test Form for Submissions submission',

      },

    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data).toBeDefined()
    expect(r.data?.length).toBe(1)
    expect(r.data?.[0]?.results).toEqual({
      name: 'Alice Smith',
      email: 'alice@example.com',
    })
  })

  it('list multiple submissions', async () => {
    const r = await fictionForms.queries.ManageSubmission.serve({
      _action: 'list',
      orgId,
    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data).toBeDefined()
    expect(r.data?.length).toBe(2)
    const names = r.data?.map(submission => submission.results?.name)
    expect(names).toContain('Jane Doe')
    expect(names).toContain('Alice Smith')
    expect(r.indexMeta?.count).toBe(2)
  })

  it('delete one submission', async () => {
    const listResponse = await fictionForms.queries.ManageSubmission.serve({
      _action: 'list',
      orgId,
    }, { server: true })

    const submissionIdToDelete = listResponse.data?.[0]?.submissionId
    if (!submissionIdToDelete) {
      throw abort('missing submissionId')
    }

    const r = await fictionForms.queries.ManageSubmission.serve({
      _action: 'delete',
      orgId,
      where: [{ submissionId: submissionIdToDelete }],
    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data).toBeDefined()
    expect(r.data?.length).toBe(1)
    expect(r.data?.[0]?.submissionId).toBe(submissionIdToDelete)
    expect(r.indexMeta?.changedCount).toBe(1)

    const finalListResponse = await fictionForms.queries.ManageSubmission.serve({
      _action: 'list',
      orgId,
    }, { server: true })

    expect(finalListResponse.data).toBeDefined()
    expect(finalListResponse.data?.length).toBe(1)
    expect(finalListResponse.indexMeta?.count).toBe(1)
  })
})
