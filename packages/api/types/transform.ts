import { Component } from "vue"
export interface MarkdownFile {
  html: string
  VueComponent: Component
  VueComponentWith: (c: Record<string, Component>) => Component
  attributes: {
    title: string
    description: string
    image?: string
    author: string
    authorUrl?: string
    email: string
  }
}
