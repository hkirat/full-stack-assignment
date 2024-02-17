import Signup from './components/Signup';
import Login from './components/Login';
import Questions from './components/Questions';
import Dashboard from './components/Dashboard';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
function App() {


  return (
    <div className="App">
      <Router>
      <Route path="/Signup" exact component={Signup} />
        <Route path="/login" component={Login} />
      <Route path="/questions" component={Questions}/>
      <Route path="/dashboard" component={Dashboard} />
      </Router>
       
    </div>
  );
}

export default App;
