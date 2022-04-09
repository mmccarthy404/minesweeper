// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
const _shuffle = (a) => {
  const newA = [...a]
  for (let i = newA.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newA[i], newA[j]] = [newA[j], newA[i]]
  }
  return newA
}

const _plantMines = (board, mineIds) => {
  const newBoard = board.map(row => {
    return row.map(cell => {
      cell.isMine = (mineIds.includes(cell.id)) ? true : false
      return cell
    })
  })
  return newBoard
}

const _getNeighbors = (board) => {
  const newBoard = [...board]
  const neighborDeltas = [-1, 0, 1]
  for (let x = 0; x < newBoard.length; x++) {
    for (let y = 0; y < newBoard[0].length; y++) {
      let neighbors = 0
      neighborDeltas.forEach(deltaX => {
        neighborDeltas.forEach(deltaY => {
          if (
            x + deltaX < 0 ||
            x + deltaX >= newBoard.length ||
            y + deltaY < 0 ||
            y + deltaY >= newBoard[0].length
          ) return
          if (newBoard[x + deltaX][y + deltaY].isMine) neighbors++
        })
      })
      newBoard[x][y].neighbors = neighbors
    }
  }
  return newBoard
}

const _initBoard = (action) => {
  let id = 0
  let board = new Array(action.data.xDim)
  for (let x = 0; x < action.data.xDim; x++) {
    board[x] = new Array(action.data.yDim)
    for (let y = 0; y < action.data.yDim; y++) {
      board[x][y] = {
        id: id,
        x: x,
        y: y,
        isMine: false,
        neighbors: 0,
        state: 'unopened'
      }
      id++
    }
  }
  board = _plantMines(board, action.data.mineIds)
  board = _getNeighbors(board)
  return board
}

const _clickTile = (state, action) => {
  const newBoard = [...state]

  // https://en.wikipedia.org/wiki/Flood_fill
  const _floodFill = (x, y) => {
    if (x < 0 || x >= newBoard.length || y < 0 || y >= newBoard[0].length) return
    if (newBoard[x][y].state === 'opened') return
    newBoard[x][y].state = 'opened'
    if (newBoard[x][y].neighbors === 0) {
      const neighborDeltas = [-1, 0, 1]
      neighborDeltas.forEach(deltaX => {
        neighborDeltas.forEach(deltaY => {
          _floodFill(x + deltaX, y + deltaY)
        })
      })
    }
  }

  _floodFill(action.data.x, action.data.y)
  return newBoard
}

const _flagTile = (state, action) => {
  const newBoard = [...state]
  const x = action.data.x
  const y = action.data.y
  if (newBoard[x][y].state === 'opened') {
    return newBoard 
  }
  newBoard[x][y].state = (newBoard[x][y].state === 'flagged') ? 'unopened' : 'flagged'
  return newBoard
}

const boardReducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_BOARD': 
      return _initBoard(action)
    case 'CLICK_TILE':
      return _clickTile(state, action)
    case 'FLAG_TILE': 
      return _flagTile(state, action)
    default:
      return state
  }
}

export const initBoard = (xDim, yDim, mineCount) => {
  const mineIds = _shuffle([...Array(xDim * yDim).keys()]).slice(0, mineCount)
  return {
    type: 'INIT_BOARD',
    data: {
      xDim: xDim,
      yDim: yDim,
      mineIds: mineIds
    }
  }
}

export const clickTile = (x, y) => {
  return {
    type: 'CLICK_TILE',
    data: {
      x: x,
      y: y
    }
  }
}

export const flagTile = (x, y) => {
  return {
    type: 'FLAG_TILE',
    data: {
      x: x,
      y: y
    }
  }
}

export default boardReducer