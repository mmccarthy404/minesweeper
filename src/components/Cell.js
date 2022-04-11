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

const Cell = ({ gameStatus, cellStatus }) => {
  const dispatch = useDispatch()

  const handleLeftClick = (x, y) => {
    if (gameStatus === 'start' || gameStatus === 'active') {
      dispatch(clickCell(x, y))
    } 
  }

  const handleRightClick = (x, y) => {
    if (gameStatus === 'start' || gameStatus === 'active') {
      dispatch(flagCell(x, y))
    }
  }

  switch (cellStatus.state) {
    case 'unopened': {
      return (
        <CellDiv>
          <CellText>
            {cellStatus.isMine ? 'M' : (cellStatus.neighbors !== 0) ? cellStatus.neighbors : ''}
          </CellText>
          <CellButton onClick={() => handleLeftClick(cellStatus.x, cellStatus.y)} onContextMenu={() => handleRightClick(cellStatus.x, cellStatus.y)} />
        </CellDiv>
      )
    }
    case 'flagged': {
      return (
        <CellDiv>
          <CellButton onContextMenu={() => handleRightClick(cellStatus.x, cellStatus.y)}>
            F
          </CellButton>
        </CellDiv>
      )
    }
    case 'opened': {
      return (
        <CellDiv>
          <CellText>
            {cellStatus.isMine ? 'M' : (cellStatus.neighbors !== 0) ? cellStatus.neighbors : ''}
          </CellText>
        </CellDiv>
      )
    }
    default:
      return null
  }
}

export default Cell
