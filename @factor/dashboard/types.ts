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

export interface PostListDataItem {
  label: string;
  value: string | number;
  path?: string;
}

export interface ControlAction {
  value: string;
  label?: string;
  condition?: (q: { [key: string]: string }) => boolean;
  confirm?: (q: string[]) => string;
  default?: true;
}
