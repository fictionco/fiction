export default {
  inputWrap: (): Promise<any> => import("./input-wrap.vue"),
  inputEditor: (): Promise<any> => import("./input-editor.vue"),
  inputImageUpload: (): Promise<any> => import("./input-image-upload.vue"),
  inputSortable: (): Promise<any> => import("./input-sortable.vue"),
}
