// Recursive type that widens literal strings to `string` while keeping the object shape
type DeepWiden<T> = T extends readonly (infer U)[]
  ? DeepWiden<U>[]
  : T extends Record<string, unknown>
    ? { -readonly [K in keyof T]: DeepWiden<T[K]> }
    : T extends string
      ? string
      : T

export type Dictionary = DeepWiden<typeof import('./es').es>

export { es } from './es'
export { en } from './en'
