// TODO: verifier double \n et les curl vs text
// edge case : empty line, word > 80, weird paragragp structure

const justifyText = (text, neededLength = 80) => {
  // First we assign each word to a line
  // Then we pad each line (except the last one) with an extra space until we get 80 characters lines

  // let text = `bonjour comment puis je t aider
  // ça va bien ce soir ?`


  let paragraphs = text.split('\n')
  // console.log(paragraphs)
  console.log('START')
  let result = []
  for (let paragraph of paragraphs) {
    console.log('new paragraph')
    let words = paragraph.trim().split(' ') // We get each words of the paragraph and we greedily add them to our lines
    // console.log(words)
    let lines = []
    let currentLine = []
    let currentLineLength = 0
    for (let word of words) {
      if (currentLineLength + word.length <= neededLength) {
        currentLine.push(word)
        currentLineLength += word.length + 1
      } else {
        lines.push(currentLine)
        currentLine = [word]
        currentLineLength = word.length + 1
      }
      // console.log('new iter')
      // console.log(lines)
      // console.log(currentLine)
      // console.log(currentLineLength)
    }
    lines.push(currentLine)
    console.log('End paragraph')
    // console.log(lines)
    // console.log(currentLine)
    // console.log(currentLineLength)
    result.push(lines)

    // console.log(result)
  }
  // console.log(result)

  let justifiedText = ''

  result.forEach(paragraph => {
    paragraph.forEach((line, id) => {
      if (id === paragraph.length - 1) { // We don't pad the last line of a paragraph
        justifiedText += line.join(' ') + '\n'
      } else {
        justifiedText += padLine(line, neededLength) + '\n'
      }
    })
  })

  // console.log(justifiedText)
  return justifiedText
// if (character.charCodeAt() === 10)
}

const padLine = (line, neededLength) => {
  // console.log('line : ', line)
  if (line.length === 1) { // If we only have one word to pad, we just add the missing whitespace at the end
    line[0] = line[0].padEnd(15, ' ')
  } else {
    let lineLenght = line.reduce((acc, word) => word.length + acc + 1, 0) - 1 // -1 there is no whitespace for the last word
    let missingWhitespaces = neededLength - lineLenght
    indexNextNewWhitespace = 0
    while (missingWhitespaces !== 0) {
      line[indexNextNewWhitespace] += ' '
      missingWhitespaces--

      // We are adding a whitespace after each word of the line from left to right
      // We use : % (line.length - 1) because we might have to add to
      // add several whitespace, line.length - 1 because we don't want to add a whitespace
      // to the last word
      indexNextNewWhitespace = (indexNextNewWhitespace + 1) % (line.length - 1)
    }
  }

  return line.join(' ')
}

module.exports = { justifyText }
