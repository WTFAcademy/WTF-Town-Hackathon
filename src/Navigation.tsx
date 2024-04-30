// Lazy load routes
import { lazy, Suspense } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import Guard from '@/components/Guard.tsx';
import LoadingPage from '@/components/layout/LoadingPage.tsx';

const Home = lazy(() =>
	import('./pages/home/index.tsx').then(m => ({ default: m.default })),
);
const Game = lazy(() =>
	import('./pages/game-world/index.tsx').then(m => ({
		default: m.default,
	})),
);

const Login = lazy(() =>
	import('./pages/login/index.tsx').then(m => ({ default: m.default })),
);

const router = createHashRouter([
	{
		path: '/',
		element: <Home />,
	},
	{
		path: '/game',
		element: <Guard />,
		children: [
			{
				path: '',
				element: <Game />,
			},
		],
	},
	{
		path: '/login',
		element: <Login />,
	},
]);

const Navigation = () => {
	return (
		<Suspense fallback={<LoadingPage />}>
			<RouterProvider router={router} />
		</Suspense>
	);
};

export default Navigation;
