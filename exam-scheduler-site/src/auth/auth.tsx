interface AuthParams {
	loginUri: string;
	signUpUri: string;
	imageUrl?: string;
}

export default function Auth(params: AuthParams) {
	const { loginUri, signUpUri, imageUrl } = params;

	function redirect(uri: string) {
		window.location.replace(uri);
	}

	return (
		<div>
			<div>
				<button onClick={() => redirect(loginUri)}>Login</button>
				<button onClick={() => redirect(signUpUri)}>Sign Up</button>
			</div>
			{imageUrl && <img src={imageUrl}></img>}
		</div>
	);
}
