// Scans a schema and adds the populated field names to an array property
// Needed to help determine when/where to populate them
// _registerPopulatedFields(schema, options) {
//   const populated = []
//   schema.eachPath(function process(pathName, schemaType) {
//     if (pathName == "_id") return
//     if (schemaType.options.ref || (schemaType.caster && schemaType.caster.options.ref)) {
//       if (!populated.includes(pathName)) {
//         populated.push(pathName)
//       }
//     }
//   })

//   schema.populatedFields = populated
// }

// verifyServiceRequests() {
//   const requests = Factor.$stack.getServiceRequests()
//   const total = requests.length
//   const missing = requests.filter(_ => _.missing)
//   const missingNum = missing.length
//   const set = total - missingNum
//   let lines = [
//     {
//       title: `${this.verifyPrefix(missingNum)} API Requests`,
//       value: `${set} of ${total} Requests are Handled`
//     }
//   ]

//   if (missingNum > 0) {
//     lines.push({})
//     lines.push({ title: "Missing Requests...", value: "" })
//     lines = lines.concat(
//       missing.map(({ id, description, args, returns }) => {
//         return { title: id, value: description, indent: true }
//       })
//     )
//     lines.push({})
//     lines.push({
//       title: "To Fix",
//       value: "Add a stack, a relevant plugin (or custom code)."
//     })
//   }

//   const message = {
//     title: "API Service Coverage",
//     lines
//   }
//   Factor.$log.formatted(message)
// }

// verifySettings(settings) {
//   const total = settings.length
//   const missing = settings.filter(_ => _.missing).length
//   return {
//     total,
//     missing,
//     set: total - missing
//   }
// }

// verifyPrefix(fail) {
//   return !fail ? chalk.green(figures.tick) : chalk.red(figures.cross)
// }

// verifyProviders(groups) {
//   const lines = groups.map(_ => {
//     const v = _.verification
//     return {
//       title: `${this.verifyPrefix(v.missing)} ${_.title}`,
//       value: `${v.set} of ${v.total} Settings are Configured`
//     }
//   })

//   const message = {
//     title: "Services",
//     lines
//   }
//   Factor.$log.formatted(message)
// }

// parseSettings(settingsGroup) {
//   return settingsGroup.map(_ => {
//     const { config = [], secrets = [] } = _.settings || {}
//     let settings = []

//     settings = settings.concat(
//       this.normalize({ settings: config, scope: "public", ..._.settings })
//     )
//     settings = settings.concat(
//       this.normalize({ settings: secrets, scope: "private", ..._.settings })
//     )

//     const verification = this.verifySettings(settings)
//     return {
//       ..._,
//       ..._.settings,
//       settings,
//       verification
//     }
//   })
// }

// normalize({ settings, group, scope }) {
//   const conf = Factor.$config.settings()

//   return settings.map(_ => {
//     let out
//     if (typeof _ == "string") {
//       out = { group, scope, key: _, input: "input" }
//     } else {
//       out = { group, scope, ..._ }
//     }
//     const { key } = out
//     out.message = out.message ? out.message : `${key}`

//     out.value = group && conf[group] ? conf[group][key] : conf[key] ? conf[key] : ""

//     if (!out.value) {
//       out.missing = true
//       out.value = _.default ? _.default : ""
//     }

//     return out
//   })
// }

// async stack(groups, { title } = {}) {
//   if (title) {
//     Factor.$log.formatted({ title })
//   }

//   let answers

//   for (const { title, description, settings, group, envs } of groups) {
//     answers = await inquirer.prompt({
//       type: "confirm",
//       name: `isReady`,
//       message: `${title}: has the following settings:\n\n\t${settings
//         .map(({ key, scope }) => `${key} [${scope}]`)
//         .join("\n\t")}.\n\n Set? (If no, skip)`,
//       default: true
//     })
//     console.log() // break

//     if (answers.isReady) {
//       let environments = ["config"]
//       if (envs && envs.includes("multi")) {
//         if (envs == "multi-optional") {
//           answers = await inquirer.prompt({
//             type: "confirm",
//             name: `useMulti`,
//             message: `Set up ${title} with different settings for "development" & "production"? (If no, use same)`,
//             default: false
//           })
//         }

//         if ((answers.useMulti && envs == "multi-optional") || envs == "multi") {
//           environments = ["development", "production"]
//         }
//       }

//       let write = {}
//       for (const env of environments) {
//         for (const { key, scope, input, message, value, parsers = {} } of settings) {
//           let fields

//           const descriptor =
//             env != "config"
//               ? `${title} "${env}" ${message}? (${scope})`
//               : `${title} ${message}? (${scope})`
//           fields = {
//             type: input,
//             message: descriptor,
//             default: value,
//             ...parsers
//           }

//           answers = await inquirer.prompt({
//             name: "keyValue",
//             ...fields
//           })

//           // Don't write a setting if no default value is given and also is not set by user
//           const setVal =
//             typeof value !== "undefined" ||
//             (typeof value == "undefined" && answers.keyValue)
//               ? true
//               : false

//           if (setVal) {
//             if (!write[scope]) {
//               write[scope] = {}
//             }
//             if (!write[scope][env]) {
//               write[scope][env] = {}
//             }

//             if (!write[scope][env][group]) {
//               write[scope][env][group] = {}
//             }
//             write[scope][env][group][key] = answers.keyValue
//           }
//         }
//       }

//       await this.writeConfig(write)
//     }
//   }
// }
