module.exports.default = Factor => {
  return {
    emailList: {
      alphaProgram: {
        emails: {
          confirm: {
            successMessage: "Your email is confirmed. Check your email for next steps.",
            subject: "Factor Alpha Program: Email confirmation",
            text: `We're glad you've requested access to the Alpha program. Just one more step, please confirm your email.`
          },
          complete: {
            subject: "Success! Next steps...",
            text: `<p>Currently the Alpha Program includes a developer Slack channel and optional weekly meetings.</p>
              <p>We are happy to have you when the time is right. The current priority is working with people looking to actively build with Factor.</p>
              <p>That you? Great. Can you tell me what you're looking to build or experiment with? (reply to email)</p>`,
            from: "Andrew Powers <andrew@fiction.com>"
          },
          notify: {
            subject: "New Confirmed Email",
            text: "A new email was added to a list.",
            to: "Andrew Powers <andrew@fiction.com>"
          }
        }
      }
    },

    contactForm: {
      email: "andrew@fiction.com",
      confirm: {
        title: "Got your message.",
        subTitle: "We'll take a look and be in touch as soon as possible."
      }
    },
    blog: {
      indexRoute: "/blog",
      postRoute: "/entry",
      limit: 6,
      returnLinkText: "Back",
      components: {
        blogWrap: () => import("./blog/blog-wrap.vue"),
        blogIndex: () => import("./blog/blog-index.vue"),
        blogSingle: () => import("./blog/blog-single.vue"),
        blogFeaturedImage: () => import("./blog/el-featured-image.vue"),
        blogHeaders: () => import("./blog/el-headers.vue"),
        blogReturnLink: () => import("./blog/el-return-link.vue"),
        blogExcerpt: () => import("./blog/el-excerpt.vue"),
        blogMeta: () => import("./blog/el-meta.vue")
      },
      layout: {
        index: ["blogFeaturedImage", "blogHeaders", "blogExcerpt", "blogMeta"],
        single: [
          "blogHeaders",
          "blogFeaturedImage",
          "blogMeta",
          "entry",
          "social",
          "authorBio"
        ],
        meta: ["authorDate", "tags"]
      }
    },
    jobs: {
      indexRoute: "/careers",
      postRoute: "/careers",
      limit: 5,
      metatags: {
        index: {
          title: "Fiction Careers - Building Apps, Code, Remote Work",
          description: "Fiction Careers."
        }
      },
      components: {
        jobsContent: () => import("./jobs/content.vue"),
        jobsIndex: () => import("./jobs/index.vue"),
        jobsSingle: () => import("./jobs/single.vue")
      }
    }
  }
}
