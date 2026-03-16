module.exports = {
	globDirectory: 'build',
	globPatterns: [
		'**/*.{js,txt,json,png,html,svg,ico,woff2,woff,mp3,css}'
	],
	swSrc: 'src/firebase-messaging-sw.js',
	swDest: 'build/firebase-messaging-sw.js',
};