import { CONNECT_SOCKET, GAME_MOVE, LOAD_USER_DETAILS, LOAD_GAME_INSTANCE, LOAD_ALL_GAMES, LOGOUT } from './actions';

export function setAllGames(response) {
  return {
    type: LOAD_ALL_GAMES,
    payload: response,
  };
}

export function setUserDetails(response) {
  return {
    type: LOAD_USER_DETAILS,
    payload: response,
  };
}

export function setGameInstance(gameInstance) {
  return {
    type: LOAD_GAME_INSTANCE,
    payload: gameInstance,
  };
}

export function setSocketConnection(connection) {
  return {
    type: CONNECT_SOCKET,
    payload: connection,
  };
}

export function setGameMove(gameInstance) {
  return {
    type: GAME_MOVE,
    payload: gameInstance,
  };
}

export function logout() {
  return {
    type: LOGOUT,
  };
}
