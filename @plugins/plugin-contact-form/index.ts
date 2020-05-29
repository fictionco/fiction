import { requestPostSave } from "@factor/post/request"
import { toLabel, addPostType } from "@factor/api"
import { sendEmailRequest } from "@factor/email"
import { setting } from "@factor/api/settings"
import { FactorPostState } from "@factor/post/types"

const postType = "contact-form"

export const sendFormEmail = async (form: Record<string, any>): Promise<void> => {
  const toSetting = setting("contactForm.email")

  /**
   * Allow this to be disabled
   */
  const disable = setting("contactForm.adminEmail.disable")

  if (disable) return

  if (!toSetting) {
    throw new Error(
      "Destination email address is missing from Factor settings (contactForm.email)"
    )
  }

  /**
   * Allow for custom subject in email
   */
  const to = typeof toSetting == "function" ? toSetting() : toSetting

  const text = Object.entries(form)
    .map(([key, value]) => `<p><strong>${toLabel(key)}</strong><br><i>${value}</i></p>`)
    .join("")

  const subject = setting("contactForm.adminEmail.subject")

  await sendEmailRequest("sendEmail", {
    _id: "contact-form",
    to,
    subject: typeof subject == "function" ? subject(form) : subject,
    text,
  })

  return
}

export const saveContactForm = async (
  form: Record<string, any>
): Promise<FactorPostState> => {
  const post = { settings: form }
  const saved = await requestPostSave({ post, postType: postType })
  sendFormEmail(form)
  return saved
}

export const setup = (): void => {
  addPostType({
    postType,
    nameIndex: "Contact Form Submissions",
    nameSingle: "Submission",
    namePlural: "Contact Form Submissions",
    listTemplate: (): Promise<any> => import("./dashboard-list.vue"),
    noAddNew: true,
    accessLevel: 300,
    managePosts: true,
    permissions: {
      create: { accessLevel: 0 },
      retrieve: {
        accessLevel: 200,
        accessAuthor: true,
      },
    },
  })
}
setup()
