export type ScreenId =
  | 'overview'
  | 'prompt-queue'
  | 'episode-tracker'
  | 'history-and-library'
  | 'script-viewer'
  | 'calendar'
  | 'publish-log'
  | 'settings';

export interface NavItem {
  id: ScreenId;
  label: string;
  icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: 'dashboard' },
  { id: 'prompt-queue', label: 'Prompt Queue', icon: 'terminal' },
  { id: 'episode-tracker', label: 'Episode Tracker', icon: 'video_library' },
  { id: 'history-and-library', label: 'History & Library', icon: 'folder_open' },
  { id: 'script-viewer', label: 'Script Viewer', icon: 'description' },
  { id: 'calendar', label: 'Calendar', icon: 'calendar_today' },
  { id: 'publish-log', label: 'Publish Log', icon: 'publish' },
  { id: 'settings', label: 'Settings', icon: 'tune' },
];

export const PROFILE_AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDSKRe7KnnTKvh4PMyczW5U33ToH6I3MPs49XScr-1McrD3Jk9To5enik7U7Uvi33fWZHbk1kwGLJybrDivY49Eny3-S-UuklMw46nbgxDJ2mf5B7Zu_dExtn3MDLXD-hCGAVOkDmbkz63hfr_4OyBQChS4OhDvsdf-FILBPN7J6w9SqZvZdXlJDDUcfpleCzUo2BqZNLCo_uxi6FP2kMD2PxV-jw7mMH21Cth0sU4';

export interface PromptItemFilterable {
  id: string;
  title: string;
  prompt: string;
  type: 'video' | 'image' | 'voice';
  status: 'pending' | 'fulfilled';
  model: string;
}

export function filterPromptItems<T extends PromptItemFilterable>(
  items: T[],
  statusFilter: 'all' | 'pending' | 'fulfilled',
  typeFilter: 'all' | 'video' | 'image' | 'voice',
  searchQuery: string
): T[] {
  const normalizedQuery = searchQuery.toLowerCase().trim();
  return items.filter((item) => {
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const searchable = `${item.title} ${item.prompt} ${item.model}`.toLowerCase();
    const matchesSearch = !normalizedQuery || searchable.includes(normalizedQuery);
    return matchesStatus && matchesType && matchesSearch;
  });
}

export interface LibraryAssetFilterable {
  id: string;
  episode: string;
  type: 'video' | 'image' | 'voice' | 'sfx';
  title: string;
  model: string;
  promptOrDetail: string;
}

export function filterLibraryAssets<T extends LibraryAssetFilterable>(
  assets: T[],
  episodeFilter: string,
  typeFilter: string,
  searchQuery: string
): T[] {
  const normalizedQuery = searchQuery.toLowerCase().trim();
  return assets.filter((asset) => {
    const matchesEpisode = episodeFilter === 'all' || asset.episode === episodeFilter;
    const matchesType = typeFilter === 'all' || asset.type === typeFilter;
    const searchable = `${asset.title} ${asset.model} ${asset.promptOrDetail} Episode #${asset.episode}`.toLowerCase();
    const matchesSearch = !normalizedQuery || searchable.includes(normalizedQuery);
    return matchesEpisode && matchesType && matchesSearch;
  });
}

export function isValidScreenId(value: string): value is ScreenId {
  return NAV_ITEMS.some((item) => item.id === value);
}
