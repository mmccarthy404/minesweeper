import { createStore, combineReducers } from 'redux'

import gameReducer from './reducers/gameReducer'

const reducer = combineReducers({
  game: gameReducer
})

const store = createStore(reducer)

export default store