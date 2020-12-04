const http = require('http');
const app = require('./backend/app');

const PORT = process.env.PORT || 8080;

app.set('port', PORT);
const server = http.createServer(app);

// Listen to the App Engine-specified port, or 8080 otherwise
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});