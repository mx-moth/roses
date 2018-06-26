import moment from 'moment-with-locales-es6';

import Api from './api';
import * as actions from './actions';


export const SELECT_FEED = 'SELECT_FEED';
export const REQUEST_FEEDS = 'REQUEST_FEEDS';
export const RECEIVE_FEEDS = 'RECEIVE_FEEDS';

export const SELECT_ARTICLE = 'SELECT_ARTICLE';
export const REQUEST_ARTICLES = 'REQUEST_ARTICLES';
export const RECEIVE_ARTICLES = 'RECEIVE_ARTICLES';
export const READ_ARTICLE = 'READ_ARTICLE';


const api = new Api();


/**
 * Convert an array of [{id: 1, name: "foo"}, {id: 2, name: "bar"}]
 * to an object of {1: {id: 1, name: "foo"}, 2: {id: 2, name: "bar"}}
 */
const arrayToIdMap = (array, getId = (item => item.id)) => {
	const obj = {};
	for (let item of array) {
		obj[getId(item)] = item;
	}
	return obj;
};


export const selectFeed = feedId => ({
	type: actions.SELECT_FEED,
	feedId: feedId,
});


export const selectArticle = articleId => ({
	type: actions.SELECT_ARTICLE,
	articleId: articleId,
});


export const requestFeeds = {
	type: actions.REQUEST_FEEDS,
};


export const receiveFeeds = (feeds) => ({
	type: actions.RECEIVE_FEEDS,
	feeds: feeds,
	receivedAt: Date.now(),
});


export const processIncomingFeed = (feed) => ({
	...feed,
});


export const fetchFeeds = dispatch => {
	dispatch(requestFeeds);

	return api.fetchFeeds()
	.then(feeds => feeds.map(processIncomingFeed))
	.then(arrayToIdMap)
	.then(feeds => dispatch(receiveFeeds(feeds)));
};


export const requestArticles = (feedId) => ({
	type: actions.REQUEST_ARTICLES,
	feedId: feedId,
});


export const receiveArticles = (feedId, articles) => ({
	type: actions.RECEIVE_ARTICLES,
	feedId: feedId,
	articles: articles,
	receivedAt: Date.now()
});


export const processIncomingArticle = (article) => ({
	...article,
	published_date: moment(article.published_date),
});


export const fetchArticles = feedId => dispatch => {
	dispatch(requestArticles(feedId));

	api.fetchArticles({feed: feedId})
	.then(articles => articles.map(processIncomingArticle))
	.then(arrayToIdMap)
	.then(articles => dispatch(receiveArticles(feedId, articles)));
};


export const markRead = articleId => dispatch => {
	dispatch({
		type: actions.READ_ARTICLE,
		articleId: articleId,
	});

	api.readArticle(articleId);
};
