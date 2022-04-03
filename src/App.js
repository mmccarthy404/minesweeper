import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import Board from './components/Board'
import { newBoard } from './reducers/boardReducer'

const xDim = 10
const yDim = 10
const nMine = 10

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(newBoard(xDim, yDim, nMine))
   }, [dispatch])

  return (
    <div>
      <Board />
    </div>
  )
}

export default App