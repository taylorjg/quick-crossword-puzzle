const range = n => Array.from(Array(n).keys())

const analyseGrid = grid => {
  const numRows = grid.length
  const numCols = grid[0].length
  const lastRow = numRows - 1
  const lastCol = numCols - 1
  const isWall = (row, col) => (
    row < 0 || row > lastRow ||
    col < 0 || col > lastCol ||
    grid[row][col] !== '.'
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

const renderGrid = (grid, acrossAnswers, downAnswers, gridAnalysis) => {
  const gridSquareCharacters = grid.map(row =>
    Array.from(row).map(ch =>
      ch !== '.' ? '\u2591' : ' '))

  if (acrossAnswers && downAnswers && gridAnalysis) {
    gridAnalysis.across.forEach((clueDetails, clueIndex) => {
      const answer = acrossAnswers[clueIndex]
      if (answer) {
        const answerCharacters = Array.from(answer)
        clueDetails.gridSquares.forEach(({ row, col }, index) => {
          gridSquareCharacters[row][col] = answerCharacters[index].toUpperCase()
        })
      }
    })

    gridAnalysis.down.forEach((clueDetails, clueIndex) => {
      const answer = downAnswers[clueIndex]
      if (answer) {
        const answerCharacters = Array.from(answer)
        clueDetails.gridSquares.forEach(({ row, col }, index) => {
          gridSquareCharacters[row][col] = answerCharacters[index].toUpperCase()
        })
      }
    })
  }

  gridSquareCharacters.forEach(row => console.log(row.join('')))
}

module.exports = {
  analyseGrid,
  renderGrid
}
