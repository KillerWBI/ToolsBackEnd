// Root wrapper so Render's `node server.js` runs the app in `src/server.js`
try {
  require('./src/server.js');
} catch (err) {
  (async () => {
    try {
      await import('./src/server.js');
    } catch (e) {
      console.error('Failed to load ./src/server.js via require or import:', e);
      process.exit(1);
    }
  })();
}
