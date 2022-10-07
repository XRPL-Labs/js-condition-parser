declare module "condition-flags-parser" {
  export function validate(condition: string, throwException: boolean): boolean
  export function flags(condition: string): string[]
  export function apply(condition: string, flags: string[]): boolean
}
