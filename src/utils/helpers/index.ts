export function isEmpty(obj: any): boolean {
  if (obj === null || obj === undefined) return true;

  if (typeof obj !== "object") return false;

  return Object.values(obj).every((value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === "string") return value.trim() === "";
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "object") return Object.keys(value).length === 0;

    return false; // numbers, booleans, etc. are NOT empty
  });
}
