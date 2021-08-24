// import { dLog } from "@factor/api"

// export const fluidInput = (e: KeyboardEvent, wrapEl: HTMLElement): void => {
//   const NewEvent = DOM.Event("keydown")
//   NewEvent.which = e.keyCode

//   const target = e.target as HTMLInputElement

//   const currentInput = target
//   const allInputs = wrapEl.querySelectorAll(":input")

//   if (allInputs.length === 0) {
//     dLog("warn", "no inputs found for fluid input.")
//   }
//   const nodeArray = Array.prototype.slice.call(allInputs)
//   const currentIndex = nodeArray.indexOf(target)
//   const placeholder = currentInput.getAttribute("placeholder")
//   const placeholderLength = placeholder ? placeholder.length : 0
//   const value = currentInput.value

//   if (!value) return

//   const valueLength = value && typeof value !== "number" ? value.length : 0

//   if (e.type == "keydown") {
//     const isCharKey = e.key.length == 1 ? true : false

//     if (valueLength >= placeholderLength && isCharKey) {
//       currentInput.val(value.slice(0, -1))
//     }
//     // At first position and delete or move left
//     else if (
//       target.selectionStart == 0 &&
//       (e.key == "Backspace" || e.key == "ArrowLeft") &&
//       currentIndex != 0
//     ) {
//       allInputs
//         .eq(currentIndex + -1)
//         .focus()
//         .trigger(NewEvent)
//     }
//     // At end position and move right
//     else if (
//       target.selectionStart == valueLength &&
//       e.key == "ArrowRight" &&
//       currentIndex != allInputs.length
//     ) {
//       allInputs
//         .eq(currentIndex + 1)
//         .focus()
//         .trigger(NewEvent)
//     }
//   } else if (e.type == "input" && valueLength >= placeholderLength) {
//     allInputs.eq(currentIndex + 1).focus()
//   }
// }
