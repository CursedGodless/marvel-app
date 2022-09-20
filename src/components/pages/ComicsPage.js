import ComicsList from "../comicsList/ComicsList";
import AppBanner from '../appBanner/AppBanner';
import ErrorBoundary from "../errorBoundary/ErrorBoundary";

export default function ComicsPage() {
	return (
		<>
			<ErrorBoundary>
				<AppBanner />
			</ErrorBoundary>
			<ErrorBoundary>
				<ComicsList />
			</ErrorBoundary>
		</>
	)
}