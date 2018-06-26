import  Cookie from 'js-cookie';


function qs(params) {
	const esc = encodeURIComponent;
	const makePair = (key, value) => `${esc(key)}=${esc(value)}`;

	let querystring;

	if (params == null) {
		return '';
	}

	if (Array.isArray(params)) {
		querystring = params.map(makePair);
	} else {
		querystring = Object.keys(params).map((key) => makePair(key, params[key]));
	}

	if (querystring.length) {
		return `?${querystring.join('&')}`;
	} else {
		return '';
	}
}


export default class Api {
	baseURL = '/api/';

	constructor(options) {
		Object.assign(this, options);
	}

	url(path, params) {
		return `${this.baseURL}${path}${qs(params)}`;
	}

	fetchFeeds(filters) {
		return fetch(this.url('feeds/', filters), {
			credentials: 'same-origin'
		})
		.then((resp) => resp.json());
	}

	fetchArticles(filters) {
		return fetch(this.url('articles/', filters), {
			credentials: 'same-origin',
		})
		.then((resp) => resp.json());
	}

	readArticle(articleId) {
		return fetch(this.url(`articles/${articleId}/mark_read/`), {
			credentials: 'same-origin',
			method: 'POST',
			headers: {'X-CSRFToken': Cookie.get('csrftoken')},
		});
	}

}
