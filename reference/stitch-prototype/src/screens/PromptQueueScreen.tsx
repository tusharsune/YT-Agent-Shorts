import React, { useRef, useState } from 'react';
import { filterPromptItems, PromptItemFilterable } from '../utils/navigation';

interface PromptQueueScreenProps {
  onShowToast: (msg: string) => void;
}

interface QueueCardData extends PromptItemFilterable {
  scene: string;
  badgeLabel: string;
  barColor: string;
  statusLabel: string;
  statusType: 'pending-asset' | 'pending-stem' | 'fulfilled' | 'urgent';
  promptHeading: string;
  specs: string[];
  uploadType?: 'video' | 'audio' | 'urgent-video';
  fulfilledTime?: string;
  fulfilledFile?: string;
  fulfilledImage?: string;
  isAudioPlayer?: boolean;
}

const INITIAL_QUEUE_ITEMS: QueueCardData[] = [
  {
    id: 'q1',
    title: "God's Number Blindfold",
    scene: 'Scene 3',
    badgeLabel: 'Video (Runway Gen-3)',
    model: 'Runway Gen-3',
    type: 'video',
    status: 'pending',
    barColor: 'bg-[#FFC53D]',
    statusLabel: 'Pending asset',
    statusType: 'pending-asset',
    promptHeading: 'Prompt generation text',
    prompt:
      'Macro hyper-detailed camera zoom into a GAN 12 MagLev speedcube turning at 15 turns per second, neon orange internal magnets clicking into place, studio lighting, high frame rate, crisp focus',
    specs: ['Aspect: 9:16 vertical', 'Duration: 4.0s', 'Motion scale: 7', 'Seed: 8841920'],
    uploadType: 'video',
  },
  {
    id: 'q2',
    title: 'The Impossible 1x1 Parody',
    scene: 'Scene 1',
    badgeLabel: 'Voice (ElevenLabs)',
    model: 'ElevenLabs',
    type: 'voice',
    status: 'pending',
    barColor: 'bg-[#FFC53D]',
    statusLabel: 'Pending stem',
    statusType: 'pending-stem',
    promptHeading: 'Voice prompt & delivery',
    prompt:
      "Deadpan instructional narrator speaking with high confidence about the complex mathematics behind solving a 1x1 Rubik's cube in under 0.05 seconds, pacing snappy, sarcastic undertone",
    specs: [
      'Voice: Adam (Deep British)',
      'Stability: 0.65',
      'Clarity: 0.85',
      'Est duration: 8.2s',
    ],
    uploadType: 'audio',
  },
  {
    id: 'q3',
    title: 'Mirror Blocks Speed Run',
    scene: 'Scene 4',
    badgeLabel: 'Image (Midjourney v6)',
    model: 'Midjourney v6',
    type: 'image',
    status: 'fulfilled',
    barColor: 'bg-[#1FB6A6]',
    statusLabel: 'Fulfilled 20m ago',
    statusType: 'fulfilled',
    promptHeading: 'Prompt generation text',
    prompt:
      'Monochrome brushed silver mirror cube reflecting neon studio lights on polished dark concrete surface, dramatic 45-degree angle composition',
    specs: ['Aspect: 9:16', 'Stylize: 250', 'Raw mode: On', 'Upscaled: 2160x3840'],
    fulfilledFile: 'mirror_cube_sc4_v6.png',
    fulfilledImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCWk0VZZMJp5FtZZotIFvMF7Bdn0ToKaoxH-d_gLmlJmedBe6qytKIbafp9Bdvoowe__XsjEStnvhM0nWg-nQua9KbjPmwtGMxERLtLc3rRx8XGJHA4e3ZJ0WHZYL3Asjan6msHdOicTHDq4Kf5v1oUfJbbZxWgX-H4Kvy4ThID2AWNtuzk_YjAucjlPNnAy8fJGYrqlXvs7NEfjJTCTaxbLWQx71mTFe8rqs6cUdg',
  },
  {
    id: 'q4',
    title: 'Ghost Cube Nightmare',
    scene: 'Scene 2',
    badgeLabel: 'Video (Luma Dream Machine)',
    model: 'Luma Dream Machine',
    type: 'video',
    status: 'pending',
    barColor: 'bg-[#FF5D3B]',
    statusLabel: 'Urgent blocker (drop tomorrow)',
    statusType: 'urgent',
    promptHeading: 'Prompt generation text',
    prompt:
      'Slow panning sequence around an unaligned ghost cube showing irregular geometric polyhedral faces casting sharp shadows, high contrast tabletop setup',
    specs: [
      'Camera: Orbit 45 degrees',
      'Speed: 0.8x',
      'Lighting: Hard key light right',
      'Render priority: Immediate',
    ],
    uploadType: 'urgent-video',
  },
  {
    id: 'q5',
    title: "God's Number Blindfold",
    scene: 'Scene 1',
    badgeLabel: 'Voice (ElevenLabs)',
    model: 'ElevenLabs',
    type: 'voice',
    status: 'fulfilled',
    barColor: 'bg-[#1FB6A6]',
    statusLabel: 'Fulfilled 1h ago',
    statusType: 'fulfilled',
    promptHeading: 'Voice line audio script',
    prompt:
      "Energetic hook intro: Did you know the world record for solving a Rubik's cube blindfolded is under fifteen seconds?",
    specs: [
      'Voice: Marcus (Hyped)',
      'Duration: 4.8s',
      'Sample rate: 48kHz',
      'Mastered: LUFS -14',
    ],
    isAudioPlayer: true,
    fulfilledFile: 'Intro_Hook_V1.wav',
  },
];

