import type { User } from '@fiction/core/plugin-user'
import { afterAll, describe, expect, it } from 'vitest'
import { createTestUtils } from '../../test-utils/init'
import { vue } from '../libraries'

describe('active user handling', async () => {
  const testUtils = createTestUtils()
  const initialized = await testUtils.init()

  afterAll(() => testUtils.close())

  it('should set the user to initialized', async () => {
    await testUtils.fictionUser.setCurrentUser({ user: undefined })
    const computedVar = vue.computed(() => {
      return `id-${testUtils?.fictionUser.activeUser.value?.userId ?? ''}`
    })

    expect(testUtils.fictionUser.activeUser.value).toBeUndefined()
    expect(computedVar.value).toBe('id-')

    await testUtils.fictionUser.setCurrentUser({ user: initialized?.user })

    expect(testUtils.fictionUser.activeUser.value?.userId).toBe(
      initialized?.user?.userId,
    )

    expect(computedVar.value).toBe(`id-${initialized?.user?.userId}`)
  })

  it('updates user', async () => {
    await testUtils?.fictionUser?.updateUser((user: User | undefined) => {
      if (!user)
        return
      return { ...user, fullName: 'test' }
    })
  })
})
