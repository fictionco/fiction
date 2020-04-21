export default {
  inputWrap: (): Promise<any> => import("./input-wrap.vue"),
  inputEditor: (): Promise<any> => import("./input-editor.vue"),
  inputImageUpload: (): Promise<any> => import("./input-image-upload.vue"),
  inputSortable: (): Promise<any> => import("./input-sortable.vue"),
  inputTags: (): Promise<any> => import("./input-tags.vue"),
  inputSelect: (): Promise<any> => import("./input-select.vue"),
  inputDate: (): Promise<any> => import("./input-date.vue"),
  inputText: (): Promise<any> => import("./input-text.vue"),
  inputCheckbox: (): Promise<any> => import("./input-checkbox.vue"),
  inputBirthday: (): Promise<any> => import("./input-birthday.vue"),
}
