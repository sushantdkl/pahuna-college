export function isObjectId(value?: string | null) {
  return Boolean(value && /^[a-f\d]{24}$/i.test(value));
}
