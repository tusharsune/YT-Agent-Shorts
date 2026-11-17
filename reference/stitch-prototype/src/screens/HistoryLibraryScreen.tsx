import React, { useState } from 'react';
import { filterLibraryAssets, LibraryAssetFilterable } from '../utils/navigation';

interface HistoryLibraryScreenProps {
  onShowToast: (msg: string) => void;
}

interface LibraryCardItem extends LibraryAssetFilterable {
  barColor: string;
  badgeText: string;
  badgeClass: string;
  mediaPreviewType: 'video' | 'image' | 'audio';
  imageUrl?: string;
  mediaLeftTag?: string;
  mediaLeftIcon?: string;
  mediaRightTag?: string;
  audioFilename?: string;
  audioDuration?: string;
  audioFormat?: string;
  audioIcon?: string;
  audioProgressWidth?: string;
  tableFormat: string;
  leftBtnIcon: string;
  leftBtnLabel: string;
  rightBtnIcon: string;
  rightBtnLabel: string;
  rightBtnPrimary: boolean;
}

const LIBRARY_ASSETS: LibraryCardItem[] = [
  {
    id: 'lib1',
    episode: '142',
    type: 'video',
    model: 'Runway Gen-3',
    title: 'Hyper-speed 3x3 F2L finger tricks',
    barColor: 'bg-primary-container',
    badgeText: 'Used in final edit',
    badgeClass: 'bg-primary-container/20 text-on-primary-container',
    mediaPreviewType: 'video',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBiu4MZ-q7uqMdvVoFaMwCRmYaIAgzB7Fc-PrDifbIktayK0ByQy7_dcfaEVzknlAPeN6TMK9dbLokeBWCoC66rkFbiJDhlHddSSc71s-w0OZKk4fM9pwYh28Ut29kCt4kGkYUjkG1OmT-n5qHI-NwfxKX2rYxp0NUa_AEpLmzEIHnPg62pSnQ80Gbli8nqWsjQ2QObcguxdPTTn-vT9-iosL48CC9l1r_JAxuYe8E',
    mediaLeftIcon: 'videocam',
    mediaLeftTag: '4s loop',
    mediaRightTag: '1080x1920 · 60fps',
    promptOrDetail:
      'Prompt: Close-up high angle hyperlapse of hands solving F2L slot, cinematic directional teal rim lighting, clean mechanics.',
    tableFormat: '1080x1920 · 60fps MP4',
    leftBtnIcon: 'content_copy',
    leftBtnLabel: 'Copy prompt',
    rightBtnIcon: 'download',
    rightBtnLabel: 'Download',
    rightBtnPrimary: true,
  },
  {
    id: 'lib2',
    episode: '141',
    type: 'image',
    model: 'Midjourney v6.1',
    title: 'Metallic mirror cube extreme close up',
    barColor: 'bg-primary-container',
    badgeText: 'Used as hook frame',
    badgeClass: 'bg-primary-container/20 text-on-primary-container',
    mediaPreviewType: 'image',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCSY-4UPsa4sNR1yFBkwfAygfqHyYPX3wc5bAEbUbRcwaphJuZ0--85P32PIY9_GeIRgFBtuHh3xTEwGKBCRiN-sScrQirf6aYbsvbyqr7HUYPg_FEqefRnimP-_skjSvk9tE7SEJ8pAIVsbJNYJZqvMsxt1u_yQflwGKLQCNVjjFnvmDz6sEzqQ9UiBAzBmTNITI1B2oTUwT7KI_Y7P7xdQ9yF1KvRo0UolEhR4TI',
    mediaLeftIcon: 'image',
    mediaLeftTag: 'PNG Still',
    mediaRightTag: '4096x2304 · 8.4 MB',
    promptOrDetail:
      'Prompt: High key studio shot of mirror blocks cube distorted, ray traced metallic sheen, vibrant reflections, macro lens --ar 9:16 --v 6.1',
    tableFormat: '4096x2304 PNG',
    leftBtnIcon: 'tune',
    leftBtnLabel: 'Seed #884920',
    rightBtnIcon: 'download',
    rightBtnLabel: 'Download full res',
    rightBtnPrimary: true,
  },
  {
    id: 'lib3',
    episode: '143',
    type: 'voice',
    model: 'ElevenLabs Adam voice',
    title: 'Sarcastic commentary hook v2',
    barColor: 'bg-primary-container',
    badgeText: 'Selected master',
    badgeClass: 'bg-primary-container/20 text-on-primary-container',
    mediaPreviewType: 'audio',
    audioFilename: 'Hook_Adam_Take02_Dry.wav',
    audioDuration: '00:03.4',
    audioFormat: '44.1kHz · 24-bit',
    audioIcon: 'graphic_eq',
    audioProgressWidth: 'w-2/5',
    promptOrDetail:
      'Script line: "You think this solve was pure luck? Watch the corner twist in three, two, one..."',
    tableFormat: '44.1kHz WAV',
    leftBtnIcon: 'notes',
    leftBtnLabel: 'Transcript',
    rightBtnIcon: 'download',
    rightBtnLabel: 'Download WAV',
    rightBtnPrimary: false,
  },
  {
    id: 'lib4',
    episode: '140',
    type: 'video',
    model: 'Luma Dream Machine',
    title: 'Pyraminx top layer rotation slow motion',
    barColor: 'bg-tertiary-container',
    badgeText: 'Alternative take',
    badgeClass: 'bg-tertiary-fixed text-on-tertiary-container',
    mediaPreviewType: 'video',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDVRd_DVocimSfrouT_OG8OQj7ia2NM-XuUrlkQlMU3xAIr187OWF8sfexCjOjPcKdzjSCs-Z9nmrk_5KlIVXS-RQAh8odC2mip5PtfU45aimi9NHDl8qUP-6YeVHe-1uRpELXnuapNvhrY0-1-QSoNrTbPMso5ri9mdnxTiHQ9Vy3VkxKJyhGUc285PC9C1gNOvqLh-LFKhzfo-KrRqJBafqzcCrQ8eqGxC-E-HfQ',
    mediaLeftIcon: 'motion_blur',
    mediaLeftTag: '5s take',
    mediaRightTag: '1080x1920 · 24fps',
    promptOrDetail:
      'Prompt: Zero gravity rotating apex tip of neon stickerless Pyraminx, crisp edge focus, high FPS physical precision solve.',
    tableFormat: '1080x1920 MP4',
    leftBtnIcon: 'file_copy',
    leftBtnLabel: 'Duplicate',
    rightBtnIcon: 'add_circle',
    rightBtnLabel: 'Reuse in new Short',
    rightBtnPrimary: false,
  },
  {
    id: 'lib5',
    episode: '139',
    type: 'image',
    model: 'DALL-E 3',
    title: 'Cubing tournament stage background illustration',
    barColor: 'bg-primary-container',
    badgeText: 'Used',
    badgeClass: 'bg-primary-container/20 text-on-primary-container',
    mediaPreviewType: 'image',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAalf3px59Ux6IqR5ECMiZE8vo7OaCBa7KoRvIh32-DTV55UM5GT6LolapH0rKe5TjSj8IMiMfQzukszkcyPbMS9oWb1yfrde-yGlwkpL-kOm_dmiYHRTyA9YXVTqcNpC1r9stC23LS7LXzLwSzDTqC0zxSJkBru6Dv-d7NpOiPEVhNsZAiZzqp2zU6jxfQ98j6MQKIxiNrzP_R1s71lsDa3JkaTx43clc8sjC_gbc',
    mediaLeftIcon: 'palette',
    mediaLeftTag: 'Vector Plate',
    mediaRightTag: '1792x1024 · 3.1 MB',
    promptOrDetail:
      'Prompt: Flat vector illustration of speedcubing main arena with countdown clocks, bold outlines, mechanical precision layout.',
    tableFormat: '1792x1024 PNG',
    leftBtnIcon: 'info',
    leftBtnLabel: 'Inspect',
    rightBtnIcon: 'download',
    rightBtnLabel: 'Download',
    rightBtnPrimary: true,
  },
  {
    id: 'lib6',
    episode: '142',
    type: 'sfx',
    model: 'Custom SFX',
    title: 'Speedcube clicking mechanical sound effect burst',
    barColor: 'bg-primary-container',
    badgeText: 'Used',
    badgeClass: 'bg-primary-container/20 text-on-primary-container',
    mediaPreviewType: 'audio',
    audioFilename: 'Magnetic_Tactile_Clicks_04.wav',
    audioDuration: '00:01.8',
    audioFormat: '48kHz · Lossless',
    audioIcon: 'new_window',
    audioProgressWidth: 'w-4/5',
    promptOrDetail:
      'Audio profile: Synthesized magnetic core snap with crisp plastic resonance and subtle air displacement transient.',
    tableFormat: '48kHz WAV',
    leftBtnIcon: 'tune',
    leftBtnLabel: 'EQ Match',
    rightBtnIcon: 'download',
    rightBtnLabel: 'Download WAV',
    rightBtnPrimary: false,
  },
];

