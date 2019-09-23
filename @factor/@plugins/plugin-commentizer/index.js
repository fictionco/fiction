export default Factor => {
  return new(class {
    constructor() {
      this.addSetupCli()

      // Add dashboard component
      Factor.$setting.get("commentizer.postTypes").forEach(postType => {
        Factor.$filters.add("post-edit-components", components => {
          components.push({
            name: "commentizerDashboardPanel",
            component: Factor.$setting.get("commentizer.components.commentizerDashboardPanel"),
            postType: postType
          })
          return components
        })
      })

      // Add global components
      Factor.$filters.add("components", components => {
        components["commentizer"] = Factor.$setting.get("commentizer.components.commentizer")
        components["commentizerAdd"] = Factor.$setting.get("commentizer.components.commentizerAdd")
        components["commentizerDisplay"] = Factor.$setting.get("commentizer.components.commentizerDisplay")
        components["commentizerDashboardList"] = Factor.$setting.get("commentizer.components.commentizerDashboardList")
        return components
      })
    }

    async createComment(commentData) {
      return await Factor.$post.save({
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
      Factor.$filters.add("cli-add-setup", _ => {
        const setupCommentizer = {
          name: "Plugin: Commentizer",
          value: "commentizer",
          callback: async ({ program, inquirer }) => {
            let questions = [{
                name: "postTypes",
                message: "Select post types to enable comments on.",
                type: "checkbox"
              }
            ]

            const factorPostTypes = await Factor.$post.getPostTypes()
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
        }

        return [..._, setupCommentizer]
      })
    }

  })()
}
