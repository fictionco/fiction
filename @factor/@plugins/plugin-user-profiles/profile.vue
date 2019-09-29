<template>
  <div class="view-user-profile">
    <factor-loading-ring v-if="loading" class="client-loading" />
    <div v-else-if="!$lodash.isEmpty(post)" class="user-profile">
      <div class="profile-container">
        <figure class="cover loaded" :class="getCover ? 'has-cover' : 'no-cover'">
          <div
            :style="{'background-image': primaryCover }"
            class="cover-image"
            @click="lightbox(covers)"
          />
        </figure>

        <div class="profile-content">
          <div class="profile-avatar">
            <div class="profile-pics">
              <div
                :style="{'background-image': primaryAvatar}"
                class="pic"
                @click="lightbox(avatars)"
              />
            </div>
          </div>

          <div class="profile-header">
            <h1
              v-if="post.displayName"
              class="title"
              data-test="display-name"
            >{{ post.displayName }}</h1>
            <div v-if="memberSince" class="sub-title">{{ `Joined ${memberSince}` }}</div>
            <div class="actions">
              <factor-link
                v-if="post.uid == $userId"
                path="/dashboard/account"
                btn="primary"
              >Edit Your Profile</factor-link>
            </div>
          </div>
          <div class="profile-grid">
            <div class="panel">
              <div class="title">Bio</div>
              <div v-if="post.bio" v-formatted-text="post.bio" class="profile-bio" />
              <div v-else>Nothing added yet...</div>
            </div>
            <div class="panel verifications">
              <div class="title">Verified Info</div>
              <div class="content">
                <ul>
                  <li v-if="verified.identity" class="identity">
                    <factor-icon icon="check" />
                    <span>Identity Confirmed</span>
                  </li>
                  <li v-if="verified.bank" class="bank">
                    <factor-icon icon="check" />
                    <span>Bank Verified</span>
                  </li>
                  <li v-if="verified.phone" class="phone">
                    <factor-icon icon="check" />
                    <span>Phone Verified</span>
                  </li>
                  <li v-if="verified.email" class="email">
                    <factor-icon icon="check" />
                    <span>Email Verified</span>
                  </li>
                </ul>
                <factor-link
                  v-if="post.uid == $userId"
                  btn="default"
                  path="/dashboard/account"
                >Verify Your Info</factor-link>
              </div>
            </div>
          </div>
        </div>

        <factor-lightbox :visible.sync="lightboxShow" :imgs="lightboxImages" />
      </div>
    </div>
    <error-404 v-else />
  </div>
