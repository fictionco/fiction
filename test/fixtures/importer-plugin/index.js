import ClientClass from "./client-class"
import AnotherClass from "./another-class"

export { AnotherClass }

export function install() {
  new ClientClass()
}

export default () => {
  return {
    foo: "bar"
  }
}
