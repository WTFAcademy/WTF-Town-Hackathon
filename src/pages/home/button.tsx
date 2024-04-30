import { useConnect, useConnectors, useDisconnect } from 'wagmi';
import { useMemo } from 'react';
import { scroll } from 'wagmi/chains';
import useAuth from '@/hooks/use-auth.ts';
import { useNavigate } from 'react-router-dom';
import PixelWindowCard from '@/components/ui/PixelWindowCard.tsx';
import PixelButton from '@/components/ui/PixelButton.tsx';

const WalletConnectors = [
	{
		id: 'io.metamask',
	},
	{
		id: 'com.okex.wallet',
	},
	{
		id: 'coinbaseWalletSDK',
		icon: '/image/coinbase.png',
	},
	{
		id: 'walletConnect',
		icon: '/image/wallet-connect.png',
	},
];

const ConnectWallet = () => {
	const connectors = useConnectors();
	const { connectAsync, isPending } = useConnect();
	const { disconnectAsync } = useDisconnect();
	const { signWithSiwe, isAuthLoading } = useAuth();
	const navigate = useNavigate();

	console.log(isAuthLoading);

	const formatConnectors = useMemo(() => {
		return WalletConnectors.map(connector => {
			const item = connectors.find(item => item.id === connector.id);
			return {
				...connector,
				...item,
			};
		}).filter(item => !!item.name);
	}, [connectors]);

	const loading = isPending || isAuthLoading;

	const handleConnect = async (connector: any) => {
		await disconnectAsync();
		await connectAsync({
			connector: connector,
			chainId: scroll.id,
		});

		signWithSiwe(void 0, {
			onSuccess: () => {
				navigate('/game');
			},
		});
	};

	return (
		<PixelWindowCard className="h-max w-full max-w-[580px] text-base font-bold">
			{!loading && (
				<>
					<div className="relative flex flex-col items-center justify-center p-[54px]">
						<h1 className="mb-[42px] text-[32px] font-bold text-white">
							Connect Wallet
						</h1>
						<div className="w-full space-y-3">
							{formatConnectors.map(connector => (
								<PixelButton
									key={connector.id}
									onClick={() => handleConnect(connector)}
								>
									<img
										src={connector.icon}
										className="absolute left-[10px] h-8 w-8"
										alt={connector.name}
									/>
									<span>{connector.name}</span>
								</PixelButton>
							))}
						</div>
					</div>
				</>
			)}

			{loading && (
				<>
					<div className="relative inset-0 w-full bg-transparent p-[54px] text-white">
						Loading...
					</div>
				</>
			)}
		</PixelWindowCard>
	);
};

export default ConnectWallet;
