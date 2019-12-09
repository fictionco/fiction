import DOM from "jquery"
import log from "@factor/api/logger"
export const fluidInput = (e: KeyboardEvent, wrapEl: HTMLElement): void => {
  const NewEvent = DOM.Event("keydown")
  NewEvent.which = e.keyCode

  const target = e.target as HTMLInputElement

  const currentInput = DOM(target)
  const allInputs = DOM(wrapEl).find(":input")

  if (allInputs.length == 0) {
    log.warn("No inputs found for input.")
  }

  const currentIndex = allInputs.index(target)
  const placeholder = currentInput.attr("placeholder")
  const placeholderLength = placeholder ? placeholder.length : 0
  let value = currentInput.val()

  if (!value) return
  value = typeof value === "number" ? value.toString() : value

  const valueLength = value && typeof value !== "number" ? value.length : 0

  if (e.type == "keydown") {
    const isCharKey = e.key.length == 1 ? true : false

    if (valueLength >= placeholderLength && isCharKey) {
      currentInput.val(value.slice(0, -1))
    }
    // At first position and delete or move left
    else if (
      target.selectionStart == 0 &&
      (e.key == "Backspace" || e.key == "ArrowLeft") &&
      currentIndex != 0
    ) {
      allInputs
        .eq(currentIndex + -1)
        .focus()
        .trigger(NewEvent)
    }
    // At end position and move right
    else if (
      target.selectionStart == valueLength &&
      e.key == "ArrowRight" &&
      currentIndex != allInputs.length
    ) {
      allInputs
        .eq(currentIndex + 1)
        .focus()
        .trigger(NewEvent)
    }
  } else if (e.type == "input") {
    // After key, if input is at length, move to next
    if (valueLength >= placeholderLength) {
      allInputs.eq(currentIndex + 1).focus()
    }
  }
}
