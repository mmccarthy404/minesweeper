import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { initBoard } from '../reducers/boardReducer'

import Board from './Board'

const xDim = 10
const yDim = 10
const mineCount = 20

const Game = () => {
  const dispatch = useDispatch()
  useEffect(() => dispatch(initBoard(xDim, yDim, mineCount)), [])

  return (
    <div>
      <Board />
    </div>
  )
}

export default Game