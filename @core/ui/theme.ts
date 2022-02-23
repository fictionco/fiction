export type InputColorTheme = "standard" | "overlay"
export const inputTheme = (theme: InputColorTheme = "standard"): string => {
  if (theme == "overlay") {
    return "border-white placeholder:text-white placeholder:text-opacity-50 bg-black bg-opacity-10 focus:ring-white focus:border-white disabled:bg-opacity-10 disabled:bg-white"
  } else {
    return "border-slate-400 placeholder:text-slate-400 focus:ring-primary-500 focus:border-primary-500  disabled:text-slate-500 disabled:bg-slate-50"
  }
}
