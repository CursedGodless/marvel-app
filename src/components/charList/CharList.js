import './charList.scss';
import { Component } from 'react';
import MarvelService from '../../services/MarvelServices';
import Spinner from '../spinner/Spinner';
import Error from '../error/Error';
class CharList extends Component {
	state = {
		chars: [],
		loading: true,
		error: false
	}


	marvelService = new MarvelService();

	componentDidMount() {
		this.updateChar()
	}

	onCharsLoaded = (chars) => {
		this.setState({ chars, loading: false })
	}

	onCharsLoading = () => {
		this.setState({ loading: true });
	}

	updateChar = () => {
		this.onCharsLoading();
		this.marvelService
			.getAllCharacters()
			.then(this.onCharsLoaded)
			.catch(this.onError)
	}

	onError = () => {
		this.setState({ loading: false, error: true })
	}

	render() {
		const { chars, loading, error } = this.state;
		const loadStatus = loading ? <Spinner /> : null;
		const errorStatus = error ? <Error /> : null;
		const visible = (loadStatus || errorStatus) ? null : chars.map(item => <CharItem {...item} key={item.id} />);

		return (
			<div className="char__list">
				<ul className="char__grid">
					{loadStatus}
					{errorStatus}
					{visible}
				</ul>
				<button className="button button__main button__long">
					<div className="inner">load more</div>
				</button>
			</div>
		)
	}
}


const CharItem = (props) => {
	const { thumbnail, alt, name } = props;
	let thumbnailStyle = { objectFit: 'cover' };

	if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
		thumbnailStyle.objectFit = 'contain';
	}
	return (
		<li className="char__item">
			<img src={thumbnail} alt={alt} style={thumbnailStyle}/>
			<div className="char__name">{name}</div>
		</li>
	)
}

export default CharList;