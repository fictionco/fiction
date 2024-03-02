import { describe, expect, it } from 'vitest'
import type { User } from '@fiction/core/plugin-user'
import { vue } from '../libraries'
import { createTestUtils } from '../../test-utils/init'

describe('active user handling', async () => {
  const testUtils = await createTestUtils()
  const initialized = await testUtils.init()

  it('should set the user to initialized', async () => {
    testUtils.factorUser.setCurrentUser({ user: undefined })
    const computedVar = vue.computed(() => {
      return `id-${testUtils?.factorUser.activeUser.value?.userId ?? ''}`
    })

    expect(testUtils.factorUser.activeUser.value).toBeUndefined()
    expect(computedVar.value).toBe('id-')

    testUtils.factorUser.setCurrentUser({ user: initialized?.user })

    expect(testUtils.factorUser.activeUser.value?.userId).toBe(
      initialized?.user?.userId,
    )

    expect(computedVar.value).toBe(`id-${initialized?.user?.userId}`)
  })

  it('updates user', async () => {
    await testUtils?.factorUser?.updateUser((user: User | undefined) => {
      if (!user)
        return
      return { ...user, fullName: 'test' }
    })
  })
})
