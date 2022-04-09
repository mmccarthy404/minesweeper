import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import Board from './components/Board'
import { initBoard } from './reducers/boardReducer'

const xDim = 10
const yDim = 10
const mineCount = 10

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initBoard(xDim, yDim, mineCount))
   }, [dispatch])

  return (
    <div>
      <Board />
    </div>
  )
}

export default App