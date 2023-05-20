import { createStore, combineReducers } from "redux"
import CollApsedReducers from "./reducer/CollApsed"
const reducer = combineReducers({
  CollApsedReducers
})
const store = createStore(reducer)
export default store
