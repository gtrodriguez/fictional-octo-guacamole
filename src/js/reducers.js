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

const setConnection = (state, action) => Object.assign({}, state, {
  connection: action.payload,
});
const setUserDetails = (state, action) => Object.assign({}, state, {
  user: action.payload.user,
  allGames: action.payload.allGames,
});
const setGameInstance = (state, action) => Object.assign({}, state, {
  gameInstance: action.payload,
  gameId: action.payload._id,
});
const setAllGames = (state, action) => Object.assign({}, state, {
  allGames: action.payload
});
const logout = (state, action) => Object.assign({}, state, {
  user: null,
  gameId: null,
  gameInstance: null,
  allGames: [],
  invitedGames: [],
});

const DEFAULT_STATE = {
  user: null,
  gameId: null,
  gameInstance: null,
  allGames: [],
  connection: null,
  invitedGames: [],
};

const rootReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case GAME_MOVE:
      return setGameInstance(state, action);
    case CONNECT_SOCKET:
      return setConnection(state, action);
    case LOAD_USER_DETAILS:
      return setUserDetails(state, action);
    case LOAD_GAME_INSTANCE:
      return setGameInstance(state, action);
    case LOAD_ALL_GAMES:
      return setAllGames(state, action);
    case LOGOUT:
      return logout(state, action);
    default:
      return state;
  }
};

export default rootReducer;
