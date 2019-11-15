import { requestPostSave } from "@factor/post"
import { postTypesConfig, pushToFilter, addFilter, setting } from "@factor/tools"

import { writeConfig } from "@factor/cli/setup"

addSetupCli()

// Add dashboard component
setting("commentizer.postTypes").forEach(postType => {
  addFilter("post-edit-components", components => {
    components.push({
      name: "commentizerDashboardPanel",
      component: setting("commentizer.components.commentizerDashboardPanel"),
      postType: postType
    })
    return components
  })
})

// Add global components
// addFilter("components", __ => {
//   __["commentizer"] = setting("commentizer.components.commentizer")
//   __["commentizerAdd"] = setting("commentizer.components.commentizerAdd")
//   __["commentizerDisplay"] = setting("commentizer.components.commentizerDisplay")
//   __["commentizerDashboardList"] = setting(
//     "commentizer.components.commentizerDashboardList"
//   )
//   return __
// })

export async function createComment(commentData) {
  return await requestPostSave({
    postType: "commentizer",
    post: {
      content: commentData.content || "",
      email: commentData.email || "",
      name: commentData.name || ""
    }
  })
}
function addSetupCli() {
  // CLI admin setup utility
  pushToFilter("cli-add-setup", {
    name: "Plugin: Commentizer",
    value: "commentizer",
    callback: async ({ inquirer }) => {
      const factorPostTypes = await postTypesConfig()
      let questions = [
        {
          name: "postTypes",
          message: "Select post types to enable comments on.",
          type: "checkbox",
          choices: factorPostTypes.map(postType => {
            return { name: postType, value: postType }
          })
        }
      ]

      const { postTypes } = await inquirer.prompt(questions)
      await writeConfig("factor-config", {
        commentizer: {
          postTypes
        }
      })
    }
  })
}
