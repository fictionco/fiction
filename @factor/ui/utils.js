import { DOM } from "@factor/tools"
export function fluidInput(e, wrapEl) {
  const NewEvent = DOM.Event("keydown")
  NewEvent.which = e.keyCode

  const inp = DOM(e.target)
  const inputs = DOM(wrapEl).find(":input")
  if (inputs.length == 0) {
    console.warn("No inputs found for input.")
  }
  const currentIndex = inputs.index(e.target)
  const placeholderLength = inp.attr("placeholder").length
  const value = inp.val()
  const valueLength = value.length

  if (e.type == "keydown") {
    const isCharKey = e.key.length == 1 ? true : false

    if (valueLength >= placeholderLength && isCharKey) {
      inp.val(value.slice(0, -1))
    }
    // At first position and delete or move left
    else if (
      e.target.selectionStart == 0 &&
      (e.key == "Backspace" || e.key == "ArrowLeft") &&
      currentIndex != 0
    ) {
      inputs
        .eq(currentIndex + -1)
        .focus()
        .trigger(NewEvent)
    }
    // At end position and move right
    else if (
      e.target.selectionStart == valueLength &&
      e.key == "ArrowRight" &&
      currentIndex != inputs.length
    ) {
      inputs
        .eq(currentIndex + 1)
        .focus()
        .trigger(NewEvent)
    }
  } else if (e.type == "input") {
    // After key, if input is at lenght, move to next
    if (valueLength >= placeholderLength) {
      inputs.eq(currentIndex + 1).focus()
    }
  }
}
