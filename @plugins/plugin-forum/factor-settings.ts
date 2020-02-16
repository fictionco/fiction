import { Component } from "vue"

export default {
  forum: {
    indexRoute: "/forum",
    postRoute: "/topic",
    indexLimit: 30,
    returnLinkText: "All Topics",
    metatags: {
      index: {
        title: "Factor Forum",
        description: "Fiction forum topics."
      }
    },
    notFound: {
      title: "No Topics",
      subTitle: "Couldn't find any forum topics."
    },
    layout: {
      index: ["topicIndex"],
      single: ["topicSingle"]
    },
    categories: ["general", "support", "off-topic"],
    components: {
      forumSidebar: (): Promise<Component> => import("./forum-sidebar.vue"),
      forumIndex: (): Promise<Component> => import("./forum-index.vue"),
      forumWrap: (): Promise<Component> => import("./forum-wrap.vue"),
      topicList: (): Promise<Component> => import("./topic-list.vue"),
      topicSingle: (): Promise<Component> => import("./topic-single.vue"),
      topicPost: (): Promise<Component> => import("./topic-post.vue"),
      topicReply: (): Promise<Component> => import("./topic-reply.vue"),
      topicNumberPosts: (): Promise<Component> => import("./el/topic-number-posts.vue"),
      topicActions: (): Promise<Component> => import("./el/topic-actions.vue"),
      topicTags: (): Promise<Component> => import("./el/topic-tags.vue"),
      topicAuthor: (): Promise<Component> => import("./el/topic-post-author.vue"),
      topicTimeAgo: (): Promise<Component> => import("./el/topic-time-ago.vue"),
      topicEdit: (): Promise<Component> => import("./topic-edit.vue"),
      navBack: (): Promise<Component> => import("./el/nav-back.vue")
    }
  }
}
