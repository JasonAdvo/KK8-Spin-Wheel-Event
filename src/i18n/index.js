import { createI18n } from 'vue-i18n';
import zhMessages from './locales/zh.json';
import msMessages from './locales/ms.json';
import enMessages from './locales/en.json';

function detectUserLocale() {
	// Get the current path of the URL (without the domain)
	const path = window.location.pathname;

	// Detect locale based on the path
	if (path.startsWith('/zh')) {
		return 'zh'; // For any path starting with /zh
	}
	if (path.startsWith('/ms')) {
		return 'ms'; // For any path starting with /ms
	}

	// Default to 'en' if the path doesn't start with /zh or /ms
	return 'en';
}

// Create i18n instance with messages
const i18n = createI18n({
	locale: detectUserLocale(),
	fallbackLocale: 'en', // Default fallback language (English)
	messages: {
		zh: zhMessages,
		ms: msMessages,
		en: enMessages
	},
});

// Log the current locale to the console
console.log('Current language:', i18n.global.locale);

// Function to switch languages
export function switchLanguage(lang) {
	// Update the language based on the passed parameter
	i18n.global.locale = lang;
	localStorage.setItem('user-locale', lang); // Store user preference in localStorage

	// Log the new locale when switched
	console.log('Switched language to:', i18n.global.locale);

	// Optionally, you can update the URL path when switching languages
	if (lang === 'zh') {
		window.history.pushState({}, '', '/zh');
	} else if (lang === 'ms') {
		window.history.pushState({}, '', '/ms');
	} else {
		window.history.pushState({}, '', '/');
	}
}

export default i18n;
