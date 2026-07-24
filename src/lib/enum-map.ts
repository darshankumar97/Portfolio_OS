// Prisma enum values are underscore_case (valid DB identifiers); the app-facing
// TS types keep the original hyphen-case values so no UI code has to change.
export function dbEnumToApp<T extends string>(value: string): T {
  return value.replace(/_/g, "-") as T;
}

export function appEnumToDb<T extends string>(value: string): T {
  return value.replace(/-/g, "_") as T;
}
