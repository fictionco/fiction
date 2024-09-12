import { abort } from '@fiction/core'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { describe, expect, it } from 'vitest'
import { FictionForms } from '..'

describe('submission endpoint', async () => {
  const testUtils = await createSiteTestUtils()

  const fictionForms = new FictionForms(testUtils)

  const initialized = await testUtils.init()

  const orgId = initialized.orgId

  if (!orgId) {
    throw abort('missing orgId ')
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
                key: 'name',
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
                key: 'email',
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
    expect(createdForm.card?.cards?.[0].userConfig?.key).toBe('name')
    expect(createdForm.card?.cards?.[1].userConfig?.key).toBe('email')
  })

  it('create submission', async () => {
    const r = await fictionForms.queries.ManageSubmission.serve({
      _action: 'create',
      orgId,
      fields: {
        formId,
        title: 'Test Form for Submissions submission',
        card: {
          cards: [
            {
              cardId: 'card1',
              userConfig: {
                cardType: 'input',
                key: 'name',
                title: 'What is your name?',
                inputType: 'text',
                userValue: 'John Doe',
              },
            },
            {
              cardId: 'card2',
              userConfig: {
                cardType: 'input',
                key: 'email',
                title: 'What is your email?',
                inputType: 'email',
                userValue: 'john@example.com',
              },
            },
          ],
        },
      },
    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data).toBeDefined()
    expect(r.data?.length).toBe(1)
    const submission = r.data?.[0]
    expect(submission?.orgId).toBe(orgId)
    expect(submission?.formId).toBe(formId)
    expect(submission?.userValues).toEqual({
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

  it('should create a submission with minimal fields', async () => {
    const r = await fictionForms.queries.ManageSubmission.serve({
      _action: 'create',
      orgId,
      fields: {
        formId,
        userValues: {
          name: 'John Minimal',
        },
      },
    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data).toBeDefined()
    expect(r.data?.length).toBe(1)
    expect(r.data?.[0]?.userValues?.name).toBe('John Minimal')
    expect(r.data?.[0]?.userValues?.email).toBeUndefined()
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
        userValues: {
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
    expect(updatedSubmission?.userValues).toEqual({
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
        userValues: {
          name: 'Alice Smith',
          email: 'alice@example.com',
        },
        title: 'Another Test Form for Submissions submission',

      },

    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data).toBeDefined()
    expect(r.data?.length).toBe(1)
    expect(r.data?.[0]?.userValues).toEqual({
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
    expect(r.data?.length).toBe(3)
    const names = r.data?.map(submission => submission.userValues?.name)
    expect(names).toContain('Jane Doe')
    expect(names).toContain('Alice Smith')
    expect(r.indexMeta?.count).toBe(3)
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
    expect(finalListResponse.data?.length).toBe(2)
    expect(finalListResponse.indexMeta?.count).toBe(2)
  })

  it('should count submissions with filters', async () => {
    const r = await fictionForms.queries.ManageSubmission.serve({
      _action: 'count',
      orgId,
      filters: [
        { field: 'attention', operator: '=', value: 'reviewed' },
      ],
    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.indexMeta?.count).toBe(0)
  })

  it('should handle invalid action gracefully', async () => {
    const r = await fictionForms.queries.ManageSubmission.serve({
      // @ts-expect-error Testing invalid action
      _action: 'invalidAction',
      orgId,
    }, { server: true })

    expect(r.status).toBe('error')
    expect(r.message).toBe('Invalid action')
  })
})
