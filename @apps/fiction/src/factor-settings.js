module.exports.default = Factor => {
  return {
    emailList: {
      alphaProgram: {
        tags: ["fiction-com"],
        emails: {
          confirm: {
            successMessage:
              "Your email is confirmed. Please your email for next steps (no email? check spam).",
            subject: "Factor Alpha Program: Email confirmation",
            text: `We're glad you've requested access to the Alpha program. Just one more step, please confirm your email.`
          },
          complete: {
            subject: "Success! Next steps...",
            text: `<p>Glad you joined up!</p><p>Stay tuned, we'll be in touch in a few days about your invite to the Factor developer program. In the meantime, hit me up at this email if you have any questions.</p>`,
            from: "Andrew Powers <andrew@fiction.com>"
          },
          notify: {
            subject: "New Confirmed Email",
            text: "A new email was added to a list.",
            to: "Andrew Powers <andrew@fiction.com>"
          }
        },
        form: {
          buttonText: "Request Invite &rarr;"
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
