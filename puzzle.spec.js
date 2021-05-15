const { analyseGrid } = require('./puzzle')
const SAMPLE_PUZZLE = require('./sample-puzzle')

describe('analyseGrid', () => {

  it('across clue numbers', () => {
    const clueDetails = analyseGrid(SAMPLE_PUZZLE.GRID)
    const clueNumbers = clueDetails.across.map(({ clueNumber }) => clueNumber)
    expect(clueNumbers).toEqual([1, 4, 6, 8, 10, 12, 13, 14, 15, 17, 19, 21, 23, 24, 25, 26])
  })

  it('across clue answer lengths', () => {
    const clueDetails = analyseGrid(SAMPLE_PUZZLE.GRID)
    const answerLengths = clueDetails.across.map(({ answerLength }) => answerLength)
    expect(answerLengths).toEqual([4, 3, 3, 12, 6, 6, 5, 4, 4, 5, 6, 6, 12, 3, 3, 4])
  })

  it('down clue numbers', () => {
    const clueDetails = analyseGrid(SAMPLE_PUZZLE.GRID)
    const clueNumbers = clueDetails.down.map(({ clueNumber }) => clueNumber)
    expect(clueNumbers).toEqual([2, 3, 4, 5, 6, 7, 9, 11, 12, 16, 17, 18, 20, 22])
  })

  it('down clue answer lengths', () => {
    const clueDetails = analyseGrid(SAMPLE_PUZZLE.GRID)
    const answerLengths = clueDetails.down.map(({ answerLength }) => answerLength)
    expect(answerLengths).toEqual([7, 6, 4, 6, 5, 10, 10, 5, 5, 7, 6, 6, 5, 4])
  })
})
