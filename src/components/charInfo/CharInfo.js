import './charInfo.scss';
import { Component } from 'react';
import MarvelService from '../../services/MarvelServices';
import Skeleton from '../skeleton/Skeleton'
import Spinner from '../spinner/Spinner';
import Error from '../error/Error';
import PropTypes from 'prop-types';

class CharInfo extends Component {
	state = {
		char: null,
		loading: false,
		error: false,
	}

	marvelService = new MarvelService();

	componentDidMount() {
		this.updateChar();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.charId === this.props.charId) return;
		this.updateChar();
	}

	updateChar = () => {
		const { charId } = this.props;
		if (!charId) {
			return;
		}
		this.onCharLoading();
		this.marvelService
			.getCharacter(charId)
			.then(this.onCharLoaded)
			.catch(this.onError)
	}

	onCharLoaded = (char) => {
		this.setState({ char, loading: false })
	}

	onCharLoading = () => {
		this.setState({ loading: true });
	}

	onError = () => {
		this.setState({ loading: false, error: true })
	}


	render() {
		const { loading, char, error } = this.state;
		const skeleton = loading || error || char ? null : <Skeleton />
		const spinner = loading ? <Spinner /> : null;
		const errorMessage = error ? <Error /> : null;
		const content = !(!char || spinner || errorMessage) ? <View char={char} /> : null;

		return (
			<div className="char__info">
				{skeleton}
				{spinner}
				{errorMessage}
				{content}
			</div>
		)
	}
}
const View = (props) => {
	const { thumbnail, name, homepage, wiki, description, comics } = props.char;

	let thumbnailStyle = { objectFit: 'cover' };

	if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
		thumbnailStyle.objectFit = 'unset';
	}
	return (
		<>
			<div className="char__basics">
				<img src={thumbnail} style={thumbnailStyle} alt={name} />
				<div>
					<div className="char__info-name">{name}</div>
					<div className="char__btns">
						<a href={homepage} className="button button__main">
							<div className="inner">homepage</div>
						</a>
						<a href={wiki} className="button button__secondary">
							<div className="inner">Wiki</div>
						</a>
					</div>
				</div>
			</div>
			<div className="char__descr">
				{description}
			</div>
			<div className="char__comics">Comics:</div>
			<ul className="char__comics-list">
				{comics.length === 0 ? 'There are no comics for this character' :
					comics.map((item, i) => {
						return (
							<li className="char__comics-item" key={i}>
								{item.name}
							</li>
						)
					})}
			</ul>
		</>

	)
}

CharInfo.propTypes = {
	charId: PropTypes.number
}

export default CharInfo;