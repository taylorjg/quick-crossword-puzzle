const range = n => Array.from(Array(n).keys())

const PUZZLE_WALL = 'X'

const analyseGrid = grid => {
  const numRows = grid.length
  const numCols = grid[0].length
  const lastRow = numRows - 1
  const lastCol = numCols - 1
  const isWall = (row, col) => (
    row < 0 || row > lastRow ||
    col < 0 || col > lastCol ||
    grid[row][col] === PUZZLE_WALL
  )
  const leftIsWall = (row, col) => isWall(row, col - 1)
  const rightIsWall = (row, col) => isWall(row, col + 1)
  const aboveIsWall = (row, col) => isWall(row - 1, col)
  const belowIsWall = (row, col) => isWall(row + 1, col)
  const findGridSquaresAcross = (row, col) => {
    const gridSquares = []
    for (; ;) {
      if (isWall(row, col)) break
      gridSquares.push({ row, col })
      col++
    }
    return gridSquares
  }
  const findGridSquaresDown = (row, col) => {
    const gridSquares = []
    for (; ;) {
      if (isWall(row, col)) break
      gridSquares.push({ row, col })
      row++
    }
    return gridSquares
  }
  let nextClueNumber = 1
  const acrossClues = []
  const downClues = []
  for (const row of range(numRows)) {
    for (const col of range(numCols)) {
      if (isWall(row, col)) continue
      const newAcrossClue = leftIsWall(row, col) && !rightIsWall(row, col)
      const newDownClue = aboveIsWall(row, col) && !belowIsWall(row, col)
      if (newAcrossClue) {
        const gridSquares = findGridSquaresAcross(row, col)
        acrossClues.push({
          clueNumber: nextClueNumber,
          answerLength: gridSquares.length,
          gridSquares
        })
      }
      if (newDownClue) {
        const gridSquares = findGridSquaresDown(row, col)
        downClues.push({
          clueNumber: nextClueNumber,
          answerLength: gridSquares.length,
          gridSquares
        })
      }
      if (newAcrossClue || newDownClue) {
        nextClueNumber++
      }
    }
  }
  return {
    across: acrossClues,
    down: downClues
  }
}

// https://unicode.org/charts/PDF/U2500.pdf
const DOWN_AND_RIGHT_CHAR = '\u250C'
const DOWN_AND_LEFT_CHAR = '\u2510'
const UP_AND_RIGHT_CHAR = '\u2514'
const UP_AND_LEFT_CHAR = '\u2518'
const DOWN_AND_HORIZONTAL_CHAR = '\u252C'
const UP_AND_HORIZONTAL_CHAR = '\u2534'
const HORIZONTAL_CHAR = '\u2500'
const VERTICAL_CHAR = '\u2502'

// https://unicode.org/charts/PDF/U2580.pdf
const FULL_BLOCK_CHAR = '\u2588'

const SPACE_CHAR = ' '

const gridlinesHelper = (numCols, startChar, endChar, middleChar, separatorChar) =>
  startChar + Array(numCols).fill(middleChar).join(separatorChar) + endChar

const topGridlines = numCols =>
  gridlinesHelper(
    numCols,
    DOWN_AND_RIGHT_CHAR,
    DOWN_AND_LEFT_CHAR,
    HORIZONTAL_CHAR,
    DOWN_AND_HORIZONTAL_CHAR)

const bottomGridlines = numCols =>
  gridlinesHelper(
    numCols,
    UP_AND_RIGHT_CHAR,
    UP_AND_LEFT_CHAR,
    HORIZONTAL_CHAR,
    UP_AND_HORIZONTAL_CHAR)

const renderGrid = (puzzle, gridAnalysis) => {

  const gridSquareCharacters = puzzle.GRID.map(row =>
    Array.from(row).map(ch => ch === PUZZLE_WALL ? FULL_BLOCK_CHAR : SPACE_CHAR))

  gridAnalysis.across.forEach((clueDetails, clueIndex) => {
    const answer = puzzle.ACROSS_ANSWERS[clueIndex]
    if (answer) {
      const answerCharacters = Array.from(answer)
      clueDetails.gridSquares.forEach(({ row, col }, index) => {
        gridSquareCharacters[row][col] = answerCharacters[index].toUpperCase()
      })
    }
  })

  gridAnalysis.down.forEach((clueDetails, clueIndex) => {
    const answer = puzzle.DOWN_ANSWERS[clueIndex]
    if (answer) {
      const answerCharacters = Array.from(answer)
      clueDetails.gridSquares.forEach(({ row, col }, index) => {
        gridSquareCharacters[row][col] = answerCharacters[index].toUpperCase()
      })
    }
  })

  const numCols = puzzle.GRID[0].length
  console.log(topGridlines(numCols))
  gridSquareCharacters.forEach(row => {
    console.log(VERTICAL_CHAR + row.join(VERTICAL_CHAR) + VERTICAL_CHAR)
  })
  console.log(bottomGridlines(numCols))
}

module.exports = {
  analyseGrid,
  renderGrid
}
