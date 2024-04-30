import Axios from 'axios';

export const request = Axios.create({
	baseURL: import.meta.env.VITE_HTTP_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

request.interceptors.request.use(config => {
	const token = localStorage.getItem('token');
	if (token) {
		config.headers.set('Authorization', `Bearer ${JSON.parse(token)}`);
	}
	return config;
});
