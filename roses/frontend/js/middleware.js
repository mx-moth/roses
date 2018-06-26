import { normalize, schema } from 'normalizr';

const API_ROOT = '/api/';

const callApi = (endpoint, schema) => {
	const fullUrl = API_ROOT + endpoint;

	return fetch(fullUrl)
	.then(response => response.json().then(json => {
		if (!response.ok) {
			return Promise.reject(json);
		}

		return Object.assign({}, normalize(json, schema));
	}));
};

const feedSchema = new schema.Entity('feeds');
const articleSchema = new schema.Entity('articles');

export const Schemas = {
	FEED: feedSchema,
	FEED_ARRAY: [feedSchema],
	ARTICLE: articleSchema,
	ARTICLE_ARRAY: [articleSchema],
};

export const CALL_API = 'Call API';

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
	const callAPI = action[CALL_API];
	if (typeof callAPI === 'undefined') {
		return next(action);
	}

	let { endpoint } = callAPI;
	const { schema, types } = callAPI;

	if (typeof endpoint === 'function') {
		endpoint = endpoint(store.getState());
	}

	if (typeof endpoint !== 'string') {
		throw new Error('Specify a string endpoint URL.');
	}
	if (!schema) {
		throw new Error('Specify one of the exported Schemas.');
	}
	if (!Array.isArray(types) || types.length !== 3) {
		throw new Error('Expected an array of three action types.');
	}
	if (!types.every(type => typeof type === 'string')) {
		throw new Error('Expected action types to be strings.');
	}

	const actionWith = data => {
		const finalAction = Object.assign({}, action, data);
		delete finalAction[CALL_API];
		return finalAction;
	};

	const [ requestType, successType, failureType ] = types;
	next(actionWith({ type: requestType }));

	return callApi(endpoint, schema).then(
		response => next(actionWith({
			response: response,
			type: successType,
		})),
		error => next(actionWith({
			type: failureType,
			error: error.message || 'Something bad happened',
		}))
	);
};
