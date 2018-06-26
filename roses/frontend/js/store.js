import api from './middleware';
import thunk from 'redux-thunk';
import { rootReducer } from './reducers';

import { applyMiddleware, compose, createStore } from 'redux';
import { createBrowserHistory } from 'history';


export const history = createBrowserHistory();


const createStoreWithMiddleware = applyMiddleware(
	thunk,
	api,
)(createStore);


export function configureStore(preloadedState) {
	const store = createStoreWithMiddleware(
		rootReducer,
		preloadedState,
		window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
	);

	if (module.hot) {
		module.hot.accept('./reducers', () => {
			const nextReducer = require('./reducers').default;
			store.replaceReducer(nextReducer);
		});
	}

	return store;
}
