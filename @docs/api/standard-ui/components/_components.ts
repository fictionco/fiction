export default {
  spinner: (): Promise<any> => import("./spinner.vue"),
  link: (): Promise<any> => import("./link.vue"),
  modal: (): Promise<any> => import("./modal.vue"),
  btn: (): Promise<any> => import("./btn.vue"),
  avatar: (): Promise<any> => import("./avatar.vue"),
  icon: (): Promise<any> => import("./icon.vue"),
  lightbox: (): Promise<any> => import("./lightbox.vue"),
}
