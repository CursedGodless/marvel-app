import './charList.scss';
import { useState, useEffect, useMemo } from 'react';
import MarvelService from '../../services/MarvelServices';
import Spinner from '../spinner/Spinner';
import Error from '../error/Error';
import Loading from '../loading/Loading';
import PropTypes from 'prop-types';

function CharList(props) {

	const [chars, setChars] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(false)
	const [newItemLoading, setNewItemLoading] = useState(false)
	const [offset, setOffset] = useState(210)
	const [charEnded, setCharEnded] = useState(false)
	const [selectedChar, setSelectedChar] = useState(null);

	const marvelService = new MarvelService();
	useEffect(() => {
		updateChar()
	}, [])

	const onCharsLoaded = (nextChars) => {
		let ended = false;
		if (nextChars.length < 9) {
			ended = true;
		}

		setChars(chars => [...chars, ...nextChars]);
		setLoading(false);
		setNewItemLoading(false);
		setOffset(offset => offset + 9);
		setCharEnded(ended);
	}

	const onCharsLoading = () => {
		setNewItemLoading(true)
	}

	const updateChar = () => {
		onCharsLoading();
		marvelService
			.getAllCharacters(offset)
			.then(onCharsLoaded)
			.catch(onError)
	}

	const onError = () => {
		setLoading(false);
		setError(true);
	}

	const renderButton = () => {
		return (
			<button className="button button__main button__long"
				onClick={updateChar}>
				<div className="inner">load more</div>
			</button>
		)
	}


	const onCharSelected = (e, id) => {
		e.preventDefault();
		const charItem = e.target.closest('.char__item');

		if (selectedChar) {
			selectedChar.classList.remove('char__item_selected');
		}

		charItem.classList.add('char__item_selected');

		props.onCharSelected(id);

		setSelectedChar(charItem);
	}

	const renderList = (chars) => {
		const charsItem = chars.map(item => {
			const { thumbnail, alt, name, id } = item;
			let thumbnailStyle = { objectFit: 'cover' };

			if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
				thumbnailStyle.objectFit = 'contain';
			}

			return (
				<li className="char__item"
					onClick={(e) => onCharSelected(e, id)}
					key={id}
					tabIndex={0}
					onKeyDown={(e) => {
						if (e.key === ' ' || e.key === 'Enter') {
							onCharSelected(e, id)
						}
					}}>
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

	const loadStatus = loading ? <Spinner /> : null;
	const errorStatus = error ? <Error /> : null;
	const visible = (loadStatus || errorStatus) ? null : renderList(chars);
	const loadButton = newItemLoading ? <Loading /> : renderButton()

	return (
		<div className="char__list">
			{loadStatus}
			{errorStatus}
			{visible}
			<div style={{ display: 'flex', height: 83, justifyContent: 'center', alignItems: 'flex-end' }}>
				{!charEnded ? loadButton : null}
			</div>
		</div>
	)
}

CharList.propTypes = {
	onCharSelected: PropTypes.func.isRequired
}

export default CharList;