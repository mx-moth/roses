import React from 'react';

export default class Popup extends React.Component {

	constructor(props) {
		super(props);
		this.popup = null;
	}

	render() {
		return (
			<button onClick={() => this.openPopup()}>
				Open article in popup
			</button>
		);
	}

	getPopupFeatures() {
		// TODO Getting the parent element is a bit of a hack, probs do that better?
		const bounds = this.props.containerRef.current.getBoundingClientRect();

		// The amount of padding to put around the popup 'within' the container.
		const padding = 10;

		// The height of the browser chrome. This is imprecise, as title bars
		// are not correctly or consistently accounted for.
		const browserChrome = window.outerHeight - window.innerHeight;

		// Where to put the popup.
		const left = window.screenX + bounds.left + padding;
		const top = window.screenY + bounds.top + padding + browserChrome;
		const width = bounds.width - padding * 2;
		const height = bounds.height - padding * 2;

		return [
			"scrollbars",
			"dependent",
			`left=${left}`,
			`top=${top}`,
			`outerWidth=${width}`,
			`outerHeight=${height}`,
		].join(',');
	}

	openPopup() {
		console.log("Opening a popup!");
		console.log(this.popup);
		if (this.popup && !this.popup.closed) {
			console.log("Reusing a popup");
			this.popup.location = 'about:blank';
			this.popup.focus();

			window.setTimeout(() => {
				this.popup.location = this.props.url;
			});
		} else {
			console.log("Making a new popup");
			const features = this.getPopupFeatures();
			this.popup = window.open(this.props.url, '_blank', features);
		}
		this._currentUrl = this.props.url;
	}

	bind() {
		this._unloadHandler = () => {
			if (this.popup) this.popup.close();
		};
		window.addEventListener('beforeunload', this._unloadHandler);
	}
	unbind() {
		window.removeEventListener('beforeunload', this._unloadHandler);
	}

	componentDidMount() {
		setTimeout(() => {
			this.openPopup();
			this.bind();
		});
	}
	componentDidUpdate() {
		console.log("Component did update");
		if (!this.popup || this.popup.closed || this.props.url != this._currentUrl) {
			console.log("Looks like something changed");
			this.openPopup();
		}
	}
	componentWillUnmount() {
		this.unbind();
		if (this.popup) {
			this.popup.close();
		}
	}
}
