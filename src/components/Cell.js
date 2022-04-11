import React from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { clickCell, flagCell } from '../reducers/gameReducer'

const CellDiv = styled.div`
  position: relative;
  width: 20px;
  height: 20px;
  box-sizing: border-box;
  border: 1px solid black;
  background: lightblue;
`

const CellText = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

const CellButton = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 0, 0, 1);
`;

const CellBlock = styled.div`
  position: relative;
  width: 20px;
  height: 20px;
`

const Cell = ({ gameStatus, cellStatus }) => {
  const dispatch = useDispatch()

  const handleLeftClick = (x, y) => {
    if (cellStatus.state !== 'flagged') {
      dispatch(clickCell(x, y))
    } 
  }

  const handleRightClick = (x, y) => {
    dispatch(flagCell(x, y))
  }

  return (
    <CellDiv>
      <CellText>
        {cellStatus.isMine ? 'M' : (cellStatus.neighbors !== 0) ? cellStatus.neighbors : ''}
      </CellText>
      {(gameStatus === 'lose' && cellStatus.isMine === true) || cellStatus.state === 'opened'
        ? null
        : <CellButton
            onClick={() => handleLeftClick(cellStatus.x, cellStatus.y)}
            onContextMenu={() => handleRightClick(cellStatus.x, cellStatus.y)}>
            {gameStatus === 'win' || cellStatus.state === 'flagged' ? 'F' : null}
          </CellButton>
      }
      {cellStatus.state === 'flagged' ? <CellBlock onContextMenu={() => handleRightClick(cellStatus.x, cellStatus.y)} /> : null}
      {gameStatus === 'win' || gameStatus === 'lose' ? <CellBlock /> : null}
    </CellDiv>
  )
}

export default Cell
