import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import { Component } from 'react';
import MarvelService from '../../services/MarvelServices';
import Spinner from '../spinner/Spinner';
import Error from '../error/Error';
class RandomChar extends Component {
	constructor(props) {
		super(props);
	}
	state = {
		char: {},
		loading: true,
		error: false
	}

	marvelService = new MarvelService();

	componentDidMount() {
		this.updateChar()
	}

	onCharLoaded = (char) => {
		this.setState({ char, loading: false })
	}

	onCharLoading = () => {
		this.setState({ loading: true });
	}

	updateChar = () => {
		const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000)
		this.onCharLoading();
		this.marvelService
			.getCharacter(id)
			.then(this.onCharLoaded)
			.catch(this.onError)
	}

	onError = () => {
		this.setState({ loading: false, error: true })
	}

	render() {
		const { char, loading, error } = this.state;
		const loadStatus = loading ? <Spinner /> : null;
		const errorStatus = error ? <Error /> : null;
		const visible = (loadStatus || errorStatus) ? null : <View char={char} />;

		return (
			<div className="randomchar">
				{loadStatus}
				{errorStatus}
				{visible}
				<div className="randomchar__static">
					<p className="randomchar__title">
						Random character for today!<br />
						Do you want to get to know him better?
					</p>
					<p className="randomchar__title">
						Or choose another one
					</p>
					<button className="button button__main" onClick={this.updateChar}>
						<div className="inner">try it</div>
					</button>
					<img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
				</div>
			</div>
		)
	}
}

const View = ({ char: { thumbnail, name, description, homepage, wiki } }) => {
	let thumbnailStyle = { objectFit: 'cover' };

	if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
		thumbnailStyle.objectFit = 'contain';
	}

	return (
		<div className="randomchar__block">
			<img src={thumbnail} style={thumbnailStyle} alt="Random character" className="randomchar__img" />
			<div className="randomchar__info">
				<p className="randomchar__name">{name}</p>
				<p className="randomchar__descr">
					{description}
				</p>
				<div className="randomchar__btns">
					<a href={homepage} className="button button__main">
						<div className="inner">homepage</div>
					</a>
					<a href={wiki} className="button button__secondary">
						<div className="inner">Wiki</div>
					</a>
				</div>
			</div>
		</div>
	)
}

export default RandomChar;