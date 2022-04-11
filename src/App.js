import React from 'react'

import Game from './components/Game'

const App = () => {
  return (
    <div onContextMenu={(e) => e.preventDefault()}>
      <Game />
    </div>
  )
}

export default App