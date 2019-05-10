module.exports = Factor => {
  return new (class {
    constructor() {
      this.providers = []
      this.serviceRequests = []
      this.services = []

      Factor.$filters.add("verify-app", () => {
        const p = this.verifyProviders()
        const s = this.verifyServices()

        if (p.needed || s.needed) {
          const lines = []
          lines.push({ title: "Providers Configured", value: `${p.setup}/${p.total}` })
          lines.push({ title: "App Service Requests", value: `${s.setup}/${s.total}` })
          lines.push({ title: "To Fix", value: `Run "factor run setup" for more information`, indent: true })
          Factor.$log.formatted({
            title: "Setup Needed",
            lines,
            format: "warn"
          })
        } else {
          Factor.$log.success("Services stack verified")
        }
      })

      Factor.$filters.add("cli-setup", (_, program) => {
        _.stack = () => this.setupStack(program)
      })
    }

    async setupStack(args) {
      const { configure } = this.verifyProviders({ log: true })
      this.verifyServices({ log: true })
      Factor.$log.box("Factor Setup...")

      const inquirer = require("inquirer")
      let answers = {}
      const questions = []

      for (const { title, provider, keysNeeded, multiEnv } of configure) {
        answers = await inquirer.prompt({
          type: "confirm",
          name: `isReady`,
          message: `To setup ${title}, you'll need the following keys:\n\n\t${keysNeeded
            .map(({ key, scope }) => `${key} [${scope}]`)
            .join("\n\t")}.\n\n Ready? (skip if no)`,
          default: true
        })
        console.log() // break

        if (answers.isReady) {
          let envs = ["config"]
          if (multiEnv) {
            answers = await inquirer.prompt({
              type: "confirm",
              name: `useMulti`,
              message: `Set up ${provider} with different development & production keys? (If no, a the same keys are used for both.)`,
              default: false
            })

            if (answers.useMulti) {
              envs = ["development", "production"]
            }
          }

          let write = {}
          for (const env of envs) {
            for (const { key, scope, input } of keysNeeded) {
              let fields

              let message = `${provider} ${env}: ${key} [${scope}]?`

              if (input == "object") {
                fields = {
                  type: "editor",
                  message: message + "(JSON)",
                  validate: value => {
                    try {
                      JSON.parse(str)
                    } catch (error) {
                      return "The answer must be readable as valid JSON."
                    }
                    return true
                  },
                  filter: value => {
                    return JSON.parse(value)
                  }
                }
              } else {
                fields = { type: "input", message }
              }

              answers = await inquirer.prompt({
                name: "keyValue",
                default: "",
                ...fields
              })

              if (!write[scope]) {
                write[scope] = {}
              }
              if (!write[scope][env]) {
                write[scope][env] = {}
              }
              write[scope][env][key] = answers.keyValue
              console.log("WRITE:")
              console.log(JSON.stringify(write, null, "  "))
            }
          }
        }
      }

      // var questions = [
      //   {
      //     type: "confirm",
      //     name: "toBeDelivered",
      //     message: "Is this for delivery?",
      //     default: false
      //   },
      //   {
      //     type: "input",
      //     name: "phone",
      //     message: "What's your phone number?",
      //     validate: function(value) {
      //       var pass = value.match(
      //         /^([01]{1})?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?){1}(?:\d+)?)?$/i
      //       )
      //       if (pass) {
      //         return true
      //       }

      //       return "Please enter a valid phone number"
      //     }
      //   },
      //   {
      //     type: "list",
      //     name: "size",
      //     message: "What size do you need?",
      //     choices: ["Large", "Medium", "Small"],
      //     filter: function(val) {
      //       return val.toLowerCase()
      //     }
      //   },
      //   {
      //     type: "input",
      //     name: "quantity",
      //     message: "How many do you need?",
      //     validate: function(value) {
      //       var valid = !isNaN(parseFloat(value))
      //       return valid || "Please enter a number"
      //     },
      //     filter: Number
      //   },
      //   {
      //     type: "expand",
      //     name: "toppings",
      //     message: "What about the toppings?",
      //     choices: [
      //       {
      //         key: "p",
      //         name: "Pepperoni and cheese",
      //         value: "PepperoniCheese"
      //       },
      //       {
      //         key: "a",
      //         name: "All dressed",
      //         value: "alldressed"
      //       },
      //       {
      //         key: "w",
      //         name: "Hawaiian",
      //         value: "hawaiian"
      //       }
      //     ]
      //   },
      //   {
      //     type: "rawlist",
      //     name: "beverage",
      //     message: "You also get a free 2L beverage",
      //     choices: ["Pepsi", "7up", "Coke"]
      //   },
      //   {
      //     type: "input",
      //     name: "comments",
      //     message: "Any comments on your purchase experience?",
      //     default: "Nope, all good!"
      //   },
      //   {
      //     type: "list",
      //     name: "prize",
      //     message: "For leaving a comment, you get a freebie",
      //     choices: ["cake", "fries"],
      //     when: function(answers) {
      //       return answers.comments !== "Nope, all good!"
      //     }
      //   }
      // ]

      // const answers = await inquirer.prompt(questions)

      // console.log("\nOrder receipt:")
      // console.log(JSON.stringify(answers, null, "  "))
    }

    register(args) {
      this.serviceRequests.push(args)
    }

    add(args) {
      let { id, service, key, provider, options = {} } = args

      key = key || provider || Factor.$guid()

      Factor.$filters.add(
        id,
        (_, params) => {
          _.push({
            service: service(params),
            key,
            params
          })

          return _
        },
        options
      )

      this.services.push(args)
    }

    async service(filter, args, opts = {}) {
      const added = Factor.$filters.apply(filter, [], args)

      if (!added || added.length == 0) {
        return null
      }

      const resultsArray = await Promise.all(added.map(({ service }) => service))

      return resultsArray[0]

      // return added.map((item, index) => {
      //   return {
      //     ...item,
      //     result: resultsArray[index]
      //   }
      // })
    }

    async requestValue(filter, args) {
      return await Factor.$filters.apply(filter, args)
    }

    verifyServices({ log = false } = {}) {
      let needed = 0
      let total = 0
      this.serviceRequests.forEach(_ => {
        const { id, description, args, result, title } = _

        if (Factor.$filters.count(id) == 0) {
          const lines = []

          if (description) lines.push({ title: "Description", value: description })
          if (args) lines.push({ title: "Arguments", value: args })
          if (result) lines.push({ title: "Returns", value: result })

          const message = {
            title: `Service Handler Needed: ${title} (${id})`,
            lines
          }

          if (log) {
            Factor.$log.formatted(message)
          }

          needed++
        }
        total++
      })

      return { needed, total, setup: total - needed }
    }

    registerProvider(args) {
      this.providers.push(args)
    }

    verifyProviders({ log = false } = {}) {
      const config = Factor.$config.settings()
      let needed = 0
      let total = 0
      let configure = []

      this.providers.forEach(_ => {
        let { provider, publicKeys, privateKeys, description, title, link, multiEnv = false } = _

        const normalizeKeys = (keys = []) =>
          keys.map(_ => {
            if (typeof _ == "string") {
              return { key: _, input: "string" }
            } else {
              return _
            }
          })

        const settings = config[provider]
        const keys = [
          { scope: "public", keys: normalizeKeys(publicKeys) },
          { scope: "private", keys: normalizeKeys(privateKeys) }
        ]
        const keysNeeded = []
        let verified = true

        keys.forEach(({ scope, keys }) => {
          if (keys && keys.length > 0) {
            keys.forEach(({ key, input }) => {
              if (!settings || !settings[key]) {
                verified = false
                keysNeeded.push({ scope, key, input })
              }
            })
          }
        })

        if (!verified) {
          needed++
          configure.push({ ..._, keysNeeded })
        }

        total++

        // const groupTitle = `Configure Provider: ${title || Factor.$utils.toLabel(provider)}`
        // const lines = []
        // lines.push({ title: "Description", value: description })
        // lines.push({ title: "Link", value: link })

        // keys.forEach(({ scope, keys }) => {
        //   if (keys && keys.length > 0) {
        //     const keysNeeded = []
        //     keys.forEach(key => {
        //       if (!settings || !settings[key]) {
        //         keysNeeded.push(key)
        //       }
        //     })

        //     // if (keysNeeded.length > 0) {
        //     //   verified = false
        //     //   const file = scope == "public" ? "factor-config.json" : "factor-secrets.json"
        //     //   lines.push({ title: `${Factor.$utils.toLabel(scope)} Config`, value: "" })
        //     //   lines.push({ indent: true, title: "Keys", value: keysNeeded.map(_ => `[${_}]`).join(" ") })
        //     //   lines.push({ indent: true, title: "To Fix", value: `Add under [env]:{${provider}} in [${file}]` })
        //     // }
        //   }
        // })

        // configure.push({ provider, privateKeys, publicKeys })

        // if (!verified) {
        //   if (log) {
        //     const message = {
        //       title: groupTitle,
        //       lines
        //     }
        //     Factor.$log.formatted(message)
        //   }

        //   needed++
        // }
        // total++
      })

      return { needed, total, setup: total - needed, configure }
    }
  })()
}
