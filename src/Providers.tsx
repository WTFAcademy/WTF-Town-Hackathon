import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { AuthProvider } from '@/components/contexts/AuthContext.tsx';
import { config } from '@/lib/wagmi.ts';

const queryClient = new QueryClient();

const Providers = ({ children }: { children: ReactNode }) => {
	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>{children}</AuthProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);
};

export default Providers;
