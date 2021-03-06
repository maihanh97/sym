import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers/rootReducer';
import {createStore, applyMiddleware} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import ReduxPersist from '../../config/ReduxPersist';
import createSagaMiddleware from 'redux-saga'
import rootSaga from '../sagas/rootSaga';

const persistedReducer = persistReducer(ReduxPersist.storeConfig, rootReducer);
const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  persistedReducer,
  applyMiddleware(thunkMiddleware, sagaMiddleware),
);
sagaMiddleware.run(rootSaga)
const persistor = persistStore(store);
export {store, persistor};
