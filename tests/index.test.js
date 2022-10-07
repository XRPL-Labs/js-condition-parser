import {validate, flags, apply} from '../'

describe('Logic', () => {
  (() => {
    const condition = '(someFlag_123 && anotherFlagX) || (countryFlag:NL && countryFlag:GB)'
    test(condition, () => {
      expect(validate(condition)).toBeTruthy()
      expect(flags(condition).sort()).toEqual([ 'someFlag_123', 'anotherFlagX', 'countryFlag:NL', 'countryFlag:GB', ].sort())
      expect(apply(condition, [ 'someFlag_123', 'anotherFlagX' ])).toBeTruthy()
      expect(apply(condition, [ 'countryFlag:NL', 'countryFlag:GB' ])).toBeTruthy()
      expect(apply(condition, [ 'someFlag_123', 'countryFlag:GB' ])).toBeFalsy()
    })
  })()
})

describe('Threshold', () => {
  (() => {
    const condition = '(someFlag_123 + anotherFlagX) - (countryFlag:NL + countryFlag:GB)'
    test(condition, () => {
      expect(validate(condition)).toBeTruthy()
      
      expect(flags(condition + ' > 3').sort()).toEqual([ 'someFlag_123', 'anotherFlagX', 'countryFlag:NL', 'countryFlag:GB', ].sort())

      // Compare
      expect(apply(condition + ' > 1', [ 'someFlag_123', 'anotherFlagX' ])).toBeTruthy()
      expect(apply(condition + ' < 3', [ 'someFlag_123', 'anotherFlagX' ])).toBeTruthy()
      expect(apply(condition + ' > 0', [ 'someFlag_123', 'anotherFlagX', 'countryFlag:NL' ])).toBeTruthy()
      expect(apply(condition + ' < 2', [ 'someFlag_123', 'anotherFlagX', 'countryFlag:NL' ])).toBeTruthy()

      // Value
      expect(apply(condition, [ 'countryFlag:NL', 'countryFlag:GB' ])).toEqual(-2)
      expect(apply(condition, [ 'someFlag_123', 'countryFlag:GB' ])).toEqual(0)
      expect(apply(condition, [ 'someFlag_123', 'anotherFlagX' ])).toEqual(2)
    })
  })()
})

describe('Syntax errors', () => {
  const errors = {
    '(someFlag_123 && anotherFlagX) | (countryFlag:NL && countryFlag:GB)': 'invalidSpacing',
    '(someFlag_123 && anotherFlagX) ((countryFlag:NL && countryFlag:GB)': 'invalidParenthesis',
    '(someFlag_123 + anotherFlagX) && (! countryFlag:NL && countryFlag:GB)': 'invalidNegative',
    '(someFlag_123 + anotherFlagX) && # (countryFlag:NL && countryFlag:GB)': 'invalidCharacters',
  }
  Object.keys(errors).forEach(condition => {
    test(condition, () => {
      const t = () => validate(condition, true)
      expect(t).toThrow(errors[condition])
    })
  })
})
