const justifyText = (text, neededLength = 80) => {
  // 2 Steps :
  // - First We assign each word to it's line
  // - Second We pad each line (except the last one) with an extra space until
  // we get 80 characters lines

  let paragraphs = text.split('\n') // We will treat each paragraph independently
  let processedParagraphs = []

  for (let paragraph of paragraphs) {
    // We get each words of the paragraph and we greedily add them to our lines
    let words = paragraph.trim().split(' ')
    let lines = buildLinesFromWords(words, neededLength)
    processedParagraphs.push(lines)
  }

  let justifiedText = ''
  processedParagraphs.forEach((paragraph, idParagraph) => {
    paragraph.forEach((line, idLine) => {
      if (idLine === paragraph.length - 1) { // We don't pad the last line of a paragraph
        justifiedText += line.join(' ')
      } else {
        justifiedText += padLine(line, neededLength)
      }
      // New line except on the last one
      if (idLine !== paragraph.length - 1) justifiedText += '\n'
    })
    // New paragragh except on the last one
    if (idParagraph !== processedParagraphs.length - 1) justifiedText += '\n'
  })
  return justifiedText
}

const buildLinesFromWords = (words, neededLength) => {
  let lines = []
  let currentLine = []
  let currentLineLength = 0
  for (let word of words) {
    if (currentLineLength + word.length <= neededLength) { // Adding words greedily
      currentLine.push(word)
      currentLineLength += word.length + 1
    } else {
      // Dealing with words longer than max line width
      if (word.length > neededLength) {
        let lengthTooLongWord = word.length
        lines.push(currentLine)
        for (let i = 0; i < Math.floor(lengthTooLongWord / neededLength); i++) {
          lines.push([word.slice(i * neededLength, (i + 1) * neededLength)])
        }
        let endOfWord = word.slice(Math.floor(lengthTooLongWord / neededLength) * neededLength, lengthTooLongWord)
        if (endOfWord.length !== 0) { // We don't want to add the empty word : ''
          currentLine = [endOfWord]
          currentLineLength = endOfWord.length + 1
        } else {
          currentLine = []
          currentLineLength = 0
        }
      } else { // When the current line is filled, we create the next one
        lines.push(currentLine)
        currentLine = [word]
        currentLineLength = word.length + 1
      }
    }
  }
  if (currentLine.length > 0) lines.push(currentLine)

  return lines
}

const padLine = (line, neededLength) => {
  if (line.length === 1) { // If we only have one word to pad, we just add the missing whitespaces at the end
    line[0] = line[0].padEnd(neededLength, ' ')
  } else {
    let lineLenght = line.reduce((acc, word) => word.length + acc + 1, 0) - 1 // -1 there is no whitespace for the last word
    let missingWhitespaces = neededLength - lineLenght
    indexNextNewWhitespace = 0

    // We are adding a whitespace after each word of the line from left to right
    // We use : % (line.length - 1) because we might have to add to
    // add several whitespace, and (line.length - 1) because we don't want to add a whitespace
    // to the last word
    while (missingWhitespaces !== 0) {
      line[indexNextNewWhitespace] += ' '
      indexNextNewWhitespace = (indexNextNewWhitespace + 1) % (line.length - 1)
      missingWhitespaces--
    }
  }

  return line.join(' ')
}

// let text = `Longtemps, je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte,de Charles-Quint.
//
// Cette croyance survivait pendant quelques secondes à mon réveil; elle ne choquait pas ma raise le bougeoir n’était plus allumé.
// Puis elle comm la causerie récente et aux adieux sous la lampe étrangère qui le suivent encore dans le silence de la nuit, à la douceur prochaine du retour.`

let text = `Longtemps, je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte,de Charles-Quint.`

console.log(justifyText(text))

module.exports = { justifyText }
