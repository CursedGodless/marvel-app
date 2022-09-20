import Error from "../error/Error";
import { Link } from "react-router-dom";


export default function Page404() {
	return (
		<div>
			<Error />
			<p style={{ 'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '24px' }}>Page doesn't exist</p>
			<Link style={{ 'display': 'block', 'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '24px', 'marginTop': '30px', 'textDecoration': 'underline' }} to='/'>
				Back to main page
			</Link>
		</div>
	)
}