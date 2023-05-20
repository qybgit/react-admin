const CollApsedReducers = (prevState = { isCollapsed: false }, action) => {
  let { type } = action
  switch (type) {
    case 'change_collapsed':
      let newPrevState = { ...prevState }
      newPrevState.isCollapsed = !newPrevState.isCollapsed
      return newPrevState
    default:
      return prevState

  }


}
export default CollApsedReducers