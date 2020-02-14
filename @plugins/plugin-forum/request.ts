import { requestPostSave } from "@factor/post/request"
import { FactorPost } from "@factor/post/types"

/**
 * Request to create a new topic
 */
export const requestNewTopic = async (form: FactorPost): Promise<void> => {
  await requestPostSave({ post: form, postType: "blog" })
  // sendFormEmail(form)
  return
}
