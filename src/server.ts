import app from './app';

import http from 'http';
import { initSocket } from './config/socketInstance';

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);


initSocket(server);


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
