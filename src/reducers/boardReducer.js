const boardReducer = (state = [], action) => {
  switch (action.type) {
    case 'NEW_BOARD': {
      const xDim = action.data.xDim
      const yDim = action.data.yDim
      const nMines = action.data.nMines

      // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
      const _shuffle = (a) => {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]]
        }
        return a
      }

      const mineIds = _shuffle([...Array(xDim * yDim).keys()]).slice(0, nMines)
      let id = 0
      const board = new Array(xDim)
      for (let x = 0; x < xDim; x++) {
        board[x] = new Array(yDim)
        for (let y = 0; y < yDim; y++) {
          board[x][y] = {
            id: id,
            x: x,
            y: y,
            is_mine: mineIds.includes(id),
            state: 'unopened',
            neighbors: null
          }
          id++
        }
      }

      const neighborDeltas = [-1, 0, 1]
      for (let x = 0; x < xDim; x++) {
        for (let y = 0; y < yDim; y++) {
          let neighbors = 0
          neighborDeltas.forEach(deltaX => {
            neighborDeltas.forEach(deltaY => {
              if (x + deltaX < 0 || x + deltaX >= xDim || y + deltaY < 0 || y + deltaY >= yDim) return
              if (board[x + deltaX][y + deltaY].is_mine) neighbors++
            })
          })
          board[x][y].neighbors = neighbors
        }
      }

      return board
    }
    case 'LEFT_CLICK': {
      const board = [...state]
      const x = action.data.x
      const y = action.data.y

      // https://en.wikipedia.org/wiki/Flood_fill
      const _floodFill = (x, y) => {
        if (x < 0 || x >= board.length || y < 0 || y >= board[0].length) return
        if (board[x][y].state === 'opened') return
        board[x][y].state = 'opened'
        if (board[x][y].neighbors === 0) {
          const neighborDeltas = [-1, 0, 1]
          neighborDeltas.forEach(deltaX => {
            neighborDeltas.forEach(deltaY => {
              _floodFill(x + deltaX, y + deltaY)
            })
          })
        }
      }
      _floodFill(x, y)

      return board
    }
    case 'RIGHT_CLICK': {
      const board = [...state]
      const x = action.data.x
      const y = action.data.y

      if (board[x][y].state === 'opened') {
        return board 
      }

      board[x][y].state = (board[x][y].state === 'flagged') ? 'unopened' : 'flagged'

      return board
    }
    default:
      return state
  }
}

export const newBoard = (xDim, yDim, nMines) => {
  return {
    type: 'NEW_BOARD',
    data: {
      xDim: xDim,
      yDim: yDim,
      nMines: nMines
    }
  }
}

export const leftClick = (x, y) => {
  return {
    type: 'LEFT_CLICK',
    data: {
      x: x,
      y: y
    }
  }
}

export const rightClick = (x, y) => {
  return {
    type: 'RIGHT_CLICK',
    data: {
      x: x,
      y: y
    }
  }
}
export default boardReducer