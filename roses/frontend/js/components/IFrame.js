import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

export default class IFrame extends React.Component {
	static propTypes = {
		// renderHead: PropTypes.func,
		// renderBody: PropTypes.func,
	}

	static defaultProps = {
		// renderHead: () => null,
		// renderBody: () => null,
	}

	constructor(props) {
		super(props);
		this.loaded = false;
	}

	updateIFrameContents () {
		if (!this.loaded) return;
		// const head = this.props.renderHead();
		// const body = this.props.renderBody();

		//ReactDOM.render(head, this.frameHead);
		ReactDOM.render(this.props.children, this.frameBody);
	}

	render() {
		const attrs = Object.assign({}, this.props);
		delete attrs.renderHead;
		delete attrs.renderBody;
		return (
			<iframe ref="iframe" onLoad={() => this.onLoad()} {...attrs}/>
		);
	}

	onLoad() {
		this.fetchElements();
		this.loaded = true;
		this.updateIFrameContents();
	}

	fetchElements() {
		const iframeDoc = this.refs.iframe.contentDocument;
		const el = iframeDoc.createElement('div');
		iframeDoc.body.appendChild(el);

		this.frameBody = el;
		this.frameHead = iframeDoc.head;
	}

	componentDidMount() {
		this.updateIFrameContents();
	}

	componentDidUpdate() {
		this.updateIFrameContents();
	}
}
