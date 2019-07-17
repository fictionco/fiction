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
      name: "scope",
      message: "What would you like to use?",
      type: "list",
      choices: [
        {
          name: "Complete (@factor/post) - Core Platorm + Post System + Dashboard",
          value: "post"
        },
        {
          name: "Core (@factor/app) - Core Platorm",
          value: "app"
        }
      ],
      default: "post"
    }
  ],
  templateData() {
    const urlName = config.slugify(this.answers.name)
    const randomString = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 30)

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
        _env: '.env'
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
    console.log(this.chalk.bold(`  ${figures.tick} To get started:\n`))
    cd()
    console.log(`\tyarn factor dev\n`)

    console.log(this.chalk.bold(`  ${figures.star} Factor Docs:\n`))

    console.log(`\thttps://factor.dev/\n`)

    console.log()
  }
}

module.exports = config
