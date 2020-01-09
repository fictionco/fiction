/* eslint-disable no-console */
/* eslint-disable unicorn/no-process-exit */

const superb = require("superb")
const figures = require("figures")
const consola = require("consola")

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
      message: "Basic description?",
      default: `My ${superb.random()} Factor project`,
      when: answers => !config.isUnitTest(answers)
    },
    {
      name: "author",
      type: "string",
      message: "Your full name?",
      default: "{gitUser.name}",
      when: answers => !config.isUnitTest(answers)
    },
    {
      name: "email",
      type: "string",
      message: "...and email?",
      default: "{gitUser.email}",
      when: answers => !config.isUnitTest(answers)
    },
    {
      name: "addDb",
      type: "list",
      message:
        "Ok let's setup your database: do you have a MongoDB connection URL ready?",
      choices: [
        { name: "Yes, I'm ready to go", value: "yes" },
        { name: "Use the demo database (resets every 30 minutes)", value: "demo" },
        { name: "I'll do this later", value: "no" }
      ],
      when: answers => !config.isUnitTest(answers)
    },

    {
      name: "db",
      type: "string",
      message: "DB Setup: Your MongoDB Connection URL (mongodb://...)",
      default: "",
      validate: val => {
        return !val || val.includes("mongodb")
          ? true
          : "Doesn't seem to be a valid database URL..."
      },
      when: answers => answers.addDb == "yes" && !config.isUnitTest(answers)
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

    if (answers.addDb == "demo") {
      data.db =
        "mongodb+srv://demo:demo@cluster0-yxsfy.mongodb.net/demo?retryWrites=true&w=majority"
    }

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
        console.log(`\t${this.chalk.cyan("cd")} ./${this.outFolder}`)
      }
    }

    console.log()
    console.log(
      this.chalk.bold(`  ${figures.tick} Great work. Now start your local server:\n`)
    )
    cd()
    console.log(`\tyarn factor dev\n`)
    console.log()
    console.log(`  ${figures.arrowRight} Factor docs: https://factor.dev/`)
    console.log(`  ${figures.arrowRight} Setup command: yarn factor setup`)
    console.log()
  }
}

module.exports = config
