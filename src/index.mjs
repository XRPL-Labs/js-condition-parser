const flagRe = new RegExp('([a-zA-Z][a-zA-Z0-9:_]+)', 'g')

export const validate = (condition, throwException = false) => {
  const invalidParenthesis = condition.split('(').length !== condition.split(')').length
  const invalidCharacters = !condition.match(/^[+()-><a-zA-Z0-9\&\\!| :_]+$/)
  const invalidNegative = !!condition.match(/\![^a-zA-Z]/)

  const invalidSpacing = condition.trim()
    .replace(/[ \t\r\n]+/g, ' ')
    .replace(/[ ]{0,1}((\&\&)|(\|\|)|(\+)|(\-)|(<)|(>))[ ]{0,1}/g, '')
    .trim().split(' ').length > 1

  const items = { invalidParenthesis, invalidCharacters, invalidNegative, invalidSpacing, }
  const valid = Object.values(items).every(v => !v)

  if (throwException) {
    if (!valid) {
      throw new Error('Flag condition parser error' +
        '(' + Object.keys(items).filter(k => !!items[k]).join(', ') + ') @ "' + condition + '"'
      )
    }
  }

  return valid
}

export const flags = condition => {
  return [ ...condition.match(flagRe) ]
}

export const apply = (condition, flags) => {
  const c = condition.replace(flagRe, match => `(flags.indexOf('${match}') > -1)`)
  return Function('flags', `return (${c}) ?? false`)(flags)
}
