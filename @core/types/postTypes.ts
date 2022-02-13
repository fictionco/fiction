import { Component } from "vue"
import { ListItem } from "./utils"
import { TemplateSetting } from "./templates"

export interface PostTypeConfig {
  baseRoute?: string
  postType: string
  icon?: string
  nameIndex?: string
  nameSingle?: string
  namePlural?: string
  listTemplate?: Component
  editTemplate?: Component
  noAddNew?: boolean
  addNewText?: string
  accessLevel?: number
  managePosts?: boolean // manage in dashboard
  hideAdmin?: boolean
  categories?: ListItem[]
  customPermalink?: true | string
  permalink?: (p: any) => string
  templateSettings?: TemplateSetting[]
  addSitemap?: true
}
