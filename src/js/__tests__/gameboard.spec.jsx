import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import Header from '../components/header';
import GameBoard from '../components/gameboard';

describe('Gameboard', () =>{
  Enzyme.configure({ adapter: new Adapter() })

    //TEST USER
  let user = {
    username: "Player1",
    email: "Player1Email"
  },
  partner = {
    username: "Player2",
    email: "Player2Email"
  },
  connection = {},
  gameMatrix = new Array(8);

  for (var i = 0; i < 8; i += 1) {
    gameMatrix[i] = new Array(8);
    gameMatrix[i].fill(0);
  };

  let gameInstance = {
    scoreBoard: gameMatrix,
    player1: user.username,
    player2: partner.username,
    currentPlayer: user.username,
    isActive: false,
    _id: '123456',
    gameOver: false
  },
  newGameInstance = {};

  var updateGameInstance = (game) => {
    newGameInstance = Object.assign({}, game);
  };

  it('renders correctly',() => {
    const component = Enzyme.shallow(<GameBoard
      gameInstance={gameInstance}
      user={user}
      connection={connection} />);

    expect(component).toMatchSnapshot();
  });

  if('detects wins correctly', () => {
    const component = Enzyme.render(<GameBoard
      gameInstance={gameInstance}
      user={user}
      connection={connection} />);

    component.find('.interactive-tile:nth-child(1)').simulate('click');
  });
});
