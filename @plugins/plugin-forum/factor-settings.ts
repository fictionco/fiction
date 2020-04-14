export default {
  forum: {
    indexRoute: "/forum",
    postRoute: "/topic",
    indexLimit: 30,
    returnLinkText: "All Topics",
    features: {
      topicSubscribe: true,
      tagging: true,
    },
    metatags: {
      index: {
        title: "Factor Forum",
        description: "Help and discussion about Factor JS",
      },
      newTopic: {
        title: "New Topic",
        description: "Start a new topic discussion on the forum",
      },
      editTopic: {
        title: "Edit Topic",
        description: "Edit a forum topic",
      },
    },
    text: {
      newTopic: "Start A Discussion",
      listAll: "All Discussions",
      topicLocked: "This topic is locked.",
      loginToReply: "You need to login to reply.",
      subscribeOnReply: "Subscribe to updates?",
      login: "Login &rarr;",
      save: "Save &uarr;",
      postReply: "Post Reply &uarr;",
      viewTopic: "View Topic &rarr;",
      newTopicHeader: "Create New Topic",
      editTopicHeader: "Edit Topic",
      postTopicButton: "Post Topic &rarr;",
      editTopicButton: "Save Changes &rarr;",
      notifyNewTopic: "New topic created",
      notifyTopicEdited: "Topic edited successfully",
      backToAll: "&larr; All Discussions",
    },
    notFound: {
      title: "No Topics",
      subTitle: "Couldn't find any forum topics.",
    },
    layout: {
      index: ["topicIndex"],
      single: ["topicSingle"],
    },
    categories: [
      {
        value: "support",
      },
      {
        value: "plugins",
      },
      {
        value: "themes",
      },
      {
        value: "feedback",
      },
      {
        value: "performance",
      },
      {
        value: "integrations",
      },
      {
        value: "off-topic",
        icon: "far fa-star",
      },
    ],
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
