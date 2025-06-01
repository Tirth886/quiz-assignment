import { PORT } from '../env/index.js';
import app from '../app.js';
import http from 'http';

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Server running at :${PORT}`);
});
