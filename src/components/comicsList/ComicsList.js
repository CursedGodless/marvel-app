import './comicsList.scss';
import uw from '../../resources/img/UW.png';
import xMen from '../../resources/img/x-men.png';
import useMarvelService from '../../services/MarvelServices';
import { useEffect, useState } from 'react';
import Spinner from '../spinner/Spinner';
import Error from '../error/Error';
import Loading from '../loading/Loading';

const ComicsList = () => {
	const { error, loading, getComics } = useMarvelService()
	const [comics, setComics] = useState([]);
	const [offset, setOffset] = useState(1000);

	useEffect(() => {
		updateComics();
	}, [])

	const onComicsLoaded = (nextComics) => {
		setComics(comics => [...comics, ...nextComics]);
	}

	const updateComics = () => {
		getComics(offset)
			.then(onComicsLoaded)
		setOffset(offset => offset + 8)
	}

	const renderList = (comics) => {
		const comicsItems = comics.map(item => {
			const { thumbnail, name, price, id } = item;
			return (
				<li className="comics__item" key={id}>
					<a href="#">
						<img src={thumbnail} alt="x-men" className="comics__item-img" />
						<div className="comics__item-name">{name}</div>
						<div className="comics__item-price">{price}</div>
					</a>
				</li>
			)
		})
		return (
			<ul className="comics__grid">
				{comicsItems}
			</ul>
		)
	}

	const renderButton = () => {
		return (
			<button className="button button__main button__long"
				onClick={updateComics}>
				<div className="inner">load more</div>
			</button>
		)
	}

	const loadStatus = loading ? <Spinner /> : null;
	const errorStatus = error ? <Error /> : null;
	const visible = renderList(comics);
	const loadButton = loading ? <Loading /> : renderButton()

	return (
		<div className="comics__list">
			{loadStatus}
			{errorStatus}
			{visible}
			<div style={{ display: 'flex', height: 83, justifyContent: 'center', alignItems: 'flex-end' }}>
				{loadButton}
			</div>
		</div>
	)
}

export default ComicsList;