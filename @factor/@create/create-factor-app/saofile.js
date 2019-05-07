/* eslint-disable unicorn/no-process-exit */
const { join } = require("path")
const superb = require("superb")
const glob = require("glob")
const spawn = require("cross-spawn")
const validate = require("validate-npm-package-name")

const rootDir = __dirname

module.exports = {
  prompts: [
    {
      name: "name",
      message: "Project name (Url Safe)",
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
      message: "Author name",
      default: "{gitUser.name}",
      store: true
    }
  ],
  templateData() {
    return {}
  },
  actions() {
    const validation = validate(this.answers.name)

    validation.warnings &&
      validation.warnings.forEach(warn => {
        console.warn("Warning:", warn)
      })
    validation.errors &&
      validation.errors.forEach(err => {
        console.error("Error:", err)
      })

    validation.errors && validation.errors.length && process.exit(1)

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
        gitignore: ".gitignore",
        "_package.json": "package.json"
      }
    })

    return actions
  },
  async completed() {
    this.gitInit()

    await this.npmInstall({ npmClient: "yarn" })

    const isNewFolder = this.outDir !== process.cwd()
    const cd = () => {
      if (isNewFolder) {
        console.log(`\t${this.chalk.cyan("cd")} ${this.outFolder}`)
      }
    }

    console.log()
    console.log(this.chalk.bold(`  To get started:\n`))
    cd()
    console.log(`\tyarn factor dev\n`)

    console.log(this.chalk.bold(`  Factor Docs: For learn more visit:\n`))

    console.log(`\thttps://factor.fiction.com/\n`)
  }
}
