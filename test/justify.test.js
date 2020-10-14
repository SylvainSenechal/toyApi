const { justifyText } = require('../tools.js')

test('empty text', () => {
  expect(justifyText('')).toBe('')
})

test('word with exact line length', () => {
  expect(justifyText('ok 123456789A', 10)).toBe(
  `ok        \n123456789A`)
})

test('word too long with twice exact line length', () => {
  expect(justifyText('ok 123456789A123456789A', 10)).toBe(
  `ok        \n123456789A\n123456789A`)
})

test('word too long and not a multiple of line length', () => {
  expect(justifyText('ok 123456789ABCD', 10)).toBe(
  `ok        \n123456789A\nBCD`)
})

test('paragraph jump', () => {
  expect(justifyText(
  `bonjour comment
  ça va`, 10)).toBe(
  `bonjour   \ncomment\nça va`) // No space after 'comment' because last word of paragraph
})

test('double paragraph jump', () => {
  expect(justifyText(
  `bonjour comment

  ça va`, 10)).toBe(
  `bonjour   \ncomment\n\nça va`)
})

test('exercice example', () => {
  expect(justifyText(
`Longtemps, je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte, de Charles-Quint.

Cette croyance survivait pendant quelques secondes à mon réveil; elle ne choquait pas ma raise le bougeoir n’était plus allumé.
Puis elle comm la causerie récente et aux adieux sous la lampe étrangère qui le suivent encore dans le silence de la nuit, à la douceur prochaine du retour.`)
).toBe(
`Longtemps, je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte,
de Charles-Quint.

Cette  croyance  survivait  pendant  quelques  secondes  à  mon  réveil; elle ne
choquait pas ma raise le bougeoir n’était plus allumé.
Puis  elle comm la causerie récente et aux adieux sous la lampe étrangère qui le
suivent encore dans le silence de la nuit, à la douceur prochaine du retour.`)
})
