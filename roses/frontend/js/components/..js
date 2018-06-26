import PropTypes from 'prop-types';
import React from 'react';


const FeedItem = ({feed, onClick}) => {
	<li className="feeds--item feed" onClick={this.props.onClick}>
		{this.props.feed.name}
	</li>;
};
FeedItem.propTypes = {
	feed: PropTypes.object.isRequired,
	onClick: PropTypes.func,
};


const mapStateToProps = state => ({
  feeds: state.feeds,
  selectedFeed: state.selectedFeed,
})

const mapDispatchToProps = dispatch => ({
  selectFeed: id => dispatch(selectFeed(id))
})


class FeedList extends React.Component {
	static propTypes = {
		feeds: PropTypes.arrayOf(PropTypes.object),
	}

	render() {
		if (this.props.feeds === null) {
			return <div className="feeds">Loading...</div>;
		}
		return (
			<div className="feeds">
				<h2 className="feeds--title">Feeds</h2>
				<ul className="feeds--list">
					{this.props.feeds.map((feed) => {
						return <FeedItem
							key={feed.id}
							feed={feed}
							onClick={() => this.props.selectFeed(feed)} />;
					})}
				</ul>
			</div>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FeedList);
