import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import Cell from './Cell'

const BoardDiv = styled.div`
  width: ${props => props.yDim * 20}px;
  height: ${props => props.xDim * 20}px;
  display: grid;
  grid-gap: 0;
  grid-template-columns: repeat(${props => props.yDim}, 20px);
  grid-template-rows: repeat(${props => props.xDim}, 20px);
  grid-auto-flow: row;
`

const Board = () => {
  const game = useSelector(state => state.game)

  return (
    <BoardDiv xDim={game.xDim} yDim={game.yDim}>
      {game.board.map((i, x) => {
        return (
          i.map((j, y) => {
            return (
              <Cell 
                key={game.board[x][y].id}
                gameStatus={game.status}
                cellStatus={game.board[x][y]}
              />
            )
          })
        )
      })}
    </BoardDiv>
  )
}

export default Board