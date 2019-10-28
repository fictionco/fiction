export default Factor => {
  return {
    pageTemplates: {
      templates: [
        {
          _id: "default",
          component: () => import("./tpl-default")
        }
      ]
    }
  }
}
