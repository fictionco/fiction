declare module "destroyer"
declare module "http" {
  interface Server {
    destroy: () => {}
  }
}
