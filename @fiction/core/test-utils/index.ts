import path from 'node:path'
import { safeDirname } from '../utils'

export * from './util'
export * from './init'

const toolUtilsRoot = safeDirname(import.meta.url)
// test special characters in path
const testImgPath = path.join(toolUtilsRoot, './img/test (#).jpg')
const testSvgPath = path.join(toolUtilsRoot, './img/favicon.svg')
const testPngPath = path.join(toolUtilsRoot, './img/favicon.png')
const testEnvFile = path.join(toolUtilsRoot, '.env.test')

export { toolUtilsRoot, testImgPath, testSvgPath, testPngPath, testEnvFile }
