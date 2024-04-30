import ConnectWallet from 'src/components/ConnectWallet';

const Login = () => {
	return (
		<div
			className="flex h-screen w-screen flex-col items-center justify-center gap-4"
			style={{
				background: 'url(/image/background.png) 0 0 / cover no-repeat fixed',
				height: '100vh',
				width: '100vw',
			}}
		>
			<ConnectWallet />
		</div>
	);
};

export default Login;
