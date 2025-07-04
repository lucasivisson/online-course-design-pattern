export function isValidObjectId(id?: string): boolean {
  if (!id) return true;
  return /^[a-f\d]{24}$/i.test(id);
}
