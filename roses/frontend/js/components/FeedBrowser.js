import React from 'react';
import { Route, RedirectTo } from 'react-router-dom';

import ArticleDetail from './ArticleDetail';
import ArticleList from './ArticleList';
import FeedList from './FeedList';


function iterDict(iterable) {
	const object = {};
	for (let [key, value] of iterable) {
		object[key] = value;
	}
	return object;
}


export default class FeedBrowser extends React.Component {

	render() {
		const match = this.props.match;

		return <div className="three-cols">
			<FeedList />
			<ArticleList />
			<ArticleDetail />
		</div>;
	}

}
