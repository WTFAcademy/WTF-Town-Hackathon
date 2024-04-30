/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_WALLET_CONNECT_PROJECT_ID: string;
	readonly VITE_HTTP_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
