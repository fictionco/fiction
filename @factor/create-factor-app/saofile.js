/* eslint-disable unicorn/no-process-exit */

const superb = require("superb")
const figures = require("figures")
const consola = require("consola")
// const rootDir = __dirname

const config = {
  prompts: [
    {
      name: "name",
      message: "Project Title",
      default: "{outFolder}"
    },
    {
      name: "description",
      message: "Project description",
      default: `My ${superb()} Factor project`
    },
    {
      name: "author",
      type: "string",
      message: "Your Name",
      default: "{gitUser.name}"
    },
    {
      name: "email",
      type: "string",
      message: "Your Email",
      default: "{gitUser.email}"
    },
    {
      name: "addDb",
      type: "list",
      message: "Do you have a MongoDB connection string?",
      choices: ["yes", "no"]
    },
    {
      name: "db",
      type: "string",
      message: "Your MongoDB Connection String (mongodb://...)",
      default: "",
      validate: val => {
        return !val || val.includes("mongodb")
          ? true
          : "Doesn't seem to be a valid connection string..."
      },
      when: answers => answers.addDb != "no"
    }
  ],
  templateData() {
    const urlName = config.slugify(this.answers.name)
    const randomString = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .slice(0, 30)

    return { urlName, randomString }
  },
  slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w\-]+/g, "") // Remove all non-word chars
      .replace(/\-\-+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, "") // Trim - from end of text
  },
  actions() {
    const actions = [
      {
        type: "add",
        files: "**",
        templateDir: "template/factor",
        filters: {}
      }
    ]

    actions.push({
      type: "add",
      files: "*",
      filters: {}
    })

    actions.push({
      type: "move",
      patterns: {
        _gitignore: ".gitignore",
        "_package.json": "package.json",
        _env: ".env"
      }
    })

    return actions
  },
  async completed() {
    this.gitInit()

    try {
      await this.npmInstall()
    } catch (error) {
      consola.error(error)
    }

    this.showProjectTips()

    const isNewFolder = this.outDir !== process.cwd()
    const cd = () => {
      if (isNewFolder) {
        console.log(`\t${this.chalk.cyan("cd")} ${this.outFolder}`)
      }
    }

    console.log()
    console.log(this.chalk.bold(`  ${figures.tick} Start your local server:\n`))
    cd()
    console.log(`\tyarn factor dev\n`)
    console.log()

    console.log(`  ${figures.arrowRight} Factor Docs: https://factor.dev/`)

    console.log(`  ${figures.arrowRight} Setup CLI: yarn factor setup`)

    console.log()
  }
}

module.exports = config
