export default {
  app: {
    components: {
      content: (): Promise<any> => import("./content.vue"),
    },
  },
  forum: {
    categories: ["example-category", "another-example"],
  },
}
