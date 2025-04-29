export function getToken() {
    try {
        const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
        if (match) return match[2];
        return localStorage.getItem('token');
    } catch (error) {
        console.error('Token fetch error', error);
        return null;
    }
}
