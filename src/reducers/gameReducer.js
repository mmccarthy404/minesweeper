const initialState = {
  status: 'start',
  board: [],
  xDim: null,
  yDim: null,
  mineCount: null,
  flagCount: null,
  startTime: null,
  moves: []
}

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

const _initBoard = (xDim, yDim, mineIds) => {
  let id = 0
  let board = new Array(xDim)
  for (let x = 0; x < xDim; x++) {
    board[x] = new Array(yDim)
    for (let y = 0; y < yDim; y++) {
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
  board = _plantMines(board, mineIds)
  board = _getNeighbors(board)
  return board
}

const _newGame = (state, action) => {
  const newState = {...state,
    status: 'start',
    board: _initBoard(action.data.xDim, action.data.yDim, action.data.mineIds),
    xDim: action.data.xDim,
    yDim: action.data.yDim,
    mineCount: action.data.mineIds.length,
    flagCount: 0,
    startTime: null,
    moves: []
  }
  return newState
}

const _moveMine = (board, xCurrent, yCurrent) => {
  let newBoard = [...board]
  newBoard[xCurrent][yCurrent].isMine = false
  xLoop: for (let x = 0; x < newBoard.length; x++) {
    for (let y = 0; y < newBoard[x].length; y++) {
      if (!(x === xCurrent && y === yCurrent) && newBoard[x][y].isMine === false) {
        newBoard[x][y].isMine = true
        break xLoop
      }
    }
  }
  newBoard = _getNeighbors(newBoard)
  return newBoard
}

const _isGameLost = (board, x, y) => {
  const gameLost = board[x][y].isMine === true
  return gameLost
}

const _isGameWon = (board) => {
  const gameWon = board.every(row => {
    return row.every(cell => cell.isMine === true || cell.state === 'opened')
  })
  return gameWon
}

const _clickCell = (state, action) => {
  const newState = {...state,
    status: 'active'
  }

  if (newState.moves.length === 0 && newState.board[action.data.x][action.data.y].isMine === true) {
    newState.board = _moveMine(newState.board, action.data.x, action.data.y)
  }

  newState.moves = [...newState.moves, {x: action.data.x, y: action.data.y, time: action.data.time}]

  if (_isGameLost(newState.board, action.data.x, action.data.y)) {
    newState.board[action.data.x][action.data.y].state = 'opened'
    newState.status = 'lose'
    return newState
  }

  // https://en.wikipedia.org/wiki/Flood_fill
  const _floodFill = (x, y) => {
    if (x < 0 || x >= newState.board.length || y < 0 || y >= newState.board[0].length) return
    if (newState.board[x][y].state === 'opened') return
    newState.board[x][y].state = 'opened'
    if (newState.board[x][y].neighbors === 0) {
      const neighborDeltas = [-1, 0, 1]
      neighborDeltas.forEach(deltaX => {
        neighborDeltas.forEach(deltaY => {
          _floodFill(x + deltaX, y + deltaY)
        })
      })
    }
  }
  _floodFill(action.data.x, action.data.y)

  if (_isGameWon(newState.board)) {
    newState.status = 'win'
  }

  return newState
}

const _flagCell = (state, action) => {
  const newState = {...state,
    status: 'active'
  }
  if (newState.board[action.data.x][action.data.y].state === 'flagged') {
    newState.board[action.data.x][action.data.y].state = 'unopened'
    newState.flagCount--
  } else {
    newState.board[action.data.x][action.data.y].state = 'flagged'
    newState.flagCount++
  }

  return newState
}

const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'NEW_GAME':
      return _newGame(state, action)
    case 'CLICK_CELL':
      return _clickCell(state, action)
    case 'FLAG_CELL':
      return _flagCell(state, action)
    default:
      return state
  }
}

export const newGame = (xDim, yDim, mineCount) => {
  const mineIds = _shuffle([...Array(xDim * yDim).keys()]).slice(0, mineCount)
  return {
    type: 'NEW_GAME',
    data: {
      xDim: xDim,
      yDim: yDim,
      mineIds: mineIds
    }
  }
}

export const clickCell = (x, y) => {
  return {
    type: 'CLICK_CELL',
    data: {
      x: x,
      y: y,
      time: new Date().getTime()
    }
  }
}

export const flagCell = (x, y) => {
  return {
    type: 'FLAG_CELL',
    data: {
      x: x,
      y: y
    }
  }
}

export default gameReducer