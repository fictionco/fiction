/* eslint-disable no-console */
/* eslint-disable unicorn/no-process-exit */

const path = require("path")
const superb = require("superb")
const figures = require("figures")
const consola = require("consola")
const axios = require("axios")
const config = {
  /**
   * Answers to these questions get added to the template as variables
   * If first answer is "UNIT-TEST" then mocked answers are used.
   */
  prompts: [
    {
      name: "name",
      message: "What's the name of your app?",
      default: "{outFolder}"
    },
    {
      name: "description",
      message: "... and a quick description?",
      default: `My ${superb.random()} Factor project`,
      when: answers => !config.isUnitTest(answers)
    },
    {
      name: "email",
      type: "string",
      message: "Admin user email address?",
      default: "{gitUser.email}",
      when: answers => !config.isUnitTest(answers),
      validate: v => {
        const re = /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\d-A-Za-z]+\.)+[A-Za-z]{2,}))$/
        return re.test(v) ? true : "Enter a valid email address"
      }
    }
  ],
  isUnitTest(answers) {
    return answers.name == "UNIT-TEST" ? true : false
  },

  /**
   * Info returned here gets added as variables in the template generation
   */
  templateData() {
    const data = {}
    const answers = this.answers
    if (answers.name.includes("UNIT-TEST")) {
      // set test answers for template
    }
    data.urlName = config.slugify(answers.name || "no-name")
    data.randomString = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .slice(0, 30)

    data.db =
      "mongodb+srv://demo:demo@cluster0-yxsfy.mongodb.net/demo?retryWrites=true&w=majority"

    config.diagnostic({ email: answers.email })

    return data
  },
  slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w-]+/g, "") // Remove all non-word chars
      .replace(/--+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, "") // Trim - from end of text
  },
  /**
   * Actions are files that get moved and translated through EJS system
   */
  actions() {
    const actions = [
      {
        type: "add",
        files: "**",
        templateDir: "template/factor",
        filters: {}
      },
      {
        type: "add",
        files: "*",
        filters: {}
      },
      {
        type: "move",
        patterns: {
          _gitignore: ".gitignore",
          "_package.json": "package.json",
          _env: ".env"
        }
      }
    ]

    return actions
  },
  async diagnostic({ email }) {
    try {
      await axios.get(
        `https://factor.dev/__track_event__?event=factorInstall&action=createFactorApp&label=${email}`
      )
    } catch (error) {
      /* silence */
    }
  },
  async completed() {
    this.gitInit()

    try {
      await this.npmInstall()
    } catch (error) {
      // @ts-ignore
      consola.error(error)
    }

    this.showProjectTips()

    const isNewFolder = this.outDir !== process.cwd()
    const cd = () => {
      if (isNewFolder) {
        console.log(
          `\t${this.chalk.bold.green("cd")} ${this.chalk.bold(
            path.relative(process.cwd(), this.outDir)
          )}`
        )
      }
    }

    console.log()
    console.log(
      this.chalk.bold(
        `  ${figures.tick} Well, that was fast! Now start your dev server:\n`
      )
    )
    cd()
    console.log(`\t${this.chalk.magenta.bold("npx ") + this.chalk.bold("factor dev")}\n`)
    console.log()
    console.log(
      `   ${this.chalk.cyan.bold(`${figures.arrowRight} Docs:`)} ${this.chalk.bold(
        "https://factor.dev"
      )}`
    )
    console.log(
      `   ${this.chalk.cyan.bold(`${figures.arrowRight} Help:`)} ${this.chalk.bold(
        "https://go.factor.dev/slack"
      )}`
    )
    console.log(
      `   ${this.chalk.cyan.bold(
        `${figures.arrowRight} Bugs or Requests:`
      )} ${this.chalk.bold("https://go.factor.dev/issues")}`
    )

    console.log()
  }
}

module.exports = config
