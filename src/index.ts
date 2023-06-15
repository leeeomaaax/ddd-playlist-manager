import express from 'express';
import { Database } from './shared/infra/database';
import { Logger } from './shared/core/Logger';

import createPlaylist from './modules/content/useCases/Playlist/CreatePlaylist';

const log = new Logger('index');

const app = express();
app.use(express.json());

app.post('/createPlaylist', async (req, res) => {
  const result = await createPlaylist.execute({ name: 'test' });
  return res.json(result);
});

async function main(): Promise<void> {
  log.info(`Launched from ${process.cwd()}`);
  await Database.getDatabase().connect(
    'mongodb://localhost:27017/ddd-playlist-manager',
  );
  app.listen(3000, () => {
    console.log(`Server running on port 3000`);
  });
}

export default main();
