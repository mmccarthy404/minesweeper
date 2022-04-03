import { createStore, combineReducers } from 'redux'

import boardReducer from './reducers/boardReducer'

const reducer = combineReducers({
  board: boardReducer
})

const store = createStore(reducer)

export default store