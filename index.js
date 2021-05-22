const assert = require('assert')
const dlxlib = require('dlxlib')
const dotenv = require('dotenv')

const configureMW = require('./mw')
const { analyseGrid, renderGrid } = require('./puzzle')
const U = require('./utils')
const SAMPLE_PUZZLE = require('./sample-puzzle')

dotenv.config()
const { MW_DICTIONARY_KEY, MW_THESAURUS_KEY } = process.env

const MW = configureMW(MW_DICTIONARY_KEY, MW_THESAURUS_KEY)

const isSameGridSquare = (gs1, gs2) =>
  gs1.row === gs2.row && gs1.col === gs2.col

const hasGridSquare = gs1 => clueDetails =>
  Boolean(clueDetails.gridSquares.find(gs2 => isSameGridSquare(gs1, gs2)))

const enrichAcrossClues = (puzzle, gridAnalysis) =>
  gridAnalysis.acrossClues.map((clueDetails, index) => ({
    ...clueDetails,
    isAcrossClue: true,
    clue: puzzle.ACROSS_CLUES[index],
    answer: puzzle.ACROSS_ANSWERS[index]
  }))

const enrichDownClues = (puzzle, gridAnalysis) =>
  gridAnalysis.downClues.map((clueDetails, index) => ({
    ...clueDetails,
    isAcrossClue: false,
    clue: puzzle.DOWN_CLUES[index],
    answer: puzzle.DOWN_ANSWERS[index]
  }))

const addPossibles = async (thesaurusService, clueDetailsCollection) => {
  const promises = clueDetailsCollection.map(async clueDetails => {
    const { clue, answerLength, answer } = clueDetails
    const possibles = await thesaurusService.getPossibles(clue, answerLength)
    return {
      ...clueDetails,
      possibles
    }
  })
  return Promise.all(promises)
}

const encodeLetter = (letter, isAcrossClue) => {
  const flags = Array(26).fill(false)
  const flagIndex = letter.charCodeAt(0) - 'a'.charCodeAt(0)
  assert(flagIndex >= 0)
  assert(flagIndex < flags.length)
  flags[flagIndex] = true
  const acrossEncoding = flag => flag ? 1 : 0
  const downEncoding = flag => flag ? 0 : 1
  return flags.map(isAcrossClue ? acrossEncoding : downEncoding)
}

const makeDlxRowForPossible = (crossCheckingGridSquares, gridSquares, possible, isAcrossClue) => {
  // TODO: we could determine 'isAcrossClue' by examining 'gridSquares'
  // all rows same => isAcrossClue: true
  // all cols same => isAcrossClue: false
  const row = Array(crossCheckingGridSquares.length * 26).fill(0)
  gridSquares.forEach((gridSquare, gridSquareIndex) => {
    const crossCheckingGridSquaresIndex = crossCheckingGridSquares.findIndex(crossCheckingGridSquare =>
      isSameGridSquare(gridSquare, crossCheckingGridSquare.gridSquare))
    if (crossCheckingGridSquaresIndex >= 0) {
      const encodedLetterColumns = encodeLetter(possible[gridSquareIndex], isAcrossClue)
      const startIndex = crossCheckingGridSquaresIndex * 26
      encodedLetterColumns.forEach((value, index) => {
        row[startIndex + index] = value
      })
    }
  })
  return row
}

const makeDlxRowsForPossibles = (crossCheckingGridSquares, gridSquares, possibles, isAcrossClue) =>
  possibles.map(possible => makeDlxRowForPossible(crossCheckingGridSquares, gridSquares, possible, isAcrossClue))

const addDlxRowsForClues = (matrix, map, crossCheckingGridSquares, clueDetailsCollection) => {
  for (const clueDetails of clueDetailsCollection) {
    if (clueDetails.possibles.includes(clueDetails.answer)) {
      const rows = makeDlxRowsForPossibles(
        crossCheckingGridSquares,
        clueDetails.gridSquares,
        clueDetails.possibles,
        clueDetails.isAcrossClue)
      rows.forEach((row, possibleIndex) => {
        const rowIndex = matrix.length
        map.set(rowIndex, { clueDetails, possibleIndex })
        matrix.push(row)
      })
    }
  }
}

const makeDlxMatrix = (crossCheckingGridSquares, acrossClueDetails, downClueDetails) => {
  const matrix = []
  const map = new Map()
  addDlxRowsForClues(matrix, map, crossCheckingGridSquares, acrossClueDetails)
  addDlxRowsForClues(matrix, map, crossCheckingGridSquares, downClueDetails)
  return { matrix, map }
}

const main = async () => {
  const gridAnalysis = analyseGrid(SAMPLE_PUZZLE.GRID)
  const acrossClueDetails = await addPossibles(MW, enrichAcrossClues(SAMPLE_PUZZLE, gridAnalysis))
  const downClueDetails = await addPossibles(MW, enrichDownClues(SAMPLE_PUZZLE, gridAnalysis))

  renderGrid(SAMPLE_PUZZLE, gridAnalysis)

  // console.log()
  // console.dir(acrossClueDetails)
  // console.log()
  // console.dir(downClueDetails)

  const crossCheckingGridSquares = []
  for (const row of U.range(gridAnalysis.numRows)) {
    for (const col of U.range(gridAnalysis.numCols)) {
      const gridSquare = { row, col }
      const across = acrossClueDetails.find(hasGridSquare(gridSquare))
      const down = downClueDetails.find(hasGridSquare(gridSquare))
      if (across && down) {
        const acrossPossiblesIncludesAnswer = across.possibles.includes(across.answer)
        const downPossiblesIncludesAnswer = down.possibles.includes(down.answer)
        if (acrossPossiblesIncludesAnswer && downPossiblesIncludesAnswer) {
          const acrossIndex = across.gridSquares.findIndex(gs => isSameGridSquare(gridSquare, gs))
          const downIndex = down.gridSquares.findIndex(gs => isSameGridSquare(gridSquare, gs))
          crossCheckingGridSquares.push({
            gridSquare,
            acrossIndex,
            downIndex,
            acrossLetter: across.answer[acrossIndex],
            downLetter: down.answer[downIndex]
          })
        }
      }
    }
  }
  console.log('crossCheckingGridSquares count:', crossCheckingGridSquares.length)
  // console.dir(crossCheckingGridSquares)

  const { matrix, map } = makeDlxMatrix(crossCheckingGridSquares, acrossClueDetails, downClueDetails)
  // console.dir(map)

  const dlx = new dlxlib.Dlx()
  const solutions = dlx.solve(matrix)
  console.dir(solutions)
}

main()