</template>
<script>
export default {
  metaInfo() {
    if (this.post && this.post.displayName) {
      return {
        title: `${this.post.displayName} Profile`,
        description: `Stay connected with ${this.post.displayName} on Fiction.`
      }
    } else {
      return {
        title: `Your Fiction Profile`,
        description: `Create your travel profile on Fiction.com`
      }
    }
  },
  data() {
    return {
      lightboxShow: false,
      lightboxImages: [],
      loading: false
    }
  },
  computed: {
    post() {
      return this.$store.getters["getItem"]("post") || {}
    },
    avatars() {
      const p = this.post
      const imgs = p.images || []

      return imgs
    },
    covers() {
      return this.post.photosCover || {}
    },
    verified() {
      return this.post.serviceId || {}
    },
    profileUid() {
      const { uid } = this.$route.query
      return uid ? uid : this.$userId || false
    },

    memberSince() {
      const { createdAt } = this.post
      return createdAt ? this.$time.niceFormat(createdAt) : ""
    },
    getCover() {
      const imgs = this.covers
      return imgs.length > 0 && imgs[0] ? imgs[0].url : ""
    },
    primaryCover: function() {
      return this.getCover ? `url(${this.getCover})` : ""
    },
    primaryAvatar: function() {
      const imgs = this.avatars

      const url = imgs.length > 0 && imgs[0] ? imgs[0].url : require("./user.svg")
      return `url(${url})`
    }
  },
  created() {
    // If no query info set, then show loading until logged in member can be loaded
    const { username } = this.$route.params
    const { id } = this.$route.query
    if (!id && !username) {
      this.loading = true
    }
  },
  mounted() {
    //Check for empty UID value, if logged in then show logged in user's profile
    this.setOwnUserProfile()
  },
  methods: {
    setOwnUserProfile() {
      const { username } = this.$route.params
      const { id } = this.$route.query

      if (!username && !id && this.$lodash.isEmpty(this.post)) {
        this.loading = true

        this.$user.init(async uid => {
          if (uid) {
            const post = await this.$post.getSinglePost({
              _id: uid,
              postType: "user"
            })

            await this.$post.setPostData({ post })
          }
          this.loading = false
        })
      } else {
        this.loading = false
      }
    },
    lightbox(images) {
      this.lightboxImages = images
      this.lightboxShow = true
    },
    setPhoto(v, key) {
      var img = new Image()
      img.addEventListener("load", () => {
        this.$set(this, key, v)
      })
      img.src = v
    }
  }
}
</script>
<style lang="less">
.client-loading {
  height: 80vh;
}
.profile-container {
  .profile-content {
    max-width: 700px;
    margin: 0 auto;
    .profile-header {
      text-align: center;
      .title {
        font-size: 3em;
        @media (max-width: 767px) {
          font-size: 2em;
        }
      }
      .sub-title {
        font-size: 1.5em;
        font-weight: 500;
        @media (max-width: 767px) {
          font-size: 1.2em;
        }
      }
      .actions {
        margin-top: 1em;
      }
    }
  }

  .profile-grid {
    font-weight: 500;
    margin: 3em 0;
    display: grid;

    padding: 2em;
    border-radius: 4px;
    background: #fff;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.04), 0 6px 14px 0 rgba(24, 32, 41, 0.06),
      0 12px 34px 0 rgba(24, 32, 41, 0.04);
    .panel {
      line-height: 1.6;
      font-size: 1.2em;
      margin-bottom: 2em;
      &:last-child {
        margin-bottom: 0;
      }
      .verifications li i {
        margin-right: 0.5em;
      }
    }
    @media (max-width: 767px) {
      margin: 2em 1em;
      grid-template-columns: 1fr;
      grid-gap: 2em 0;
    }
    .title {
      font-weight: 600;
      margin-bottom: 0.5em;
      font-size: 1.3em;
      opacity: 0.3;
    }
    ul {
      list-style-type: none;
      margin: 1em 0 2em;
      padding: 0;
      .fa {
        color: #ff0076;
      }
    }
  }
  .cover {
    width: 100%;
    height: 45vh;
    max-height: 500px;
    background-size: 400%;
    position: relative;
    transition: all 0.2s;
    overflow: hidden;

    &.no-cover {
      height: 11em;
    }
    .cover-image,
    &:after {
      opacity: 0;
      transition: opacity 1s;
    }
    &.loaded {
      .cover-image,
      &:after {
        opacity: 1;
      }
    }
    .cover-image {
      position: absolute;
      height: 100%;
      width: 100%;
      background-color: transparent;
      background-size: cover;
      background-position: 50%;
      bottom: 0;
      left: 0;
    }

    &.has-cover:hover {
      opacity: 0.9;
      cursor: pointer;
    }
    &:active {
      opacity: 0.8;
      transition: all 0.05s;
      box-shadow: 0 1px 15px rgba(0, 0, 0, 0.3);
    }
  }
  .profile-pics {
    position: relative;
    width: 200px;
    margin: -7em auto 1em;

    .pic {
      background-color: #fff;
      background-size: cover;
      background-position: 50% 60%;
      padding: 50% 0;
      border-radius: 50%;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1), 0 3px 10px rgba(0, 0, 0, 0.07);
      border: 1px solid #fff;
      transition: all 0.2s;
      &:hover {
        transform: translateY(-2px);
        cursor: pointer;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 3px 10px rgba(0, 0, 0, 0.07);
      }
    }
  }
}
</style>
