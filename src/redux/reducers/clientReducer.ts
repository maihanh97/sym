import Types from '../types';
import {AnyAction} from 'redux';

const initState = {
    statusApproved: false
};

const ClientReducer = (state = initState, action: AnyAction) => {
  const {type, payload} = action;
  switch (type) {
    case Types.GET_STATUS_UPDATE_API: {
        return {
            ...state,
            statusApproved: !state.statusApproved
        }
    }
    default:
      return state;
  }
};

export default ClientReducer;
