import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { selectArticle } from '../actions';

const ArticleItem = ({ article, isSelected, onClick }) => {
	const className = classnames('articles--item', 'article', {
		'article__unread': !article.read,
		'article__selected': isSelected,
	});
	return (
		<li className={className} onClick={onClick}>
			<span class='article--title'>{article.title}</span>
			<br />
			{article.published_date.calendar()}
		</li>
	);
};
ArticleItem.propTypes = {
	article: PropTypes.object.isRequired,
};


const ArticleList = ({
	feed, articles, selectedArticle,
	selectArticle,
}) => {
	if (feed === null) {
		return <div className="articles"></div>;
	}
	if (articles === null) {
		return <div className="articles">Loading...</div>;
	}

	const onClick = () => selectArticle(article);

	return (
		<div className="articles">
			<h2 className="articles--title">{feed.name}</h2>
			<div className="articles--meta">
				<a href={feed.homepage} target="_blank">Open homepage</a>
			</div>
			<ul className="articles--list">
				{articles.map((article) => {
					return <ArticleItem
						key={article.id}
						article={article}
						isSelected={article.id == selectedArticle}
						onClick={() => selectArticle(article.id)} />;
				})}
			</ul>
		</div>
	);
};
ArticleList.propTypes = {
	feed: PropTypes.object,
	articles: PropTypes.arrayOf(PropTypes.object),
};


const mapStateToProps = state => {
	if (state.selectedFeed == null) {
		return {
			feed: null,
			articles: null,
		};
	}

	const feed = state.feeds.items[state.selectedFeed];
	return {
		feed: feed,
		articles: Object.values(state.articles.items)
			.filter((article) => article.feed_id == feed.id)
			.sort((a, b) => +(b.published_date) - (a.published_date)),
		selectedArticle: state.selectedArticle,
	};
};


const mapDispatchToProps = dispatch => ({
	selectArticle: articleId => dispatch(selectArticle(articleId))
});


export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ArticleList);
