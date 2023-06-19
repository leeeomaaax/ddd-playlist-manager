import { ChangePlaylistItemPosition } from './ChangePlaylistItemPosition';
import { PlaylistRepo } from '../../../repos/PlaylistRepo';

const playlistRepo = new PlaylistRepo();
const changePlaylistItemPosition = new ChangePlaylistItemPosition(playlistRepo);

export default changePlaylistItemPosition;
