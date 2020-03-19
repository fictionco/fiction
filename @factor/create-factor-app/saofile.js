/* eslint-disable no-console */
/* eslint-disable unicorn/no-process-exit */

const path = require("path")
const superb = require("superb")
const figures = require("figures")
const consola = require("consola")
const axios = require("axios")

let answers = {}

const config = {
  /**
   * Answers to these questions get added to the template as variables
   * If first answer is "UNIT-TEST" then mocked answers are used.
   */
  prompts: [
    {
      name: "name",
      message: "Project name?",
      default: `${superb.random()} project`
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
    answers = this.answers
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
  async diagnostic({ id }) {
    try {
      await axios.get(
        `https://factor.dev/__track_event__?event=factorInstall&action=createFactorApp&label=${id}`
      )
    } catch (error) {
      /* silence */
    }
  },
  async completed() {
    config.diagnostic({ id: answers.name })

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

    const runner = this.npmClient == "npm" ? "npx" : "yarn"
    console.log()
    console.log()
    console.log(this.chalk.bold(`  ${figures.tick} Ready! Now start your dev server:\n`))
    cd()
    console.log()
    console.log(
      `\t${this.chalk.magenta.bold(`${runner} `) + this.chalk.bold("factor dev")}\n`
    )
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
    console.log()
    console.log()
  }
}

module.exports = config
