export function requireParam(
  value: string | string[] | undefined,
  name = "id"
): string {
  if (!value || Array.isArray(value)) {
    throw new Error(`Invalid ${name}`);
  }
  return value;
}
