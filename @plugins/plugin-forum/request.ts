import { requestPostSave } from "@factor/post/request"
import { FactorPost } from "@factor/post/types"

/**
 * Request to create a new topic
 */
export const requestNewTopic = async (form: FactorPost): Promise<void> => {
  const saved = await requestPostSave({ post, postType })
  sendFormEmail(form)
  return saved
}
