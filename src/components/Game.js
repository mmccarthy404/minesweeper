import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'

import { newGame } from '../reducers/gameReducer'
import Board from './Board'

const GameDiv = styled.div`
-webkit-touch-callout: none; /* iOS Safari */
-webkit-user-select: none; /* Safari */
 -khtml-user-select: none; /* Konqueror HTML */
   -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none; /* Non-prefixed version, currently
                              supported by Chrome, Opera and Firefox */
`

const xDim = 16
const yDim = 16
const mineCount = 40

const Counter = ({ digits }) => {
  return (
    <b>{digits}</b>
  )
}

const Game = () => {
  const game = useSelector(state => state.game)
  const [time, setTime] = useState(0)

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(newGame(xDim, yDim, mineCount))
  }, [dispatch])

  useEffect(() => {
    let interval = null
    switch (game.status) {
      case 'start': {
        clearInterval(interval)
        setTime(0)
        break
      }
      case 'active': {
        interval = setInterval(() => {
          setTime(time + 1)
        }, 1000)
        break
      }
      default: {
        clearInterval(interval)
        break
      }
    }
    return () => clearInterval(interval)
  }, [game, time])
  
   const handleNewGame = () => {
    dispatch(newGame(xDim, yDim, mineCount))
   }

  return (
    <GameDiv onContextMenu={(e) => e.preventDefault()}>
      <Counter digits={game.mineCount - game.flagCount} />
      <button onClick={() => handleNewGame()}>{ game.status === 'win' ? ':D' : game.status !== 'lose' ? ':)' : ':(' }</button>
      <Counter digits={time} />
      <Board />
    </GameDiv>
  )
}

export default Game