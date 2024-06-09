/**
 * @vitest-environment happy-dom
 * https://vitest.dev/config/#environment
 */
import { fileFromPath } from 'formdata-node/file-from-path'

import { describe, expect, it } from 'vitest'
import { FormData } from 'formdata-node'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { path, safeDirname } from '@fiction/core/utils'


describe('media upload/download tests', async () => {


  const toolUtilsRoot = safeDirname(import.meta.url)
  const testCsvPath = path.join(toolUtilsRoot, './test.csv')

  const testUtils = await createSiteTestUtils()

  const initialized = await testUtils.init()

  it('uploads a file', async () => {
    const formData = new FormData()
    const file = await fileFromPath(testCsvPath)

    const r = await testUtils?.fictionSubscribe?.uploadFile({ file })

    expect(r).toMatchInlineSnapshot(`
      {
        "data": {
          "rows": [
            {
              "email": "john.doe@example.com",
              "tags": "tag1,tag2,tag3",
            },
            {
              "email": "jane.smith@example.com",
              "tags": "tag4,tag5,tag6",
            },
            {
              "email": "bob_johnson@example.com",
              "tags": "tag7,tag8,tag9",
            },
            {
              "email": "alice.brown@example.com",
              "tags": "tag10,tag11,tag12",
            },
            {
              "email": "charlie.davis@example.com",
              "tags": "tag13,tag14,tag15",
            },
            {
              "email": "davidwilson@example.com",
              "tags": "tag16,tag17,tag18",
            },
            {
              "email": "emily_clark@example.com",
              "tags": "tag19 tag20 tag21",
            },
            {
              "email": "grace.lee@example.com",
              "tags": "tag25,tag26,tag27",
            },
            {
              "email": "hannah.martin@example.com",
              "tags": "tag28,tag29,tag30",
            },
          ],
        },
        "message": "uploaded successfully",
        "status": "success",
      }
    `)
  })
})
