import axios from "axios"

const baseUrl = window.$BASE_URL
export const sendEvent = async (data: Record<string, any>): Promise<void> => {
  const url = `${baseUrl}_loading/event`

  await axios.post(url, data)

  return
}
