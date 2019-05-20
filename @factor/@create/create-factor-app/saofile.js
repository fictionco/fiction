/* eslint-disable unicorn/no-process-exit */

const superb = require("superb")
//const { join } = require("path")
// const glob = require("glob")
// const spawn = require("cross-spawn")
// const validate = require("validate-npm-package-name")

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
      name: "url",
      message: "Project URL",
      default: ``
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
          name: "Build - Build System and Vue SSR Framework",
          value: "build"
        },
        {
          name: "Core - Service layer abstraction and Stacks (with build)",
          value: "core"
        },
        {
          name: "CMS (Recommended) - Dashboard, Page Templates, Posts (with build & core)",
          value: "cms"
        }
      ],
      default: "cms"
    }
  ],
  templateData() {
    const urlName = config.slugify(this.answers.name)
    return { urlName }
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

    console.log(this.chalk.bold(`  Factor Docs:\n`))

    console.log(`\thttps://factor.fiction.com/\n`)
  }
}

module.exports = config
