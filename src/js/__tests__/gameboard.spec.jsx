import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import Header from '../components/header';
import { UnwrappedGameBoard } from '../components/gameboard';
import socketClient from 'socket.io-client';

describe('Gameboard', () =>{
  Enzyme.configure({ adapter: new Adapter() })

  //TEST USER
  let user = {
    username: "Player1",
    email: "Player1Email"
  },
  partner = { // TEST OPPONENT
    username: "Player2",
    email: "Player2Email"
  },
  connection = socketClient(),
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
    gameOver: false,
  },
  newGameInstance = JSON.parse(JSON.stringify(gameInstance));

  //placeholder for the update method passed to gameboard
  var updateGameInstance = (game) => {
    newGameInstance = Object.assign({}, game);
  };

  it('renders correctly',() => {
    const component = Enzyme.shallow(<UnwrappedGameBoard
      gameInstance={gameInstance}
      user={user}
      connection={connection} />);
    expect(component).toMatchSnapshot();
  });

  it('detects wins correctly', () => {
    const component = Enzyme.mount(<UnwrappedGameBoard
      gameInstance={JSON.parse(JSON.stringify(gameInstance))}
      user={user}
      connection={connection}
      handleGameInstanceUpdate={updateGameInstance} />);

    // test to see if updateGameInstance has not been called when game not active
    component.find('.interactive-tile[data-index=0]').simulate('click');
    expect(newGameInstance.scoreBoard[0][0]).toEqual(0);
    //test to see if turn is managed properly
    newGameInstance.isActive = true;
    component.setProps({gameInstance: newGameInstance});
    component.find('.interactive-tile[data-index=0]').simulate('click');
    expect(newGameInstance.scoreBoard[0][0]).toBe(user.username);
    expect(newGameInstance.currentPlayer).toBe(partner.username);
    // test to see if out of turn click ignored
    component.setProps({gameInstance: newGameInstance});
    component.find('.interactive-tile[data-index=1]').simulate('click');
    expect(newGameInstance.scoreBoard[0][1]).toEqual(0);
    newGameInstance.currentPlayer = user.username;
    //test horizontal win
    component.setProps({gameInstance: newGameInstance});
    component.find('.interactive-tile[data-index=1]').simulate('click');
    expect(newGameInstance.scoreBoard[0][1]).toBe(user.username);
    expect(newGameInstance.gameOver).toBe(false);
    expect(newGameInstance.currentPlayer).toBe(partner.username);

    newGameInstance.currentPlayer = user.username;
    component.setProps({gameInstance: newGameInstance});
    component.find('.interactive-tile[data-index=2]').simulate('click');
    expect(newGameInstance.scoreBoard[0][2]).toBe(user.username);
    expect(newGameInstance.gameOver).toBe(false);
    expect(newGameInstance.currentPlayer).toBe(partner.username);

    newGameInstance.currentPlayer = user.username;
    component.setProps({gameInstance: newGameInstance});
    component.find('.interactive-tile[data-index=3]').simulate('click');
    expect(newGameInstance.scoreBoard[0][3]).toBe(user.username);
    expect(newGameInstance.gameOver).toBe(true);
    expect(newGameInstance.currentPlayer).toBe(user.username);

    /***** test to see if vertical win works *****/
    newGameInstance = JSON.parse(JSON.stringify(gameInstance)); // reset game instance
    newGameInstance.isActive = true;
    component.setProps({gameInstance: newGameInstance});
    component.find('.interactive-tile[data-index=0]').simulate('click');
    expect(newGameInstance.gameOver).toBe(false);
    newGameInstance.currentPlayer = user.username;
    component.setProps({gameInstance: newGameInstance});
    component.find('.interactive-tile[data-index=0]').simulate('click');
    expect(newGameInstance.gameOver).toBe(false);
    newGameInstance.currentPlayer = user.username;
    component.setProps({gameInstance: newGameInstance});
    component.find('.interactive-tile[data-index=0]').simulate('click');
    expect(newGameInstance.gameOver).toBe(false);
    newGameInstance.currentPlayer = user.username;
    component.setProps({gameInstance: newGameInstance});
    component.find('.interactive-tile[data-index=0]').simulate('click');
    expect(newGameInstance.gameOver).toBe(true);
    expect(newGameInstance.currentPlayer).toBe(user.username);
  });
});
