export function nameInitials(st: string) {
  return st
    .split(" ")
    .slice(0, 2)
    .map((s) => s.charAt(0).toUpperCase())
    .join("")
}
