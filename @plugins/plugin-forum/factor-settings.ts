export default {
  forum: {
    indexRoute: "/forum",
    postRoute: "/topic",
    indexLimit: 30,
    notify: {
      newTopic: [],
      newReply: [],
    },
    features: {
      topicSubscribe: true,
      tagging: true,
    },

    layout: {
      index: ["topicIndex"],
      single: ["topicSingle"],
    },
    categories: [],

    components: {
      forumSidebar: (): Promise<any> => import("./forum-sidebar.vue"),
      forumIndex: (): Promise<any> => import("./forum-index.vue"),
      forumWrap: (): Promise<any> => import("./forum-wrap.vue"),
      topicList: (): Promise<any> => import("./topic-list.vue"),
      topicSingle: (): Promise<any> => import("./topic-single.vue"),
      topicPost: (): Promise<any> => import("./topic-post.vue"),
      topicReply: (): Promise<any> => import("./topic-reply.vue"),
      topicActions: (): Promise<any> => import("./el/topic-actions.vue"),
      topicTags: (): Promise<any> => import("./el/topic-tags.vue"),
      topicAuthor: (): Promise<any> => import("./el/topic-post-author.vue"),
      topicEdit: (): Promise<any> => import("./topic-edit.vue"),
      navBack: (): Promise<any> => import("./el/nav-back.vue"),
      topicPagination: (): Promise<any> => import("./el/topic-pagination.vue"),
      customIcons: (): Promise<any> => import("./el/nav-icon.vue"),
    },
  },
}
