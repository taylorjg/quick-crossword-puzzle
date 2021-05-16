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

//              bold    normal

// tl:          250F    250C
// tr:          2513    2510
// bl:          2517    2514
// br:          251B    2518

// top t:       2533    252C
// bottom t:    253B    2534
// left t:      2523    251C
// right t:     252B    2524

// top/bottom:  2501    2500
// left/right:  2503    2502

// cross:       254B    253C

const topGridlines = numCols => {
  return '\u250C' + (Array(numCols).fill('\u2500').join('\u252C')) + '\u2510'
  // return '\u250C' + (Array(numCols).fill('\u2500').join('\u2500')) + '\u2510'
}

// const middleGridlines = numCols => {
//   return '\u251C' + (Array(numCols).fill('\u2500').join('\u253C')) + '\u2524'
// }

const bottomGridlines = numCols => {
  return '\u2514' + (Array(numCols).fill('\u2500').join('\u2534')) + '\u2518'
  // return '\u2514' + (Array(numCols).fill('\u2500').join('\u2500')) + '\u2518'
}

const renderGrid = (grid, acrossAnswers, downAnswers, gridAnalysis) => {
  const gridSquareCharacters = grid.map(row =>
    Array.from(row).map(ch =>
      ch !== '.' ? '\u2592' : ' '))

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

  const numRows = grid.length
  const numCols = grid[0].length
  console.log(topGridlines(numCols))
  gridSquareCharacters.forEach((row, index) => {
    console.log('\u2502' + row.join('\u2502') + '\u2502')
    // console.log('\u2502' + row.join(' ') + '\u2502')
    if (index < numRows - 1) {
      // console.log(middleGridlines(numCols))
    }
  })
  console.log(bottomGridlines(numCols))
}

module.exports = {
  analyseGrid,
  renderGrid
}
