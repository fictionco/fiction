import process from 'node:process'
import { beforeAll } from 'vitest'

process.env.IS_TEST = '1'
process.env.TEST_ENV = 'unit'
/**
 * IN SETUP just do global test variables, don't do imports
 */
beforeAll(async () => {
  process.env.TEST_RUN = '1'
  process.env.IS_TEST = '1'
  process.env.TEST_ENV = 'unit'
  process.env.POSTGRES_URL = 'http://test:test@localhost:5432/test'
  process.env.NODE_ENV = 'development'
  process.env.MODE = 'development'

  if (typeof window !== 'undefined')
    Object.defineProperty(window, 'scrollTo', { value: () => {}, writable: true })
})
