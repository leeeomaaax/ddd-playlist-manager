import express from 'express';
import { Database } from './shared/infra/database';
import { Logger } from './shared/core/Logger';

import createPlaylist from './modules/content/useCases/Playlist/CreatePlaylist';
import listPlaylists from './modules/content/useCases/Playlist/ListPlaylists';
import addItemToPlaylist from './modules/content/useCases/Playlist/AddItemToPlaylist';
import listPlaylistItems from './modules/content/useCases/Playlist/ListPlaylistItems';

const log = new Logger('index');

const app = express();
app.use(express.json());

app.post('/playlist', async (req, res) => {
  const result = await createPlaylist.execute({ name: req.body.name });
  return res.json(result);
});

app.get('/playlists', async (req, res) => {
  const result = await listPlaylists.execute({
    page: (req.query.page as string) || '0',
  });
  return res.json(result);
});

app.put('/playlist/:playlistId/item/:episodeId', async (req, res) => {
  const result = await addItemToPlaylist.execute({
    playlistId: req.params.playlistId as string,
    episodeId: req.params.episodeId as string,
  });
  return res.json(result);
});

app.get('/playlist/:playlistId/items', async (req, res) => {
  const result = await listPlaylistItems.execute({
    playlistId: req.params.playlistId as string,
    page: (req.query.page as string) || '0',
  });
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