export const HistoryLibraryScreen: React.FC<HistoryLibraryScreenProps> = ({ onShowToast }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [episodeFilter, setEpisodeFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('7d');
  const [activeTags, setActiveTags] = useState<string[]>(['Latest batch', 'Renders > 1080p']);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const visibleAssets = filterLibraryAssets(
    LIBRARY_ASSETS,
    episodeFilter,
    typeFilter,
    searchQuery
  );

  const handleClearFilters = () => {
    setSearchQuery('');
    setEpisodeFilter('all');
    setTypeFilter('all');
    setDateFilter('7d');
    setActiveTags([]);
    onShowToast('All library filters reset');
  };

  return (
    <div className="flex flex-col w-full p-space-md lg:p-space-lg gap-space-lg">
      {/* Breadcrumb & Library Metrics Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-sm">
            <span className="font-headline-lg text-headline-lg text-on-surface">
              Asset Library
            </span>
            <span className="px-space-sm py-space-xs rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm border border-outline-variant">
              Workshop Vault
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Archival catalog of AI generation passes, renders, audio stems, and final master
            deliverables.
          </p>
        </div>
        <div className="flex items-center gap-space-sm self-start lg:self-auto">
          <div className="flex items-center gap-space-xs px-space-sm py-space-xs bg-surface-container-lowest border border-outline-variant rounded">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
            <span className="font-label-sm text-label-sm text-on-surface font-semibold">
              1,420 renders logged
            </span>
          </div>
          <div className="flex items-center gap-space-xs px-space-sm py-space-xs bg-surface-container-lowest border border-outline-variant rounded">
            <span className="material-symbols-outlined text-[16px] text-outline">
              hard_drive
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              14.8 GB persistent
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Console */}
      <div className="flex flex-col gap-space-sm p-space-md bg-surface-container-lowest border border-outline-variant rounded shadow-[2px_2px_0px_#0c1f19]">
        <div className="flex flex-col xl:flex-row gap-space-md items-stretch xl:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              search
            </span>
            <input
              aria-label="Search prompt text, episode title, seed, or model"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-space-md py-2 text-on-surface font-body-md text-body-md bg-surface border border-outline-variant rounded focus:outline-none focus:border-primary-container placeholder:text-on-surface-variant"
              id="library-search-input"
              placeholder="Search prompt text, episode title, seed, or model..."
              type="text"
            />
          </div>

          {/* Controls & Selectors */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-space-sm">
            {/* Episode Selector */}
            <div className="relative min-w-[150px] flex-1 sm:flex-none">
              <select
                aria-label="Filter by episode"
                value={episodeFilter}
                onChange={(e) => setEpisodeFilter(e.target.value)}
                className="w-full appearance-none bg-surface border border-outline-variant rounded px-space-sm py-2 pr-8 font-label-md text-label-md text-on-surface focus:outline-none focus:border-primary-container cursor-pointer"
                id="filter-episode"
              >
                <option value="all">All episodes</option>
                <option value="143">Episode #143</option>
                <option value="142">Episode #142</option>
                <option value="141">Episode #141</option>
                <option value="140">Episode #140</option>
                <option value="139">Episode #139</option>
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[18px] text-outline">
                expand_more
              </span>
            </div>

            {/* Asset Type Selector */}
            <div className="relative min-w-[150px] flex-1 sm:flex-none">
              <select
                aria-label="Filter by asset type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full appearance-none bg-surface border border-outline-variant rounded px-space-sm py-2 pr-8 font-label-md text-label-md text-on-surface focus:outline-none focus:border-primary-container cursor-pointer"
                id="filter-type"
              >
                <option value="all">All types</option>
                <option value="video">Video renders</option>
                <option value="image">Midjourney images</option>
                <option value="voice">Voice clips</option>
                <option value="sfx">SFX stems</option>
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[18px] text-outline">
                expand_more
              </span>
            </div>

            {/* Date Range */}
            <div className="relative min-w-[140px] flex-1 sm:flex-none">
              <select
                aria-label="Filter by date range"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full appearance-none bg-surface border border-outline-variant rounded px-space-sm py-2 pr-8 font-label-md text-label-md text-on-surface focus:outline-none focus:border-primary-container cursor-pointer"
                id="filter-date"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="all">All time</option>
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[18px] text-outline">
                calendar_month
              </span>
            </div>

            {/* View Switcher */}
            <div className="flex items-center border border-outline-variant rounded p-0.5 bg-surface-container-low shrink-0">
              <button
                aria-label="Grid view"
                onClick={() => setViewMode('grid')}
                className={
                  viewMode === 'grid'
                    ? 'px-space-sm py-1.5 rounded flex items-center justify-center bg-surface-container-lowest text-on-surface shadow-[1px_1px_0px_#0c1f19]'
                    : 'px-space-sm py-1.5 rounded flex items-center justify-center text-outline hover:text-on-surface'
                }
                id="view-grid-btn"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">grid_view</span>
              </button>
              <button
                aria-label="Table view"
                onClick={() => setViewMode('table')}
                className={
                  viewMode === 'table'
                    ? 'px-space-sm py-1.5 rounded flex items-center justify-center bg-surface-container-lowest text-on-surface shadow-[1px_1px_0px_#0c1f19]'
                    : 'px-space-sm py-1.5 rounded flex items-center justify-center text-outline hover:text-on-surface'
                }
                id="view-table-btn"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">
                  format_list_bulleted
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Indicators */}
        <div className="flex items-center gap-space-sm pt-space-xs border-t border-surface-container-high flex-wrap">
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Active filter tags:
          </span>
          {activeTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-space-xs py-0.5 bg-surface-container-high rounded text-on-surface font-label-sm text-label-sm border border-outline-variant"
            >
              {tag}
              <button
                aria-label={`Remove ${tag} filter`}
                onClick={() => setActiveTags((prev) => prev.filter((t) => t !== tag))}
                className="hover:text-error flex items-center"
                type="button"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            </span>
          ))}
          <button
            onClick={handleClearFilters}
            className="font-label-sm text-label-sm text-primary hover:underline ml-auto"
            type="button"
          >
            Clear filters
          </button>
        </div>
      </div>

      {/* Grid View Container */}
      {viewMode === 'grid' && (
        <div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-md"
          id="grid-view-panel"
        >
          {visibleAssets.map((card) => (
            <div
              key={card.id}
              className="flex flex-col bg-surface-container-lowest border border-outline-variant rounded shadow-[2px_2px_0px_#0c1f19] relative overflow-hidden group"
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${card.barColor} z-10`}></div>

              {/* Header Meta */}
              <div className="p-space-md pb-space-sm pl-space-lg flex items-start justify-between gap-space-sm">
                <div className="flex flex-col">
                  <div className="flex items-center gap-space-xs">
                    <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold">
                      Episode #{card.episode}
                    </span>
                    <span className="text-on-surface-variant font-label-sm text-label-sm">
                      {card.model}
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1">
                    {card.title}
                  </h3>
                </div>
                <span
                  className={`px-space-xs py-0.5 rounded ${card.badgeClass} font-label-sm text-label-sm font-bold shrink-0`}
                >
                  {card.badgeText}
                </span>
              </div>

              {/* Preview Stage */}
              {card.mediaPreviewType !== 'audio' ? (
                <div className="relative mx-space-md ml-space-lg h-52 bg-surface-container-high rounded border border-outline-variant overflow-hidden flex items-center justify-center">
                  <img
                    alt={card.title}
                    className="w-full h-full object-cover"
                    src={card.imageUrl}
                  />
                  {card.mediaPreviewType === 'video' && (
                    <div className="absolute inset-0 bg-on-surface/20 flex items-center justify-center">
                      <button
                        aria-label={`Play ${card.title}`}
                        onClick={() => onShowToast(`Playing video preview: ${card.title}`)}
                        className="w-12 h-12 rounded-full bg-surface-container-lowest border border-on-surface flex items-center justify-center text-on-surface shadow-[2px_2px_0px_#0c1f19] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                        type="button"
                      >
                        <span
                          className="material-symbols-outlined text-[24px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          play_arrow
                        </span>
                      </button>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 px-space-xs py-0.5 bg-on-surface/80 text-surface-container-lowest font-label-sm text-label-sm rounded flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">
                      {card.mediaLeftIcon}
                    </span>{' '}
                    {card.mediaLeftTag}
                  </div>
                  <div className="absolute bottom-2 right-2 px-space-xs py-0.5 bg-on-surface/80 text-surface-container-lowest font-label-sm text-label-sm rounded">
                    {card.mediaRightTag}
                  </div>
                </div>
              ) : (
                <div className="mx-space-md ml-space-lg p-space-md bg-surface rounded border border-outline-variant flex flex-col justify-center gap-space-sm h-52">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-primary">
                        {card.audioIcon}
                      </span>
                      {card.audioFilename}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {card.audioDuration}
                    </span>
                  </div>

                  {/* Waveform Simulation */}
                  {card.id === 'lib3' ? (
                    <div className="h-20 w-full flex items-center gap-1 px-1 bg-surface-container-lowest rounded border border-outline-variant">
                      <span className="w-1 h-4 bg-outline-variant rounded-full"></span>
                      <span className="w-1 h-8 bg-outline-variant rounded-full"></span>
                      <span className="w-1 h-12 bg-primary rounded-full"></span>
                      <span className="w-1 h-16 bg-primary rounded-full"></span>
                      <span className="w-1 h-10 bg-primary rounded-full"></span>
                      <span className="w-1 h-14 bg-primary-container rounded-full"></span>
                      <span className="w-1 h-6 bg-primary-container rounded-full"></span>
                      <span className="w-1 h-12 bg-outline-variant rounded-full"></span>
                      <span className="w-1 h-14 bg-outline-variant rounded-full"></span>
                      <span className="w-1 h-8 bg-outline-variant rounded-full"></span>
                      <span className="w-1 h-16 bg-primary rounded-full"></span>
                      <span className="w-1 h-12 bg-primary rounded-full"></span>
                      <span className="w-1 h-4 bg-outline-variant rounded-full"></span>
                      <span className="w-1 h-10 bg-outline-variant rounded-full"></span>
                      <span className="w-1 h-6 bg-outline-variant rounded-full"></span>
                    </div>
                  ) : (
                    <div className="h-20 w-full flex items-center gap-1 px-1 bg-surface-container-lowest rounded border border-outline-variant">
                      <span className="w-1 h-3 bg-primary-container rounded-full"></span>
                      <span className="w-1 h-14 bg-primary rounded-full"></span>
                      <span className="w-1 h-2 bg-outline-variant rounded-full"></span>
                      <span className="w-1 h-16 bg-primary rounded-full"></span>
                      <span className="w-1 h-4 bg-outline-variant rounded-full"></span>
                      <span className="w-1 h-12 bg-primary rounded-full"></span>
                      <span className="w-1 h-2 bg-outline-variant rounded-full"></span>
                      <span className="w-1 h-14 bg-primary rounded-full"></span>
                      <span className="w-1 h-4 bg-outline-variant rounded-full"></span>
                      <span className="w-1 h-10 bg-primary-container rounded-full"></span>
                      <span className="w-1 h-2 bg-outline-variant rounded-full"></span>
                      <span className="w-1 h-16 bg-primary rounded-full"></span>
                      <span className="w-1 h-2 bg-outline-variant rounded-full"></span>
                      <span className="w-1 h-8 bg-outline-variant rounded-full"></span>
                      <span className="w-1 h-2 bg-outline-variant rounded-full"></span>
                    </div>
                  )}

                  <div className="flex items-center gap-space-sm">
                    <button
                      aria-label={`Play ${card.audioFilename}`}
                      onClick={() =>
                        setPlayingAudioId((prev) => (prev === card.id ? null : card.id))
                      }
                      className="w-8 h-8 rounded bg-surface-container-high border border-on-surface flex items-center justify-center text-on-surface"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {playingAudioId === card.id ? 'pause' : 'play_arrow'}
                      </span>
                    </button>
                    <div className="flex-1 h-1.5 bg-surface-container-high rounded overflow-hidden">
                      <div className={`${card.audioProgressWidth} h-full bg-primary-container`}></div>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {card.audioFormat}
                    </span>
                  </div>
                </div>
              )}

              {/* Prompt Detail & Actions */}
              <div className="p-space-md pl-space-lg flex flex-col gap-space-sm mt-auto">
                <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 bg-surface p-space-xs rounded border border-outline-variant">
                  {card.promptOrDetail}
                </p>
                <div className="flex items-center justify-between pt-space-xs">
                  <button
                    onClick={() =>
                      onShowToast(`${card.leftBtnLabel} — ${card.title}`)
                    }
                    className="px-space-sm py-1 rounded bg-surface border border-outline-variant font-label-md text-label-md text-on-surface hover:bg-surface-container flex items-center gap-1"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {card.leftBtnIcon}
                    </span>
                    {card.leftBtnLabel}
                  </button>
                  <button
                    onClick={() =>
                      onShowToast(`${card.rightBtnLabel} — ${card.title}`)
                    }
                    className={
                      card.rightBtnPrimary
                        ? 'px-space-sm py-1 rounded bg-secondary-container text-on-primary font-label-md text-label-md border border-on-surface shadow-[1px_1px_0px_#0c1f19] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center gap-1'
                        : 'px-space-sm py-1 rounded bg-surface-container-lowest text-on-surface font-label-md text-label-md border border-on-surface shadow-[1px_1px_0px_#0c1f19] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center gap-1'
                    }
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {card.rightBtnIcon}
                    </span>
                    {card.rightBtnLabel}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View Container */}
      {viewMode === 'table' && (
        <div
          className="flex flex-col bg-surface-container-lowest border border-outline-variant rounded shadow-[2px_2px_0px_#0c1f19] overflow-x-auto"
          id="table-view-panel"
        >
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="p-space-md font-label-md text-label-md text-on-surface w-12">
                  Status
                </th>
                <th className="p-space-md font-label-md text-label-md text-on-surface">
                  Asset Title &amp; Prompt
                </th>
                <th className="p-space-md font-label-md text-label-md text-on-surface">
                  Episode
                </th>
                <th className="p-space-md font-label-md text-label-md text-on-surface">
                  Model / Source
                </th>
                <th className="p-space-md font-label-md text-label-md text-on-surface">
                  Format
                </th>
                <th className="p-space-md font-label-md text-label-md text-on-surface text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant font-body-sm text-body-sm text-on-surface">
              {visibleAssets.map((row) => (
                <tr key={row.id} className="hover:bg-surface transition-colors">
                  <td className="p-space-md">
                    <span
                      className={`w-3 h-3 rounded-full ${row.barColor} inline-block`}
                      title={row.badgeText}
                    ></span>
                  </td>
                  <td className="p-space-md">
                    <div className="flex flex-col">
                      <span className="font-semibold text-on-surface">{row.title}</span>
                      <span className="text-on-surface-variant truncate max-w-md">
                        {row.promptOrDetail}
                      </span>
                    </div>
                  </td>
                  <td className="p-space-md">Episode #{row.episode}</td>
                  <td className="p-space-md">{row.model}</td>
                  <td className="p-space-md">{row.tableFormat}</td>
                  <td className="p-space-md text-right">
                    <button
                      onClick={() => onShowToast(`Downloading ${row.title}`)}
                      className="px-space-sm py-1 bg-surface-container rounded border border-outline-variant text-on-surface font-label-sm text-label-sm"
                      type="button"
                    >
                      {row.id === 'lib4' ? 'Reuse' : 'Download'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bottom Workbench Status & Export Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md p-space-md bg-surface-container-lowest border border-outline-variant rounded shadow-[2px_2px_0px_#0c1f19]">
        <div className="flex items-center gap-space-sm text-on-surface-variant font-body-sm text-body-sm">
          <span className="material-symbols-outlined text-[18px] text-outline">database</span>
          <span>
            Displaying 48 generated assets · 3.2 GB stored in workshop cache · Filter active:{' '}
            {episodeFilter === 'all' && typeFilter === 'all' && !searchQuery ? 'None' : 'Custom'}
          </span>
        </div>
        <div className="flex items-center gap-space-sm w-full sm:w-auto justify-end">
          <button
            onClick={() => onShowToast('Exported 48 asset metadata rows to CSV')}
            className="bg-surface-container-lowest text-on-surface font-label-md text-label-md px-space-md py-space-xs rounded border border-on-surface shadow-[2px_2px_0px_#0c1f19] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-1"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            Export asset metadata (CSV)
          </button>
        </div>
      </div>
    </div>
  );
};
