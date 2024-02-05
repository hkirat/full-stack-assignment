import Signup from './components/Signup';
import Login from './components/Login';
import Questions from './components/Questions';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
function App() {


  return (
    <div className="App">
      <Switch>
      <Route path="/Signup" exact component={Signup} />
        <Route path="/login" component={Login} />
      <Route path="/problemstatement" component={Questions}/>
      </Switch>
        
     {/* <Signup />
     <Login /> */}
    </div>
  );
}

export default App;
