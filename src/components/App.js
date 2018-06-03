import React, { Component } from 'react';
import Login from './Login';
import { NavLink, Route, HashRouter as Router, Switch } from 'react-router-dom';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import Categories from './Categories';
import CurrentGame from './CurrentGame';
import PastGames from './PastGames';
import Category from './Category';
import Teams from './Teams';
import Home from './Home';
import Sidebar from './Sidebar';
import Banner from './Banner';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      bar: {},
      loggedIn: false
    }
    this.logout = this.logout.bind(this)
    this.login = this.login.bind(this)
    this.whoAmI = this.whoAmI.bind(this)
  }

  componentDidMount(){
    this.whoAmI();
  }

  componentWillReceiveProps(){
    this.whoAmI();
  }

  whoAmI(){
    const user = localStorage.getItem('token')
    if (user) {
      const token = jwt.verify(user, 'untappedpotential')
      axios.post(`/v1/bars/${token.id}`, token)
      .then(res => res.data)
      .then(bar => this.setState({ bar, loggedIn: true }))
    }
  }

  logout(){
    localStorage.removeItem('token')
    this.setState({ loggedIn: false })
  }

  login(user){
    localStorage.setItem('token',  user.token )
    this.setState({ loggedIn: true })
  }

  render(){ 
    const { bar, loggedIn } = this.state; 
    if (!bar.name) this.whoAmI()
    return (
      <Router>
        <div className='main'>
          <Banner loggedIn={loggedIn} logout={this.logout} bar={bar} />
          { loggedIn ? <Sidebar /> : null }
          <div className={`${ loggedIn ? 'container app' : 'loggedOut'}`}>
          <Switch>
            <Route path="/" exact render={() => <Home bar={bar}/> }/>
            <Route path="/login" render={({history}) => <Login login={this.login} history={history}/>}/>
            <Route path="/categories" exact component={Categories}/>
            <Route path="/categories/:id" component={Category}/>
            <Route path="/teams" component={Teams}/>
            <Route path="/games/active" exact component={CurrentGame}/>
            <Route path="/games/past" exact component={PastGames}/>
          </Switch>
          </div>
        </div>
      </Router>
    );
  }
};

export default App;
