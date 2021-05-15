const dotenv = require('dotenv')

const configureMW = require('./mw')
const { analyseGrid, renderGrid } = require('./puzzle')
const SAMPLE_PUZZLE = require('./sample-puzzle')

dotenv.config()
const { MW_DICTIONARY_KEY, MW_THESAURUS_KEY } = process.env

const MW = configureMW(MW_DICTIONARY_KEY, MW_THESAURUS_KEY)

const main = async () => {
  const gridAnalysis = analyseGrid(SAMPLE_PUZZLE.GRID)
  renderGrid(
    SAMPLE_PUZZLE.GRID,
    SAMPLE_PUZZLE.ACROSS_ANSWERS,
    SAMPLE_PUZZLE.DOWN_ANSWERS,
    gridAnalysis)
  const acrossCluesDetails = gridAnalysis.across.map((clueDetails, index) => ({
    ...clueDetails,
    clue: SAMPLE_PUZZLE.ACROSS_CLUES[index],
    answer: SAMPLE_PUZZLE.ACROSS_ANSWERS[index]
  }))
  const downCluesDetails = gridAnalysis.down.map((clueDetails, index) => ({
    ...clueDetails,
    clue: SAMPLE_PUZZLE.DOWN_CLUES[index],
    answer: SAMPLE_PUZZLE.DOWN_ANSWERS[index]
  }))
  const allClueDetails = acrossCluesDetails.concat(downCluesDetails)
  for (const clueDetails of allClueDetails) {
    const possibles = await MW.getPossibles(clueDetails.clue, clueDetails.answerLength)
    console.log(`${clueDetails.clue} (${clueDetails.answerLength})`)
    console.dir(possibles)
    if (possibles.includes(clueDetails.answer)) {
      console.log('*** FOUND ANSWER ***')
    }
    console.log('-'.repeat(80))
  }
}

main()
