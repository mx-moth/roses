import 'whatwg-fetch';

import React from 'react';
import PropTypes from 'prop-types';
import { Route, RedirectTo } from 'react-router-dom';
import { connect } from 'react-redux';

import FeedBrowser from './FeedBrowser';
import { fetchFeeds } from '../actions';

class App extends React.Component {

	componentDidMount() {
		this.props.fetchFeeds();
	}

	render() {
		return (
			<div className="app">
				<div className="header">
					Roses
				</div>
				<FeedBrowser />
			</div>
		);
	}

}


const mapStateToProps = state => ({
});


const mapDispatchToProps = dispatch => ({
	fetchFeeds: () => dispatch(fetchFeeds)
});


export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App);
