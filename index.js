const dotenv = require('dotenv')

const configureMW = require('./mw')
const { analyseGrid, renderGrid } = require('./puzzle')
const SAMPLE_PUZZLE = require('./sample-puzzle')

dotenv.config()
const { MW_DICTIONARY_KEY, MW_THESAURUS_KEY } = process.env

const MW = configureMW(MW_DICTIONARY_KEY, MW_THESAURUS_KEY)

const isSameGridSquare = (gs1, gs2) =>
  gs1.row === gs2.row && gs1.col === gs2.col

const enrichAcrossClues = (puzzle, gridAnalysis) =>
  gridAnalysis.across.map((clueDetails, index) => ({
    ...clueDetails,
    clue: puzzle.ACROSS_CLUES[index],
    answer: puzzle.ACROSS_ANSWERS[index]
  }))

const enrichDownClues = (puzzle, gridAnalysis) =>
  gridAnalysis.down.map((clueDetails, index) => ({
    ...clueDetails,
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

const main = async () => {
  const gridAnalysis = analyseGrid(SAMPLE_PUZZLE.GRID)
  renderGrid(SAMPLE_PUZZLE, gridAnalysis)
  const acrossCluesDetails = enrichAcrossClues(SAMPLE_PUZZLE, gridAnalysis)
  const downCluesDetails = enrichDownClues(SAMPLE_PUZZLE, gridAnalysis)
  const acrossClueDetailsWithPossibles = await addPossibles(MW, acrossCluesDetails)
  const downClueDetailsWithPossibles = await addPossibles(MW, downCluesDetails)
  console.log()
  console.dir(acrossClueDetailsWithPossibles)
  console.log()
  console.dir(downClueDetailsWithPossibles)
}

main()
