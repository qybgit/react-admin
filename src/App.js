import IndexRouter from "./router/IndexRouter"
import './App.css'
import { Provider } from 'react-redux'
import store from "./redux/store"
function App () {
  return (
    <div className="App">
      <Provider store={store}>
        <IndexRouter></IndexRouter>

      </Provider>
    </div>
  )
}

export default App
