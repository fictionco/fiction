import { requestPostSave, getPostTypes } from "@factor/post"
import { pushToFilter, addFilter } from "@factor/tools"
export default Factor => {
  return new (class {
    constructor() {
      this.addSetupCli()

      // Add dashboard component
      Factor.$setting.get("commentizer.postTypes").forEach(postType => {
        addFilter("post-edit-components", components => {
          components.push({
            name: "commentizerDashboardPanel",
            component: Factor.$setting.get(
              "commentizer.components.commentizerDashboardPanel"
            ),
            postType: postType
          })
          return components
        })
      })

      // Add global components
      addFilter("components", components => {
        components["commentizer"] = Factor.$setting.get(
          "commentizer.components.commentizer"
        )
        components["commentizerAdd"] = Factor.$setting.get(
          "commentizer.components.commentizerAdd"
        )
        components["commentizerDisplay"] = Factor.$setting.get(
          "commentizer.components.commentizerDisplay"
        )
        components["commentizerDashboardList"] = Factor.$setting.get(
          "commentizer.components.commentizerDashboardList"
        )
        return components
      })
    }

    async createComment(commentData) {
      return await requestPostSave({
        postType: "commentizer",
        post: {
          content: commentData.content || "",
          email: commentData.email || "",
          name: commentData.name || ""
        }
      })
    }

    addSetupCli() {
      // CLI admin setup utility
      pushToFilter("cli-add-setup", {
        name: "Plugin: Commentizer",
        value: "commentizer",
        callback: async ({ program, inquirer }) => {
          let questions = [
            {
              name: "postTypes",
              message: "Select post types to enable comments on.",
              type: "checkbox"
            }
          ]

          const factorPostTypes = await getPostTypes()
          factorPostTypes.forEach(postType => {
            questions.choices.push({ name: postType, value: postType })
          })

          const { postTypes } = await inquirer.prompt(questions)
          await Factor.$setup.writeConfig("factor-config", {
            commentizer: {
              postTypes
            }
          })
        }
      })
    }
  })()
}
