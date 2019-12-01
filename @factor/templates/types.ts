import { Component } from "vue"

export interface TemplateConfig {
  name?: string;
  _id: string;
  component: () => Promise<Component>;
  fields?: TemplateOption[];
}

export interface TemplateOption {
  input?: string;
  label?: string;
  _id?: string;
  default?: string;
  description?: string;
  settings?: TemplateOption[];
}
