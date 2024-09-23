import { createUiTestingKit } from '@fiction/core/test-utils/kit'
import { setup } from './postTestUtils.main.js'

export async function createPostsUiTestingKit(args: { initUser?: boolean, headless?: boolean, slowMo?: number } = {}) {
  return createUiTestingKit({ ...args, setup })
}
