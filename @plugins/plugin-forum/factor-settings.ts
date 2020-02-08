import { Component } from "vue"

export default {
  forum: {
    indexRoute: "/forum",
    postRoute: "/topic",
    limit: 10,
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
    components: {
      forumSidebar: (): Promise<Component> => import("./forum-sidebar.vue"),
      forumWrap: (): Promise<Component> => import("./forum-wrap.vue"),
      topicIndex: (): Promise<Component> => import("./topic-index.vue"),
      topicSingle: (): Promise<Component> => import("./topic-single.vue"),
      topicReply: (): Promise<Component> => import("./topic-reply.vue"),
      topicNumberPosts: (): Promise<Component> => import("./el/topic-number-posts.vue"),
      topicTags: (): Promise<Component> => import("./el/topic-tags.vue"),
      topicAuthor: (): Promise<Component> => import("./el/topic-post-author.vue"),
      topicTimeAgo: (): Promise<Component> => import("./el/topic-time-ago.vue"),
      topicNew: (): Promise<Component> => import("./topic-new.vue"),
      navBack: (): Promise<Component> => import("./el/nav-back.vue")
    }
  }
}
