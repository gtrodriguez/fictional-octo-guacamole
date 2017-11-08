import { * } from './actions';
import { * } from './actionCreators';


export const reduceRegisterUser = (state, action) => {
  const newState = {};

  Object.assign(newState, state, {'connection': action.payload});

  return newState;
};

const initialState = {

};

export const rootReducer = (state = initialState, action) => {
  switch(action.type){
    case REGISTER_USER: 
      return reduceRegisterUser(state, action);
    default: 
      return state;
  }
};