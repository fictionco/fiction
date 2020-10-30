export default {
  app: {
    components: {
      site: (): Promise<any> => import("./site.vue"),
    },
  },
  core: {
    components: {
      dashboardBtn: (): Promise<any> => import("./ui/dashboard/btn.vue"),
      btnBase: (): Promise<any> => import("./ui/el/btn-base.vue"),
    },
    forms: {
      factorInputWrap: (): Promise<any> => import("./ui/form/wrap-input.vue"),
      factorInputText: (): Promise<any> => import("./ui/form/text.vue"),
      factorInputEmail: (): Promise<any> => import("./ui/form/email.vue"),
      factorInputPassword: (): Promise<any> => import("./ui/form/password.vue"),
      factorInputTextarea: (): Promise<any> => import("./ui/form/textarea.vue"),
      factorInputSelect: (): Promise<any> => import("./ui/form/select.vue"),
      factorInputBirthday: (): Promise<any> => import("./ui/form/birthday.vue"),
      factorInputDate: (): Promise<any> => import("./ui/form/date.vue"),
      factorInputTags: (): Promise<any> => import("./ui/form/tags.vue"),
    },
    dashboard: {
      dashboardInput: (): Promise<any> => import("./ui/dashboard/input.vue"),
      dashboardListControls: (): Promise<any> =>
        import("./ui/dashboard/list-controls.vue"),
    },
  },
}
