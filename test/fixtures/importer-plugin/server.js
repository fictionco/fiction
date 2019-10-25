import ServerClass from "./server-class"
import AnotherClass from "./another-class"

export function install() {
  new ServerClass()
}

export function anotherExport() {
  return new AnotherClass()
}

export default () => {
  return {
    data: "yes"
  }
}
