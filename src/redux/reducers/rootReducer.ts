import {combineReducers} from 'redux';
import user from './UserReducer';
import auth from './authReducer';
import client from './clientReducer';


const rootReducer = combineReducers({
  user,
  auth,
  client,
});

export default rootReducer;
