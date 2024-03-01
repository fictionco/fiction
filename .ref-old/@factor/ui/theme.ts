export const inputClasses = (feature: "box") => {
  const out: string[] = []

  if (feature == "box") {
    out.push("text-input-size bg-theme-100 hover:bg-theme-200 border-theme-300")
  }

  return out
}

export const textInputClasses = () => {
  const out = [
    "block",
    "w-full",
    "appearance-none",
    "outline-none",
    "focus:outline-none",
    // "focus:shadow-input-focus",
    "focus:border-input-border-alt",
    "disabled:cursor-not-allowed",
    "disabled:opacity-70",
    "resize-none",
    "focus:ring-input-ring",
    "focus:ring-input-color",
    "rounded-input",
    "px-input-x",
    "py-input-y",
    "text-input-size",
    // "shadow-input",
    // "hover:shadow-input-focus",
    "border-input-border",
    "placeholder:text-input-placeholder",
    "bg-input-bg",
    "text-input-text",
    "max-w-input",
  ]

  return out
}
