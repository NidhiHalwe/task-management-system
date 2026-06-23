const TOKEN_KEY = 'tm_token';

export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const isTokenValid = () => {
	try {
		const token = getToken();
		if (!token) return false;
		const parts = token.split('.');
		if (parts.length !== 3) return false;
		const payload = JSON.parse(atob(parts[1]));
		if (!payload.exp) return true; // no exp claim -> assume valid
		const now = Math.floor(Date.now() / 1000);
		return payload.exp > now;
	} catch (e) {
		return false;
	}
};
