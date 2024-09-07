import { abort } from '@fiction/core'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { describe, expect, it } from 'vitest'
import { FictionForms } from '..'

describe('form endpoint', async () => {
  const testUtils = await createSiteTestUtils()

  const fictionForms = new FictionForms(testUtils)

  const initialized = await testUtils.init()

  const orgId = initialized.orgId
  const userId = initialized.user.userId

  if (!orgId || !userId) {
    throw abort('missing orgId or userId')
  }

  it('create form', async () => {
    const r = await fictionForms.queries.ManageForm.serve({
      _action: 'create',
      orgId,
      fields: {
        title: 'Test Form',
        description: 'A test form',
        status: 'draft',
      },
    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data?.length).toBe(1)
    expect(r.data?.[0].orgId).toBe(orgId)
    expect(r.data?.[0].title).toBe('Test Form')
    expect(r.data?.[0].status).toBe('draft')
    expect(r.indexMeta?.changedCount).toBe(1)
  })

  it('list forms', async () => {
    const r = await fictionForms.queries.ManageForm.serve({
      _action: 'list',
      orgId,
    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data?.length).toBe(1)
    expect(r.data?.[0].title).toBe('Test Form')
    expect(r.indexMeta?.count).toBe(1)
  })

  it('update form', async () => {
    const listResponse = await fictionForms.queries.ManageForm.serve({
      _action: 'list',
      orgId,
    }, { server: true })

    const formId = listResponse.data?.[0].formId

    if (!formId) {
      throw abort('missing formId')
    }

    const r = await fictionForms.queries.ManageForm.serve({
      _action: 'update',
      orgId,
      where: [{ formId }],
      fields: { status: 'published', title: 'Updated Test Form' },
    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data?.length).toBe(1)
    expect(r.data?.[0].formId).toBe(formId)
    expect(r.data?.[0].status).toBe('published')
    expect(r.data?.[0].title).toBe('Updated Test Form')
    expect(r.indexMeta?.changedCount).toBe(1)
  })

  it('create another form', async () => {
    const r = await fictionForms.queries.ManageForm.serve({
      _action: 'create',
      orgId,
      fields: {
        title: 'Second Test Form',
        description: 'Another test form',
        status: 'draft',
      },
    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data?.length).toBe(1)
    expect(r.data?.[0].title).toBe('Second Test Form')
  })

  it('list multiple forms', async () => {
    const r = await fictionForms.queries.ManageForm.serve({
      _action: 'list',
      orgId,
    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data?.length).toBe(2)
    expect(r.data?.map(form => form.title)).toContain('Updated Test Form')
    expect(r.data?.map(form => form.title)).toContain('Second Test Form')
    expect(r.indexMeta?.count).toBe(2)
  })

  it('delete one form', async () => {
    const listResponse = await fictionForms.queries.ManageForm.serve({
      _action: 'list',
      orgId,
    }, { server: true })

    const formIdToDelete = listResponse.data?.[0].formId

    if (!formIdToDelete) {
      throw abort('missing formIdToDelete')
    }

    const r = await fictionForms.queries.ManageForm.serve({
      _action: 'delete',
      orgId,
      where: [{ formId: formIdToDelete }],
    }, { server: true })

    expect(r.status).toBe('success')
    expect(r.data?.length).toBe(1)
    expect(r.data?.[0].formId).toBe(formIdToDelete)
    expect(r.indexMeta?.changedCount).toBe(1)

    const finalListResponse = await fictionForms.queries.ManageForm.serve({
      _action: 'list',
      orgId,
    }, { server: true })

    expect(finalListResponse.data?.length).toBe(1)
    expect(finalListResponse.indexMeta?.count).toBe(1)
  })
})
