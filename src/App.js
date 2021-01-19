import react from 'react'
import  {Route,BrowserRouter as Router} from 'react-router-dom'

import Game from './components/Game/Game.js'
import Login from './components/Login/Login.js'

const App = ()=>(
    <Router>
        <Route path="/" exact component={Login}></Route>
        <Route path="/game" component={Game}></Route>
    </Router>
)
    

export default App;