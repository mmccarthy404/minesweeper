import React from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { clickTile, flagTile } from '../reducers/boardReducer'

const TileDiv = styled.div`
  position: relative;
  float: left;
  width: 20px;
  height: 20px;
  box-sizing: border-box;
  border: 1px solid black;
  background: lightblue;
`

const TileText = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

const TileButton = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 1px solid black;
  background-color: rgba(255, 0, 0, 0.4);
`;

const Tile = ({ data }) => {
  const dispatch = useDispatch()

  const handleLeftClick = (x, y) => {
    dispatch(clickTile(x, y))
  }

  const handleRightClick = (e, x, y) => {
    e.preventDefault()
    dispatch(flagTile(x, y))
  }

  switch (data.state) {
    case 'unopened': {
      return (
        <TileDiv>
          <TileButton onClick={() => handleLeftClick(data.x, data.y)} onContextMenu={(e) => handleRightClick(e, data.x, data.y)} />
        </TileDiv>
      )
    }
    case 'flagged': {
      return (
        <TileDiv>
          <TileButton onContextMenu={(e) => handleRightClick(e, data.x, data.y)}>
            F
          </TileButton>
        </TileDiv>
      )
    }
    case 'opened': {
      return (
        <TileDiv>
          <TileText>
            {data.isMine ? 'M' : (data.neighbors !== 0) ? data.neighbors : ''}
          </TileText>
        </TileDiv>
      )
    }
    default:
      return null
  }
}

export default Tile
