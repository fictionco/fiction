<template>
  <div class="profile-menu">
    <span
      class="profile-menu-toggle"
      data-test="profile-menu-toggle"
      :class="toggle ? 'active' : 'inactive'"
      @click.stop="setToggle($event)"
    >
      <div v-if="showName" class="display-name">{{ post.displayName }}</div>
      <factor-avatar width="1.75em" :post-id="$currentUser.avatar" />
    </span>
    <transition name="leftfade">
      <div v-if="toggle" class="profile-menu-nav" @click.stop>
        <div class="nav-pad">
          <div class="user-basics">
            <factor-avatar v-if="$userId" :post-id="$currentUser.avatar" width="2.5em" />
            <div class="content" :data-uid="$user._id()">
              <div class="name">{{ $user._item("displayName") || $user._item("email") }}</div>
              <div v-if="role.title" class="privs">
                <span class="status">{{ $utils.toLabel(role.title) }}</span>
              </div>
            </div>
          </div>

          <div class="profile-nav-items">
            <div v-for="(group, groupIndex) in profileMenu" :key="groupIndex" class="list-group">
              <div v-if="group.title" class="list-group-title">{{ group.title }}</div>

              <factor-link
                v-for="(item, i) in group.items"
                :key="i"
                :path="item.path"
                :query="item.query"
                :data-test="`profile-nav-${item.key}`"
                @click="itemClick(item)"
              >{{ item.name }}</factor-link>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  props: {
    showName: { type: Boolean, default: false }
  },
  data() {
    return {
      toggle: false,
      profileMenu: []
    }
  },
  computed: {
    post() {
      return this.$store.val(this.$userId) || {}
    },
    role() {
      return this.$user._item("role") || {}
    }
  },
  created() {
    const menuStructure = this.$filters.apply("profile-menu", [
      {
        items: [
          {
            path: "/dashboard/account",
            name: "Account Settings"
          },
          {
            key: "logout",
            click: () => this.$user.logout(),
            name: "Logout"
          }
        ]
      }
    ])

    this.$set(this, "profileMenu", menuStructure)
  },
  mounted() {
    this.$events.$on("reset-ui", () => {
      this.clickHandler()
    })
  },
  methods: {
    itemClick(item) {
      if (typeof item.click == "function") {
        item.click()
      }

      this.clickHandler()
    },
    clickHandler(e) {
      if (this.toggle) {
        this.toggle = false
        document.removeEventListener("click", this.clickHandler, false)
      }
    },
    setToggle(e) {
      if (!this.$userId) {
        this.$events.$emit("signin-modal")
        return ""
      }

      if (!this.toggle) {
        this.toggle = true
        document.addEventListener("click", this.clickHandler, false)
      } else {
        this.toggle = false
        document.removeEventListener("click", this.clickHandler, false)
      }
    }
  }
}
</script>
<style lang="less">
.profile-menu-toggle {
  display: flex;
  align-items: center;
  color: inherit;
  .display-name {
    margin-right: 0.7em;
  }
  &.active {
    opacity: 0.5;
  }
  cursor: pointer;
  .icon {
    margin-left: 10px;
    opacity: 0.4;
    margin-right: 3px;
  }
  &:hover .fa {
    opacity: 0.5;
  }
  .avatar {
    position: relative;
    //  border: 1px solid rgba(0, 0, 0, 0.5);
    border-radius: 50%;
  }
  .account-image {
    display: block;
    padding-right: 0.8em;
    padding-left: 0.8em;

    img {
      width: 40px;
      border-radius: 50%;
      display: block;
      border: 5px solid #fff;
    }
  }
}

.profile-menu {
  position: relative;
}
.profile-menu-nav {
  position: absolute;
  right: -5px;
  top: 120%;
  z-index: 1000;
  box-shadow: 0px 0px 0px 1px rgba(136, 152, 170, 0.1),
    0px 15px 35px 0px rgba(49, 49, 93, 0.1),
    0px 5px 15px 0px rgba(0, 0, 0, 0.08);
  min-width: 250px;
  background: #fff;
  border-radius: 5px;
  user-select: none;
  .nav-pad {
    font-size: 0.9em;
    letter-spacing: -0.02em;
    .user-basics {
      padding: 1em;
      display: flex;
      align-items: center;

      .name {
        font-size: 1.2em;
        white-space: nowrap;
      }
      .privs {
        font-weight: 500;
        opacity: 0.4;
      }
      .avatar {
        margin-right: 1em;
      }
    }
    .list-group {
      padding: 1em;
      border-top: 1px solid rgba(0, 0, 0, 0.06);
      font-weight: 500;
    }
    .list-group-title {
      text-transform: uppercase;
      opacity: 0.2;
    }
    .factor-link {
      padding: 3px 0;
      white-space: nowrap;
      display: block;
      color: inherit;

      &:hover {
        color: var(--color-primary);
        cursor: pointer;
      }
    }
  }
  .list-sep {
    border-top: solid 1px rgba(0, 0, 0, 0.05);
    margin-top: 10px;
    margin-bottom: 10px;
    padding-bottom: 0;
    padding-top: 0;
  }
}
@media screen and (max-width: 767px) {
  .profile-menu-nav {
    border-radius: 0;
    width: 100%;
    right: 0;
    top: 45px;
    font-size: 1.4em;
    // height: calc(~"100vh - 45px");
    padding: 0;

    .nav-pad {
      .user-basics {
        .name {
          font-size: 1em;
          white-space: normal;
        }
      }
    }

    .list-item {
      a {
        padding: 0.5em 1.5em;
      }
    }
  }
}
</style>