import { Component } from "vue"

export default {
  forum: {
    indexRoute: "/forum",
    postRoute: "/topic",
    indexLimit: 30,
    returnLinkText: "All Topics",
    features: {
      topicSubscribe: true,
      tagging: true
    },
    metatags: {
      index: {
        title: "Factor Forum",
        description: "Help and discussion about Factor JS"
      },
      newTopic: {
        title: "New Topic",
        description: "Start a new topic discussion on the forum"
      },
      editTopic: {
        title: "Edit Topic",
        description: "Edit a forum topic"
      }
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
      backToAll: "&larr; All Discussions"
    },
    notFound: {
      title: "No Topics",
      subTitle: "Couldn't find any forum topics."
    },
    layout: {
      index: ["topicIndex"],
      single: ["topicSingle"]
    },
    categories: [
      {
        value: "support"
      },
      {
        value: "plugins"
      },
      {
        value: "themes"
      },
      {
        value: "feedback"
      },
      {
        value: "performance"
      },
      {
        value: "integrations"
      },
      {
        value: "off-topic",
        icon: "far fa-star"
      }
    ],
    components: {
      forumSidebar: (): Promise<Component> => import("./forum-sidebar.vue"),
      forumIndex: (): Promise<Component> => import("./forum-index.vue"),
      forumWrap: (): Promise<Component> => import("./forum-wrap.vue"),
      topicList: (): Promise<Component> => import("./topic-list.vue"),
      topicSingle: (): Promise<Component> => import("./topic-single.vue"),
      topicPost: (): Promise<Component> => import("./topic-post.vue"),
      topicReply: (): Promise<Component> => import("./topic-reply.vue"),
      topicActions: (): Promise<Component> => import("./el/topic-actions.vue"),
      topicTags: (): Promise<Component> => import("./el/topic-tags.vue"),
      topicAuthor: (): Promise<Component> => import("./el/topic-post-author.vue"),
      topicEdit: (): Promise<Component> => import("./topic-edit.vue"),
      navBack: (): Promise<Component> => import("./el/nav-back.vue"),
      topicPagination: (): Promise<Component> => import("./el/topic-pagination.vue"),
      customIcons: (): Promise<Component> => import("./el/nav-icon.vue")
    }
  }
}
