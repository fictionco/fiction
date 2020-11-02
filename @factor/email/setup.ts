import { pushToFilter } from "@factor/api"

const { SMTP_HOST } = process.env
const key = "email"

export const setup = (): void => {
  if (!SMTP_HOST) {
    pushToFilter({
      key,
      hook: "setup-needed",
      item: {
        title: "SMTP Email Setup",
        value: "Needed to send transactional email",
        file: ".env",
        name: ["SMTP_HOST", "SMTP_PORT"],
      },
    })
  }
}
setup()