export const PromptQueueScreen: React.FC<PromptQueueScreenProps> = ({ onShowToast }) => {
  const [items, setItems] = useState<QueueCardData[]>(INITIAL_QUEUE_ITEMS);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'fulfilled'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'video' | 'image' | 'voice'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const visibleItems = filterPromptItems(items, statusFilter, typeFilter, searchQuery);

  const handleCopyPrompt = (promptText: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(promptText).catch(() => {});
    }
    onShowToast('Prompt copied to clipboard');
  };

  const handleCopyAllPending = () => {
    const pendingPrompts = items
      .filter((item) => item.status === 'pending')
      .map((item, idx) => `${idx + 1}. ${item.prompt}`)
      .join('\n\n');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(pendingPrompts).catch(() => {});
    }
    onShowToast('Copied all pending prompts');
  };

  const handleFulfillItem = (id: string, defaultFilename: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'fulfilled',
              barColor: 'bg-[#1FB6A6]',
              statusLabel: 'Fulfilled just now',
              statusType: 'fulfilled',
              fulfilledFile: defaultFilename,
            }
          : item
      )
    );
    onShowToast(`Asset "${defaultFilename}" uploaded & fulfilled`);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="p-space-lg max-w-7xl mx-auto w-full flex flex-col gap-space-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex flex-col">
            <h1 className="font-headline-lg text-headline-lg text-on-surface">
              Prompt Queue &amp; Fulfill
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Active generation backlog across 4 scheduled short-form episodes
            </p>
          </div>
          <div className="flex items-center gap-space-sm self-start md:self-auto">
            <button
              onClick={handleCopyAllPending}
              className="bg-surface-container-lowest text-on-surface font-label-md text-label-md px-space-md py-space-xs rounded border border-outline-variant hover:bg-surface-container-low transition-colors flex items-center gap-space-xs"
              id="copyPendingBtn"
              type="button"
            >
              <span className="material-symbols-outlined text-base">copy_all</span>
              <span>Copy all prompts</span>
            </button>
            <button
              onClick={() => onShowToast('Exported pending prompts batch (JSON/TXT)')}
              className="bg-secondary-container text-on-primary font-label-md text-label-md px-space-md py-space-xs rounded border border-on-surface shadow-[2px_2px_0px_#0c1f19] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-space-xs"
              id="exportPendingBtn"
              type="button"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>Export all pending prompts</span>
            </button>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
          <div className="bg-surface-container-lowest p-space-md rounded border border-outline-variant flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Pending prompts
              </span>
              <span className="font-metric-num text-metric-num text-on-surface">14</span>
            </div>
            <div className="w-10 h-10 rounded bg-surface-container-low flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined">hourglass_top</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-space-md rounded border border-outline-variant flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Urgent bottlenecks
              </span>
              <span className="font-metric-num text-metric-num text-secondary">1</span>
            </div>
            <div className="w-10 h-10 rounded bg-surface-container-low flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined">warning</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-space-md rounded border border-outline-variant flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Fulfilled today
              </span>
              <span className="font-metric-num text-metric-num text-primary">8</span>
            </div>
            <div className="w-10 h-10 rounded bg-surface-container-low flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-space-md rounded border border-outline-variant flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Avg turnaround
              </span>
              <span className="font-metric-num text-metric-num text-on-surface">6.4m</span>
            </div>
            <div className="w-10 h-10 rounded bg-surface-container-low flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined">bolt</span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-surface-container-lowest p-space-md rounded border border-outline-variant flex flex-col gap-space-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-lg pointer-events-none">
                search
              </span>
              <input
                aria-label="Search prompts, episodes, models"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-space-md py-1.5 bg-surface-container-lowest border border-outline-variant rounded font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container"
                id="promptSearchInput"
                placeholder="Search prompts, episodes, models..."
                type="text"
              />
            </div>

            <div className="flex flex-wrap items-center gap-space-sm">
              <div className="flex items-center gap-space-xs p-1 bg-surface-container-low rounded border border-outline-variant">
                {(
                  [
                    { id: 'all', label: 'All' },
                    { id: 'pending', label: 'Pending' },
                    { id: 'fulfilled', label: 'Fulfilled' },
                  ] as const
                ).map((tab) => {
                  const active = statusFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setStatusFilter(tab.id)}
                      className={
                        active
                          ? 'filter-status-btn px-space-sm py-1 rounded font-label-sm text-label-sm bg-surface-container-lowest text-on-surface border border-outline-variant font-semibold'
                          : 'filter-status-btn px-space-sm py-1 rounded font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface'
                      }
                      type="button"
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="h-6 w-[1px] bg-outline-variant hidden sm:block"></div>

              <div className="flex flex-wrap items-center gap-space-xs">
                {(
                  [
                    { id: 'all', label: 'All types' },
                    { id: 'video', label: 'Video prompts (6)' },
                    { id: 'image', label: 'Image prompts (5)' },
                    { id: 'voice', label: 'Voice direction (3)' },
                  ] as const
                ).map((t) => {
                  const active = typeFilter === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTypeFilter(t.id)}
                      className={
                        active
                          ? 'filter-type-btn px-space-sm py-1 rounded font-label-sm text-label-sm bg-surface-container-high text-on-surface border border-on-surface font-semibold'
                          : 'filter-type-btn px-space-sm py-1 rounded font-label-sm text-label-sm bg-surface-container-lowest text-on-surface-variant border border-outline-variant hover:border-on-surface'
                      }
                      type="button"
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Prompt Cards List */}
        <div className="flex flex-col gap-space-md" id="queueContainer">
          {visibleItems.map((card) => (
            <div
              key={card.id}
              className="prompt-card bg-surface-container-lowest rounded border border-outline-variant overflow-hidden flex flex-col md:flex-row relative"
              data-status={card.status}
              data-type={card.type}
            >
              <div className={`w-1.5 self-stretch ${card.barColor} shrink-0`}></div>
              <div className="p-space-md flex-1 flex flex-col gap-space-sm">
                <div className="flex flex-wrap items-center justify-between gap-space-sm">
                  <div className="flex items-center gap-space-sm">
                    <span className="font-headline-sm text-headline-sm text-on-surface">
                      {card.title}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant px-space-xs py-0.5 rounded bg-surface-container-low border border-outline-variant">
                      {card.scene}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface px-space-xs py-0.5 rounded bg-surface-container-high border border-outline-variant">
                      {card.badgeLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-space-xs">
                    {card.statusType === 'fulfilled' && (
                      <span className="font-label-sm text-label-sm text-primary font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">check_circle</span>
                        {card.statusLabel}
                      </span>
                    )}
                    {card.statusType === 'urgent' && (
                      <span className="font-label-sm text-label-sm text-secondary font-semibold flex items-center gap-1 bg-secondary-fixed/40 px-2 py-0.5 rounded border border-secondary-container">
                        <span className="material-symbols-outlined text-base text-secondary">
                          error
                        </span>
                        {card.statusLabel}
                      </span>
                    )}
                    {(card.statusType === 'pending-asset' ||
                      card.statusType === 'pending-stem') && (
                      <span className="font-label-sm text-label-sm text-tertiary font-semibold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#FFC53D]"></span>
                        {card.statusLabel}
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-surface-container-low p-space-sm rounded border border-outline-variant flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {card.promptHeading}
                    </span>
                    <button
                      onClick={() => handleCopyPrompt(card.prompt)}
                      className="copy-single-btn font-label-sm text-label-sm text-primary flex items-center gap-1 hover:underline"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-sm">content_copy</span>
                      <span>Copy prompt</span>
                    </button>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface select-all leading-relaxed prompt-text-body">
                    {card.prompt}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-space-md text-on-surface-variant font-label-sm text-label-sm">
                  {card.specs.map((spec) => (
                    <span key={spec}>{spec}</span>
                  ))}
                </div>
              </div>

              {/* Right Column: Upload Dropzone or Fulfilled Preview */}
              <div className="p-space-md border-t md:border-t-0 md:border-l border-outline-variant bg-surface-container-low flex flex-col justify-center items-center gap-space-sm md:w-80 shrink-0">
                <input
                  ref={(el) => {
                    fileInputRefs.current[card.id] = el;
                  }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    handleFulfillItem(
                      card.id,
                      file?.name || `${card.id}_fulfilled_asset.mp4`
                    );
                  }}
                  className="hidden"
                  type="file"
                />

                {card.status === 'pending' && card.uploadType === 'video' && (
                  <>
                    <div
                      onClick={() => handleFulfillItem(card.id, 'gan12_maglev_sc3.mp4')}
                      className="upload-dropzone w-full h-full min-h-[110px] rounded border border-dashed border-outline hover:border-on-surface bg-surface-container-lowest p-space-sm flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
                    >
                      <span className="material-symbols-outlined text-outline text-2xl mb-1">
                        cloud_upload
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                        Drop video file or Browse
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        MP4 or MOV up to 120MB
                      </span>
                    </div>
                    <button
                      onClick={() => handleFulfillItem(card.id, 'gan12_maglev_sc3.mp4')}
                      className="w-full bg-surface-container-lowest text-on-surface font-label-md text-label-md py-1.5 rounded border border-outline-variant hover:bg-surface-container transition-colors flex items-center justify-center gap-space-xs"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-sm">file_upload</span>
                      <span>Select file</span>
                    </button>
                  </>
                )}

                {card.status === 'pending' && card.uploadType === 'audio' && (
                  <>
                    <div
                      onClick={() => handleFulfillItem(card.id, 'parody_1x1_adam_sc1.wav')}
                      className="upload-dropzone w-full h-full min-h-[110px] rounded border border-dashed border-outline hover:border-on-surface bg-surface-container-lowest p-space-sm flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
                    >
                      <span className="material-symbols-outlined text-outline text-2xl mb-1">
                        mic
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                        Drop audio stem (.wav / .mp3)
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        High quality mono stem
                      </span>
                    </div>
                    <button
                      onClick={() => handleFulfillItem(card.id, 'parody_1x1_adam_sc1.wav')}
                      className="w-full bg-surface-container-lowest text-on-surface font-label-md text-label-md py-1.5 rounded border border-outline-variant hover:bg-surface-container transition-colors flex items-center justify-center gap-space-xs"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-sm">audio_file</span>
                      <span>Select audio file</span>
                    </button>
                  </>
                )}

                {card.status === 'pending' && card.uploadType === 'urgent-video' && (
                  <>
                    <div
                      onClick={() => handleFulfillItem(card.id, 'ghost_cube_orbit_sc2.mp4')}
                      className="upload-dropzone w-full h-full min-h-[110px] rounded border border-dashed border-secondary bg-surface-container-lowest p-space-sm flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
                    >
                      <span className="material-symbols-outlined text-secondary text-2xl mb-1">
                        warning
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                        Upload blocking asset
                      </span>
                      <span className="font-body-sm text-body-sm text-secondary font-medium">
                        Production stalled on this shot
                      </span>
                    </div>
                    <button
                      onClick={() => handleFulfillItem(card.id, 'ghost_cube_orbit_sc2.mp4')}
                      className="w-full bg-secondary-container text-on-primary font-label-md text-label-md py-1.5 rounded border border-on-surface shadow-[2px_2px_0px_#0c1f19] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-space-xs"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-sm">upload</span>
                      <span>Fulfill shot now</span>
                    </button>
                  </>
                )}

                {card.status === 'fulfilled' && card.fulfilledImage && (
                  <>
                    <div className="relative w-full h-28 rounded border border-outline-variant overflow-hidden group bg-surface-container-highest">
                      <img
                        alt={card.title}
                        className="w-full h-full object-cover"
                        src={card.fulfilledImage}
                      />
                      <div className="absolute inset-0 bg-on-surface/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-space-xs">
                        <button
                          onClick={() => onShowToast(`Previewing ${card.fulfilledFile}`)}
                          className="p-1 rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container"
                          title="Preview asset"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-base">visibility</span>
                        </button>
                        <button
                          onClick={() => onShowToast(`Downloading ${card.fulfilledFile}`)}
                          className="p-1 rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container"
                          title="Download asset"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-base">download</span>
                        </button>
                      </div>
                    </div>
                    <div className="w-full flex items-center justify-between gap-space-xs">
                      <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
                        {card.fulfilledFile}
                      </span>
                      <button
                        onClick={() => onShowToast(`Ready to replace ${card.fulfilledFile}`)}
                        className="text-primary hover:underline font-label-sm text-label-sm shrink-0"
                        type="button"
                      >
                        Replace file
                      </button>
                    </div>
                  </>
                )}

                {card.status === 'fulfilled' && card.isAudioPlayer && (
                  <>
                    <div className="w-full bg-surface-container-lowest p-space-sm rounded border border-outline-variant flex flex-col gap-space-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                          {card.fulfilledFile}
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          0:04
                        </span>
                      </div>
                      <div className="flex items-center gap-space-xs py-1">
                        <button
                          aria-label={isPlayingAudio ? 'Pause audio' : 'Play audio'}
                          onClick={() => setIsPlayingAudio((p) => !p)}
                          className="w-8 h-8 rounded bg-primary text-on-primary flex items-center justify-center"
                          id="playAudioBtn"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-sm">
                            {isPlayingAudio ? 'pause' : 'play_arrow'}
                          </span>
                        </button>
                        <div className="flex-1 h-8 flex items-center gap-0.5 px-1 bg-surface-container-low rounded">
                          <div className="w-1 h-2 bg-primary rounded-full"></div>
                          <div className="w-1 h-5 bg-primary rounded-full"></div>
                          <div className="w-1 h-6 bg-primary rounded-full"></div>
                          <div className="w-1 h-3 bg-primary rounded-full"></div>
                          <div className="w-1 h-7 bg-primary rounded-full"></div>
                          <div className="w-1 h-4 bg-primary rounded-full"></div>
                          <div className="w-1 h-6 bg-primary rounded-full"></div>
                          <div className="w-1 h-8 bg-primary rounded-full"></div>
                          <div className="w-1 h-5 bg-primary rounded-full"></div>
                          <div className="w-1 h-3 bg-outline rounded-full"></div>
                          <div className="w-1 h-4 bg-outline rounded-full"></div>
                          <div className="w-1 h-2 bg-outline rounded-full"></div>
                          <div className="w-1 h-5 bg-outline rounded-full"></div>
                          <div className="w-1 h-3 bg-outline rounded-full"></div>
                          <div className="w-1 h-1 bg-outline rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full flex items-center justify-between gap-space-xs">
                      <span className="font-label-sm text-label-sm text-primary font-semibold">
                        Synced to timeline
                      </span>
                      <button
                        onClick={() => onShowToast('Queued voice line re-record')}
                        className="text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm"
                        type="button"
                      >
                        Re-record
                      </button>
                    </div>
                  </>
                )}

                {card.status === 'fulfilled' &&
                  !card.fulfilledImage &&
                  !card.isAudioPlayer && (
                    <div className="w-full bg-surface-container-lowest p-space-md rounded border border-outline-variant flex flex-col items-center justify-center gap-space-xs text-center">
                      <span className="material-symbols-outlined text-primary text-2xl">
                        task_alt
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                        {card.fulfilledFile}
                      </span>
                      <span className="font-body-sm text-body-sm text-primary">
                        Verified &amp; linked to scene
                      </span>
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-space-md rounded bg-surface-container-low border border-outline-variant flex flex-col md:flex-row items-center justify-between gap-space-md text-on-surface-variant">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-outline">tune</span>
            <span className="font-body-md text-body-md">
              Showing {visibleItems.length} active pipeline tasks across 3 production episodes
            </span>
          </div>
          <div className="flex items-center gap-space-sm font-label-sm text-label-sm">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5D3B]"></span>Urgent blocker
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFC53D]"></span>Pending asset
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1FB6A6]"></span>Fulfilled
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
