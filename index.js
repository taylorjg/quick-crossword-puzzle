const dotenv = require('dotenv')

const configureMW = require('./mw')
// const configureOUP = require('./oup')
const PUZZLE = require('./puzzle')

dotenv.config()
const { MW_DICTIONARY_KEY, MW_THESAURUS_KEY } = process.env
// const { OUP_API_ID, OUP_API_KEY } = process.env

const MW = configureMW(MW_DICTIONARY_KEY, MW_THESAURUS_KEY)
// const OUP = configureOUP(OUP_API_ID, OUP_API_KEY)

const main = async () => {
  const allClueDetails = PUZZLE.ACROSS_CLUES.concat(PUZZLE.DOWN_CLUES)
  for (const clueDetails of allClueDetails) {
    const possibles = await MW.getPossibles(clueDetails.clue, clueDetails.length)
    console.log(`${clueDetails.clue} (${clueDetails.length})`)
    console.dir(possibles)
    if (possibles.includes(clueDetails.answer)) {
      console.log('*** FOUND ANSWER ***')
    }
    console.log('-'.repeat(80))
  }
}

main()
