export interface DashboardMenuItem {
  group?: string;
  path: string;
  name?: string;
  icon?: string;
  items?: DashboardMenuItem[];
  priority?: number;
}
