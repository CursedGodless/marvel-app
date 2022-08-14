import './charList.scss';
import { Component } from 'react';
import MarvelService from '../../services/MarvelServices';
import Spinner from '../spinner/Spinner';
import Error from '../error/Error';
import Loading from '../loading/Loading';
class CharList extends Component {

	state = {
		chars: [],
		loading: true,
		error: false,
		newItemLoading: false,
		offset: 1550,
		charEnded: false
	}


	marvelService = new MarvelService();

	componentDidMount() {
		this.updateChar()
	}

	onCharsLoaded = (nextChars) => {
		let ended = false;
		if (nextChars.length < 9) {
			ended = true;
		}

		this.setState(({ chars, newItemLoading, offset }) => ({
			chars: [...chars, ...nextChars],
			loading: false,
			newItemLoading: false,
			offset: offset + 9,
			charEnded: ended
		}))
	}

	onCharsLoading = () => {
		this.setState({ newItemLoading: true });
	}

	updateChar = () => {
		this.onCharsLoading();
		this.marvelService
			.getAllCharacters(this.state.offset)
			.then(this.onCharsLoaded)
			.catch(this.onError)
	}

	onError = () => {
		this.setState({ loading: false, error: true })
	}

	renderButton = () => {
		return (
			<button className="button button__main button__long"
				onClick={this.updateChar}>
				<div className="inner">load more</div>
			</button>
		)
	}

	renderList = (chars) => {
		const charsItem = chars.map(item => {
			const { thumbnail, alt, name, id } = item;
			let thumbnailStyle = { objectFit: 'cover' };

			if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
				thumbnailStyle.objectFit = 'contain';
			}
			return (
				<li className="char__item" onClick={() => this.props.onCharSelected(id)} key={id}>
					<img src={thumbnail} alt={alt} style={thumbnailStyle} />
					<div className="char__name">{name}</div>
				</li>
			)
		});
		return (
			<ul className="char__grid">
				{charsItem}
			</ul>
		)
	}

	render() {
		const { chars, loading, error, newItemLoading, charEnded } = this.state;
		const loadStatus = loading ? <Spinner /> : null;
		const errorStatus = error ? <Error /> : null;
		const visible = (loadStatus || errorStatus) ? null : this.renderList(chars);
		const loadButton = newItemLoading ? <Loading /> : this.renderButton()

		return (
			<div className="char__list">
				{loadStatus}
				{errorStatus}
				{visible}
				{!charEnded ? loadButton : null}
			</div>
		)
	}
}

export default CharList;