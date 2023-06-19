import express from 'express';
import { Database } from './shared/infra/database';
import { Logger } from './shared/core/Logger';

import createPlaylist from './modules/content/useCases/Playlist/CreatePlaylist';
import listPlaylists from './modules/content/useCases/Playlist/ListPlaylists';

const log = new Logger('index');

const app = express();
app.use(express.json());

app.post('/playlist', async (req, res) => {
  const result = await createPlaylist.execute({ name: 'test' });
  return res.json(result);
});

app.get('/playlists', async (req, res) => {
  const result = await listPlaylists.execute({ page: '0' });
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
