export default Factor => {
  return new (class {
    constructor() {
      this.configFile = ".env"
      this.configVars = ["SMTP_USERNAME", "SMTP_PASSWORD", "SMTP_HOST"]
      Factor.$filters.add("setup-needed", _ => {
        const item = {
          title: "SMTP Email Credentials",
          value: "Needed for transactional emails (e.g. forgot password)",
          file: this.configFile,
          vars: this.configVars
        }

        return [..._, item]
      })

      // CLI admin setup utility
      Factor.$filters.add("cli-add-setup", (_, { privateConfig }) => {
        const setupItem = {
          name: "Email Setup - Transactional Email SMTP Info",
          value: "email",
          callback: async ({ program, inquirer }) => {
            const questions = [
              {
                name: "SMTP_USERNAME",
                message: "What's Your SMTP Service Username?",
                type: "input",
                default: privateConfig.SMTP_USERNAME
              },
              {
                name: "SMTP_PASSWORD",
                message: "What's Your SMTP Service Password?",
                type: "input",
                default: privateConfig.SMTP_USERNAME
              },
              {
                name: "SMTP_HOST",
                message: "What's Your SMTP Service Host?",
                type: "input",
                default: privateConfig.SMTP_HOST
              }
            ]

            let { SMTP_USERNAME, SMTP_PASSWORD, SMTP_HOST } = await inquirer.prompt(
              questions
            )

            await Factor.$setup.writeConfig(".env", {
              SMTP_USERNAME,
              SMTP_PASSWORD,
              SMTP_HOST
            })
          }
        }

        return [..._, setupItem]
      })
    }
  })()
}
