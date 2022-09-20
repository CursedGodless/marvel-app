import { useHttp } from "../hooks/http.hook";


const useMarvelService = () => {
	const { loading, error, request, clearError } = useHttp();

	const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
	const _apiKey = 'apikey=70188d3e9736e22562d84fdd1a130aeb';


	const getAllCharacters = async (offset = 210) => {
		const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
		return res.data.results.map(_transformCharacter);
	}

	const getCharacter = async (id) => {
		const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
		return _transformCharacter(res.data.results[0]);
	}

	const getAllComics = async (offset = 1000) => {
		const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
		return res.data.results.map(_transformComic)
	}

	const getComic = async (id) => {
		const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
		return _transformComic(res.data.results[0]);
	}

	const _transformCharacter = (char) => {
		return {
			name: char.name,
			description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
			thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
			homepage: char.urls[0].url,
			wiki: char.urls[1].url,
			id: char.id,
			comics: char.comics.items.length === 0 ? [] : char.comics.items.slice(0, 10)
		}
	}

	const _transformComic = (comic) => {
		return {
			id: comic.id,
			name: comic.title,
			thumbnail: comic.thumbnail.path + '.' + comic.thumbnail.extension,
			price: comic.prices.price ? `${comic.prices.price}$` : 'Not available',
			description: comic.description || 'There is no description',
			pageCount: comic.pageCount ? `${comic.pageCount} p.` : 'No information about the number of pages',
			language: comic.textObjects.language || 'en-us'
		}
	}

	return { loading, error, getAllCharacters, getCharacter, getComic, getAllComics, clearError }
}

export default useMarvelService;