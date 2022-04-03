import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import Tile from './Tile'

const BoardDiv = styled.div`
  width: 200px;
  height: 200px;
`

const Board = () => {
  const boardState = useSelector(state => state.board)

  return (
    <BoardDiv>
      {boardState.map((i, x) => {
        return (
          i.map((j, y) => {
            return (
              <Tile 
                key={boardState[x][y].id}
                data={boardState[x][y]}
              />
            )
          })
        )
      })}
    </BoardDiv>
  )
}

export default Board