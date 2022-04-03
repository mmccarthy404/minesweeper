import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { newBoard } from '../reducers/boardReducer'

import Board from './Board'

const xDim = 10
const yDim = 10
const nMine = 20

const Game = () => {
  const dispatch = useDispatch()
  useEffect(() => dispatch(newBoard(xDim, yDim, nMine)), [])

  return (
    <div>
      <Board />
    </div>
  )
}

export default Game