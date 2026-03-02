module.exports = {
	globDirectory: 'build',
	globPatterns: [
		'**/*.{js,txt,json,png,html,svg,ico,woff2,woff,mp3,css}'
	],
	swDest: 'build/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	navigateFallback: '/index.html', // Essential for BrowserRouter
};