export const textInputClasses = (mode: "standard" | "basic" = "standard") => {
  const out = [
    "block",
    "w-full",
    "appearance-none",
    "rounded-md",
    "border",
    "px-input-x",
    "py-input-y",
    "text-input-size",
    "bg-input-base",
    "focus:outline-none",
    "disabled:cursor-not-allowed",
    "border-input-edge",
    "placeholder:text-input-placeholder",
    "focus:ring-input-primary",
    "focus:border-input-primary",
    "disabled:opacity-70",
  ]
  if (mode == "standard") {
    out.push("max-w-sm")
  }
  return out
}
