# JS Condition Parser

Parse/Apply JS-like condition expressions on an object of flags.

### Purpose

Easily apply a JS logic condition string based on an array of flags. E.g.: bunch of flags (traits)
of a user fetched from a fast backend (e.g. redis). Requested entity requires a bunch of flags
with some logic (and, or, threshold) to apply.

##### Sample flags:
```
[
    'countryFlag:NL',
    'languageFlag:EN',
    'proUser'
]
```

##### Sample condition (logic):

```
proUser && (countryFlag:NL || languageFlag:NL)
```

##### Threshold example (two out of three):

```
proUser + countryFlag:NL + languageFlag:NL + !optedOut > 2
```

### Support/requirements

##### Syntax

- Parenthesis is supported
- Valid operators (logic):
  - `&&` (and)
  - `||` (or)
- Valid threshold operators:
  - `+` (add)
  - `-` (subtract)
- Valid comparison operators (for thresholds):
  - `>` (gt)
  - `<` (lt)
- Invert
  - `!` (not, e.g. flag _does not_ apply, `!someFlag`)

##### Flags

- Flags can contain these characters:
  - `a-z`
  - `A-Z`
  - `0-9`
  - `_` (underscore)
  - `:` (colon)
  - `.` (dot)
- Flags _must_ start with `a-z` or `A-Z`.
- Flags should be present in the condition in plain texts (so no quotes surrounding them)
- Flags are case sensitive

### Use

```javascript
import { validate, flags, apply } from 'condition-flags-parser'

const condition = '(someFlag:123 + anotherFlag) + (countryFlag:NL + !countryFlag:GB) > 3'

// 2nd argument = throw Error in case of validation Error
// Boolean, true if valid, or Throws
console.log(validate(condition, true))

// List flags the condition is working with (for e.g. redis `smismember`)
console.log(flags(condition))

// Returns boolean (condition applies?)
console.log(apply(condition, [
  'someFlag:123',
  'countryFlag:NL',
  'countryFlag:GB',
  'anotherFlag',
]))
```

### Development

Tests: `npm run test`
