import moment from 'moment-with-locales-es6';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { configureStore, history } from './store';
import App from './components/App';

const store = configureStore({});

moment.locale('en-au');

document.addEventListener('DOMContentLoaded', () => {
	ReactDOM.render(
		<Provider store={store}>
			<App />
		</Provider>,
		document.querySelector("#target")
	);
});
