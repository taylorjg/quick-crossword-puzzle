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
    clue: puzzle.ACROSS_CLUES[index],
    answer: puzzle.ACROSS_ANSWERS[index]
  }))

const enrichDownClues = (puzzle, gridAnalysis) =>
  gridAnalysis.downClues.map((clueDetails, index) => ({
    ...clueDetails,
    clue: puzzle.DOWN_CLUES[index],
    answer: puzzle.DOWN_ANSWERS[index]
  }))

const addPossibles = async (thesaurusService, clueDetailsCollection) => {
  return clueDetailsCollection
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

const main = async () => {
  const gridAnalysis = analyseGrid(SAMPLE_PUZZLE.GRID)
  renderGrid(SAMPLE_PUZZLE, gridAnalysis)
  const acrossClueDetails = await addPossibles(MW, enrichAcrossClues(SAMPLE_PUZZLE, gridAnalysis))
  const downClueDetails = await addPossibles(MW, enrichDownClues(SAMPLE_PUZZLE, gridAnalysis))
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
  console.log('crossCheckingGridSquares count:', crossCheckingGridSquares.length)
  console.dir(crossCheckingGridSquares)
}

main()
