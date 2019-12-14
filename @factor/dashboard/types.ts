import { Component } from "vue"

export interface DashboardMenuItem {
  group?: string;
  path: string;
  name?: string;
  icon?: string;
  items?: DashboardMenuItem[];
  priority?: number;
}

export interface EditPanel {
  postType?: string[];
  name: string;
  component: Promise<Component>;
}
