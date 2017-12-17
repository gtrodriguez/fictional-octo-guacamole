import { CONNECT_SOCKET, GAME_MOVE, LOAD_USER_DETAILS, LOAD_GAME_INSTANCE, LOAD_ALL_GAMES, LOGOUT } from './actions';

/*
export const CONNECT_SOCKET = 'CONNECT_SOCKET';
export const REGISTER_USER = 'REGISTER_USER';
export const NEW_GAME = 'NEW_GAME';
export const FORFEIT_GAME = 'FORFEIT_GAME';
export const GAME_MOVE = 'GAME_MOVE';
export const LOAD_USER_DETAILS = 'LOAD_USER_DETAILS';
export const LOAD_ALL_GAMES = 'LOAD_ALL_GAMES';
export const LOAD_GAME_INSTANCE = 'LOAD_GAME_INSTANCE';
*/

export function setAllGames(response) {
  return {
    type: LOAD_ALL_GAMES, 
    payload: response,
  }
}

export function setUserDetails(response) {
  return {
    type: LOAD_USER_DETAILS,
    payload: response,
  }
}

export function setGameInstance(gameInstance) {
  return {
    type: LOAD_GAME_INSTANCE,
    payload: gameInstance
  }
}

export function setSocketConnection(connection) {
  return {
    type: CONNECT_SOCKET,
    payload: connection,
  }
}

export function setGameMove(gameInstance) {
  return {
    type: GAME_MOVE,
    payload: gameInstance,
  }
}

export function logout() {
  return {
    type: LOGOUT,
  }
}