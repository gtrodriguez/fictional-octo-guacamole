import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import Landing from './containers/landing';
import GameRoom from './containers/gameroom';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className="app">
          <Route path="/" component={Landing} />
          <Route path="/gameroom" component={GameRoom} />
        </div>
      </BrowserRouter>
    );
  }
}

render(<App />, document.getElementById('app'));

export default App;
