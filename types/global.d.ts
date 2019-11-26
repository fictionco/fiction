declare module "*.png"
declare module "*.jpg"
declare module "*.json"
declare module "*.svg"
declare module "*.vue"
declare module "*.css"
declare module "*.md"
declare module "*package"
declare module "jest"

interface Window {
  __INITIAL_STATE__: any;
  factorReady: boolean;
  factorApp: Record<string, any>;
  Prism: any;
}
