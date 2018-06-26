import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import IFrame from './IFrame';
import { markRead } from '../actions';

const Description = ({ article }) => {
	const html = {__html: article.description};
	return (
		<IFrame className='viewer--iframe'>
			<div>
				<h1>{article.title}</h1>
				<p>
					<a href={article.url} target="_blank">Open article URL in a new tab</a>
				</p>
				<hr/>
				<div dangerouslySetInnerHTML={html} />
			</div>
		</IFrame>
	);
};
Description.propTypes = {
	feed: PropTypes.object.isRequired,
	article: PropTypes.object.isRequired,
};

class ArticleDetail extends React.Component {
	wrap(els) {
		return <div className="viewer">
			{els}
		</div>;
	}

	makeViewer() {
		const showAs = this.props.feed.show_as;
		let viewer;

		if (showAs == 'url') {
			return <iframe className="viewer--iframe" src={this.props.article.url} />;
		} else {
			return <Description article={this.props.article} feed={this.props.feed} />;
		}
	}

	render() {
		if (this.props.feed === null) {
			return this.wrap(<p>Select a feed</p>);
		}
		if (this.props.article === null) {
			return this.wrap(<p>Select an article</p>);
		}

		return this.wrap(this.makeViewer());
	}

	componentDidMount() {
		this.startedReading();
	}

	componentWillUnmount() {
		this.cancelReading();
	}

	componentDidUpdate() {
		this.cancelReading();
		this.startedReading();
	}

	startedReading() {
		if (this.props.article === null) return;
		if (this.props.article.read) return;

		// TODO Make this timeout configurable
		this.readTimeout = setTimeout(() => this.markRead(), 2000);
	}

	cancelReading() {
		clearTimeout(this.readTimeout);
		this.readTimeout = null;
	}

	markRead() {
		this.props.markRead(this.props.article.id);
	}
}


const mapStateToProps = state => {
	const props = { feed: null, article: null };
	if (state.selectedFeed == null) {
		return props;
	}
	props.feed = state.feeds.items[state.selectedFeed];

	if (state.selectedArticle == null) {
		return props;
	}
	props.article = state.articles.items[state.selectedArticle];

	return props;
};


const mapDispatchToProps = dispatch => ({
	markRead: id => dispatch(markRead(id))
});


export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ArticleDetail);
