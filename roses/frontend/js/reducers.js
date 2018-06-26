import { combineReducers } from 'redux';
import * as actions from './actions';


function selectedFeed(state = null, action) {
	switch (action.type) {
	case actions.SELECT_FEED:
		return action.feedId;
	default:
		return state;
	}
}


function selectedArticle(state = null, action) {
	switch (action.type) {
	case actions.SELECT_ARTICLE:
		return action.articleId;
	case actions.SELECT_FEED:
		return null;
	default:
		return state;
	}
}


function feeds(
	state = {
		isFetching: false,
		lastUpdates: null,
		items: {},
	},
	action,
) {
	switch (action.type) {
	case actions.REQUEST_FEEDS:
		return {
			...state,
			isFetching: true,
		};

	case actions.RECEIVE_FEEDS:
		return {
			...state,
			isFetching: false,
			items: action.feeds,
			lastUpdated: action.receivedAt,
		};

	default:
		return state;
	}
}


function article(state, action) {
	switch (action.type) {
	case actions.READ_ARTICLE:
		return {
			...state,
			read: true,
		};
	}
}


function articleList(state, action) {
	let item = state[action.articleId];
	if (item == null) return state;

	return {
		...state,
		[item.id]: article(item, action),
	};
}

function articles(
	state={
		isFetching: false,
		lastUpdated: null,
		items: {},
	},
	action,
) {
	switch (action.type) {
	case actions.REQUEST_ARTICLES:
		return {
			...state,
			isFetching: true,
		};

	case actions.RECEIVE_ARTICLES:
		return {
			...state,
			isFetching: false,
			items: {
				...state.items,
				...action.articles,
			},
			lastUpdated: action.receivedAt,
		};

	// Actions on individual articles
	case actions.READ_ARTICLE:
		return {
			...state,
			items: articleList(state.items, action),
		};

	default:
		return state;
	}
}


function articlesByFeed(state = {}, action) {
	switch (action.type) {
	case actions.REQUEST_ARTICLES:
	case actions.RECEIVE_ARTICLES:
		return Object.assign({}, state, {
			[action.feedId]: articles(state[action.feedId], action),
		});
	default:
		return state;
	}
}

export const rootReducer = combineReducers({
	feeds: feeds,
	articles: articles,
	selectedFeed: selectedFeed,
	selectedArticle: selectedArticle,
});
