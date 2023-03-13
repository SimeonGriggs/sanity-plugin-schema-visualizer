export function titleCase(str: string): string {
  return str
    ? str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
    : str
}
