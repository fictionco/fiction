module.exports.default = Factor => {
  return {
    emailList: {
      customLists: {
        alphaProgram: {
          emails: {
            confirm: {
              subject: "Factor Alpha Program: Follow up and email confirmation",
              text: `Hey there, <p>We're glad you've requested access to the alpha program.</p> 
                  <p>
                    Currently the program just involves you using Factor to build something awesome.
                    Then giving us feedback to make it 100% production ready.
                  </p>
                  <p>Can you tell me what you're looking to build or experiment with? (reply to email)</p>`,
              linkText: "Confirm Email",
              from: "Andrew Powers <andrew@fiction.com>"
            },
            verified: {
              subject: "Success! Email is confirmed.",
              text: `Your email is confirmed. 
                Please feel free to reply to this email with any information on what you'd like to do with Factor.`,
              from: "Andrew Powers <andrew@fiction.com>"
            },
            notify: {
              subject: "New Confirmed Email",
              text: "A new email was added to a list.",
              to: "Andrew Powers <andrew@fiction.com>"
            }
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
