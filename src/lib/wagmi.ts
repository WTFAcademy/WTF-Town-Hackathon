import { createConfig, http } from 'wagmi';
import { injected, walletConnect } from 'wagmi/connectors';

const scrollTestnet = {
	id: 534351,
	name: 'Scroll Sepolia Testnet',
	iconUrl: 'https://xterscan.io/assets/network_logo_dark.png',
	iconBackground: '#fff',
	nativeCurrency: { name: 'Sepolia Testnet', symbol: 'ETH', decimals: 18 },
	rpcUrls: {
		default: { http: ['https://scroll-sepolia.blockpi.network/v1/rpc/public'] },
	},
	blockExplorers: {
		default: { name: 'scrollscan', url: 'https://sepolia.scrollscan.com' },
	},
};

export const config = createConfig({
	chains: [scrollTestnet],
	transports: {
		[scrollTestnet.id]: http(),
	},
	connectors: [
		injected(),
		walletConnect({
			projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
		}),
	],
});
