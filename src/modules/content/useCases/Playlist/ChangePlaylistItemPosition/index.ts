import { ChangePlaylistItemPosition } from './ChangePlaylistItemPosition';
import { PlaylistRepo } from '../../../repos/PlaylistRepo';

const playlistRepo = new PlaylistRepo();
const listPlaylistItems = new ChangePlaylistItemPosition(playlistRepo);

export default listPlaylistItems;
