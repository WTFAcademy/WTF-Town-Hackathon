import Navigation from './Navigation';
import Providers from '@/Providers.tsx';
import { Toaster } from 'sonner';

function App() {
	return (
		<Providers>
			<Navigation />
			<Toaster position="top-right" richColors />
		</Providers>
	);
}

export default App;
