import path from 'node:path'
import { safeDirname } from '../utils'

export * from './util'
export * from './init'

const toolUtilsRoot = safeDirname(import.meta.url)
// test special characters in path
const testImgPath = path.join(toolUtilsRoot, 'test (#).jpg')
const testEnvFile = path.join(toolUtilsRoot, '.env.test')

export { toolUtilsRoot, testImgPath, testEnvFile }
