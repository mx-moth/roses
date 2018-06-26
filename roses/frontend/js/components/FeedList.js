import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { selectFeed, fetchArticles } from '../actions';


const FeedItem = ({ feed, isSelected, onClick }) => {
	const className = classnames("feeds--item", "feed", {"feed--selected": isSelected});
	return (
		<li onClick={onClick} className={className}>
			{feed.name}
		</li>
	);
};
FeedItem.propTypes = {
	feed: PropTypes.object.isRequired,
	onClick: PropTypes.func,
};


const FeedList = ({
	feeds, selectedFeed,
	selectFeed
}) => {
	if (feeds === null) {
		return <div className="feeds">Loading...</div>;
	}
	return (
		<div className="feeds">
			<h2 className="feeds--title">Feeds</h2>
			<ul className="feeds--list">
				{Object.values(feeds.items).map((feed) => {
					return <FeedItem
						key={feed.id}
						feed={feed}
						isSelected={feed.id == selectedFeed}
						onClick={() => selectFeed(feed)} />;
				})}
			</ul>
		</div>
	);
};
FeedList.propTypes = {
	// feeds: PropTypes.arrayOf(PropTypes.object),
};


const mapStateToProps = state => ({
	feeds: state.feeds,
	selectedFeed: state.selectedFeed,
});


const mapDispatchToProps = dispatch => ({
	selectFeed: (feed) => {
		dispatch(selectFeed(feed.id));
		dispatch(fetchArticles(feed.id));
	},
});


export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(FeedList);
