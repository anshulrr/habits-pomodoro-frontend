const config = {
  appId: 'in.habitspomodoro.app',
  appName: 'HabitsPomodoro',
  webDir: 'build',
  plugins: {
    CapacitorHttp: { enabled: true }
  },
  // DYNAMIC SERVER CONFIG
  server: {
    // 1. For Production: This will be undefined, so it loads local files.
    // 2. For Local: You can set an environment variable when running the command.
    // url: process.env.VITE_SERVER_URL || 'http://192.168.1.10:3000',  // live reload not working
    // url: process.env.CAP_LIVE_RELOAD_URL, 
    // cleartext: true,  // Set to true if your local server doesn't use HTTPS
    cleartext: false, // for production, since backend will be on HTTPS
  }
};

// export default config; // doesn't work with capacitor cli for some reason, so using commonjs export
module.exports = config; 
