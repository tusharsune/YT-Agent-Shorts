import React, { useState } from 'react';
import { ScreenId } from '../utils/navigation';

interface EpisodeTrackerScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onShowToast: (msg: string) => void;
}

type TrackerFilter = 'all' | 'media-pending' | 'in-assembly' | 'ready';

export const EpisodeTrackerScreen: React.FC<EpisodeTrackerScreenProps> = ({
  onNavigate,
  onShowToast,
}) => {
  const [activeFilter, setActiveFilter] = useState<TrackerFilter>('all');
  const [batchSynced, setBatchSynced] = useState(false);
  const [scheduledEp143, setScheduledEp143] = useState(false);

  const handleBatchSync = () => {
    setBatchSynced(true);
    onShowToast('Pipeline states synchronized across 5 active episodes');
    setTimeout(() => setBatchSynced(false), 2200);
  };

  const showEpisode = (category: TrackerFilter) =>
    activeFilter === 'all' || activeFilter === category;

  return (
    <div className="flex flex-col w-full">
      <div className="p-space-lg max-w-7xl mx-auto w-full flex flex-col gap-space-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex flex-col">
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Episode Tracker</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Active YouTube Shorts production pipeline and multi-stage verification workbench
            </p>
          </div>
          <div className="flex items-center gap-space-sm">
            <button
              onClick={handleBatchSync}
              className="bg-surface-container-lowest text-on-surface font-label-md text-label-md px-space-md py-space-xs rounded border border-on-surface shadow-[2px_2px_0px_#0c1f19] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-space-xs"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                {batchSynced ? 'check' : 'sync'}
              </span>
              {batchSynced ? 'Synced' : 'Batch sync'}
            </button>
            <button
              onClick={() => onShowToast('Created new Short episode slot (#147)')}
              className="bg-secondary-container text-on-primary font-label-md text-label-md px-space-md py-space-xs rounded border border-on-surface shadow-[2px_2px_0px_#0c1f19] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-space-xs"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              Create new Short
            </button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md">
          <div className="bg-surface-container-lowest p-space-md rounded border border-outline-variant flex items-center gap-space-md">
            <div className="w-10 h-10 rounded bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">movie</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                In active pipeline
              </span>
              <span className="font-metric-num text-metric-num text-on-surface">5</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-space-md rounded border border-outline-variant flex items-center gap-space-md">
            <div className="w-10 h-10 rounded bg-error-container flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined">warning</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Requiring attention
              </span>
              <span className="font-metric-num text-metric-num text-secondary">1</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-space-md rounded border border-outline-variant flex items-center gap-space-md">
            <div className="w-10 h-10 rounded bg-tertiary-fixed flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined">hourglass_empty</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Waiting on renders
              </span>
              <span className="font-metric-num text-metric-num text-tertiary">2</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-space-md rounded border border-outline-variant flex items-center gap-space-md">
            <div className="w-10 h-10 rounded bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">task_alt</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Ready or scheduled
              </span>
              <span className="font-metric-num text-metric-num text-primary">2</span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-surface-container-lowest p-space-sm rounded border border-outline-variant flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex flex-wrap items-center gap-space-xs">
            {(
              [
                { id: 'all', label: 'All (12)' },
                { id: 'media-pending', label: 'Media pending (3)' },
                { id: 'in-assembly', label: 'In assembly (2)' },
                { id: 'ready', label: 'Ready to schedule (1)' },
              ] as const
            ).map((tab) => {
              const active = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={
                    active
                      ? 'bg-surface-container text-on-surface font-label-md text-label-md px-space-md py-space-xs rounded font-bold'
                      : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-md text-label-md px-space-md py-space-xs rounded'
                  }
                  type="button"
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-space-sm">
            <button
              onClick={() => onShowToast('Filtering by speedcubing niche tags')}
              className="flex items-center gap-space-xs px-space-sm py-space-xs bg-surface-container-low rounded border border-outline-variant"
              type="button"
            >
              <span className="material-symbols-outlined text-outline text-[16px]">
                filter_list
              </span>
              <span className="font-label-sm text-label-sm text-on-surface">
                Filter by speedcubing niche
              </span>
            </button>
          </div>
        </div>

        {/* Episode Cards */}
        <div className="flex flex-col gap-space-md">
          {/* Episode #142 */}
          {showEpisode('media-pending') && (
            <div className="bg-surface-container-lowest rounded border border-outline-variant relative overflow-hidden flex flex-col md:flex-row">
              <div className="w-full md:w-2 bg-tertiary-fixed-dim h-2 md:h-auto shrink-0"></div>
              <div className="p-space-md flex-1 flex flex-col gap-space-md">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-sm">
                  <div className="flex items-center gap-space-md flex-wrap">
                    <span className="bg-surface-container-high text-on-surface font-label-md text-label-md px-space-sm py-space-xs rounded">
                      Episode #142
                    </span>
                    <h2 className="font-headline-md text-headline-md text-on-surface">
                      God&apos;s Number Blindfolded
                    </h2>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Target length: 48 seconds
                    </span>
                    <span className="bg-surface-container-low text-on-surface font-label-sm text-label-sm px-space-xs py-0.5 rounded">
                      Speedcubing lore
                    </span>
                  </div>
                  <div className="flex items-center gap-space-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed-dim"></span>
                    <span className="font-label-sm text-label-sm text-on-surface font-medium">
                      Awaiting inputs
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 p-space-xs bg-surface-container-low rounded">
                  <div className="bg-primary-container text-on-primary p-space-xs rounded flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    <span className="font-label-sm text-label-sm font-semibold">1. Idea</span>
                  </div>
                  <div className="bg-primary-container text-on-primary p-space-xs rounded flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    <span className="font-label-sm text-label-sm font-semibold">2. Script</span>
                  </div>
                  <div className="bg-primary-container text-on-primary p-space-xs rounded flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    <span className="font-label-sm text-label-sm font-semibold">
                      3. Voice direction
                    </span>
                  </div>
                  <div className="bg-primary-container text-on-primary p-space-xs rounded flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    <span className="font-label-sm text-label-sm font-semibold">4. Packaged</span>
                  </div>
                  <div className="bg-secondary-fixed text-on-secondary-fixed p-space-xs rounded flex flex-col items-center justify-center text-center shadow-[0_0_0_2px_#ff5d3b]">
                    <span className="material-symbols-outlined text-[16px] text-secondary-container">
                      pending
                    </span>
                    <span className="font-label-sm text-label-sm font-bold">5. Media pending</span>
                  </div>
                  <div className="bg-surface-container-lowest text-on-surface-variant p-space-xs rounded border border-outline-variant flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[16px] text-outline">
                      horizontal_rule
                    </span>
                    <span className="font-label-sm text-label-sm">6. Assembled</span>
                  </div>
                  <div className="bg-surface-container-lowest text-on-surface-variant p-space-xs rounded border border-outline-variant flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[16px] text-outline">
                      horizontal_rule
                    </span>
                    <span className="font-label-sm text-label-sm">7. Scheduled</span>
                  </div>
                  <div className="bg-surface-container-lowest text-on-surface-variant p-space-xs rounded border border-outline-variant flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[16px] text-outline">
                      horizontal_rule
                    </span>
                    <span className="font-label-sm text-label-sm">8. Published</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pt-space-xs">
                  <div className="flex items-center gap-space-sm text-tertiary">
                    <span className="material-symbols-outlined text-[18px]">info</span>
                    <span className="font-body-md text-body-md text-on-surface">
                      Waiting on Scene 3 Runway render (2 of 6 prompts left in queue)
                    </span>
                  </div>
                  <div className="flex items-center gap-space-sm">
                    <button
                      onClick={() => onNavigate('script-viewer')}
                      className="bg-surface-container text-on-surface font-label-md text-label-md px-space-md py-space-xs rounded border border-on-surface shadow-[2px_2px_0px_#0c1f19] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                      type="button"
                    >
                      Edit script
                    </button>
                    <button
                      onClick={() => onNavigate('prompt-queue')}
                      className="bg-surface-container-high text-on-surface font-label-md text-label-md px-space-md py-space-xs rounded border border-on-surface shadow-[2px_2px_0px_#0c1f19] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                      type="button"
                    >
                      Open queue items
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Episode #141 */}
          {showEpisode('media-pending') && (
            <div className="bg-surface-container-lowest rounded border border-outline-variant relative overflow-hidden flex flex-col md:flex-row">
              <div className="w-full md:w-2 bg-secondary-container h-2 md:h-auto shrink-0"></div>
              <div className="p-space-md flex-1 flex flex-col gap-space-md">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-sm">
                  <div className="flex items-center gap-space-md flex-wrap">
                    <span className="bg-surface-container-high text-on-surface font-label-md text-label-md px-space-sm py-space-xs rounded">
                      Episode #141
                    </span>
                    <h2 className="font-headline-md text-headline-md text-on-surface">
                      World Record Megaminx Fails
                    </h2>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Target length: 54 seconds
                    </span>
                    <span className="bg-surface-container-low text-on-surface font-label-sm text-label-sm px-space-xs py-0.5 rounded">
                      Puzzle comedy
                    </span>
                  </div>
                  <div className="flex items-center gap-space-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
                    <span className="font-label-sm text-label-sm text-secondary font-medium">
                      Urgent bottleneck
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 p-space-xs bg-surface-container-low rounded">
                  <div className="bg-primary-container text-on-primary p-space-xs rounded flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    <span className="font-label-sm text-label-sm font-semibold">1. Idea</span>
                  </div>
                  <div className="bg-primary-container text-on-primary p-space-xs rounded flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    <span className="font-label-sm text-label-sm font-semibold">2. Script</span>
                  </div>
                  <div className="bg-secondary-fixed text-on-secondary-fixed p-space-xs rounded flex flex-col items-center justify-center text-center shadow-[0_0_0_2px_#ff5d3b]">
                    <span className="material-symbols-outlined text-[16px] text-secondary-container">
                      record_voice_over
                    </span>
                    <span className="font-label-sm text-label-sm font-bold">
                      3. Voice direction
                    </span>
                  </div>
                  <div className="bg-surface-container-lowest text-on-surface-variant p-space-xs rounded border border-outline-variant flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[16px] text-outline">
                      horizontal_rule
                    </span>
                    <span className="font-label-sm text-label-sm">4. Packaged</span>
                  </div>
                  <div className="bg-surface-container-lowest text-on-surface-variant p-space-xs rounded border border-outline-variant flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[16px] text-outline">
                      horizontal_rule
                    </span>
                    <span className="font-label-sm text-label-sm">5. Media pending</span>
                  </div>
                  <div className="bg-surface-container-lowest text-on-surface-variant p-space-xs rounded border border-outline-variant flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[16px] text-outline">
                      horizontal_rule
                    </span>
                    <span className="font-label-sm text-label-sm">6. Assembled</span>
                  </div>
                  <div className="bg-surface-container-lowest text-on-surface-variant p-space-xs rounded border border-outline-variant flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[16px] text-outline">
                      horizontal_rule
                    </span>
                    <span className="font-label-sm text-label-sm">7. Scheduled</span>
                  </div>
                  <div className="bg-surface-container-lowest text-on-surface-variant p-space-xs rounded border border-outline-variant flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[16px] text-outline">
                      horizontal_rule
                    </span>
                    <span className="font-label-sm text-label-sm">8. Published</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pt-space-xs">
                  <div className="flex items-center gap-space-sm text-secondary">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    <span className="font-body-md text-body-md text-on-surface font-medium">
                      Hook tone too flat; revised voice notes added for 0:00 - 0:04
                    </span>
                  </div>
                  <div className="flex items-center gap-space-sm">
                    <button
                      onClick={() => onNavigate('script-viewer')}
                      className="bg-surface-container text-on-surface font-label-md text-label-md px-space-md py-space-xs rounded border border-on-surface shadow-[2px_2px_0px_#0c1f19] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                      type="button"
                    >
                      View voice notes
                    </button>
                    <button
                      onClick={() =>
                        onShowToast('Dispatched ElevenLabs voice regeneration for Episode #141')
                      }
                      className="bg-secondary-container text-on-primary font-label-md text-label-md px-space-md py-space-xs rounded border border-on-surface shadow-[2px_2px_0px_#0c1f19] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                      type="button"
                    >
                      Regenerate audio
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Episode #143 */}
          {showEpisode('in-assembly') && (
            <div className="bg-surface-container-lowest rounded border border-outline-variant relative overflow-hidden flex flex-col md:flex-row">
              <div className="w-full md:w-2 bg-primary-container h-2 md:h-auto shrink-0"></div>
              <div className="p-space-md flex-1 flex flex-col gap-space-md">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-sm">
                  <div className="flex items-center gap-space-md flex-wrap">
                    <span className="bg-surface-container-high text-on-surface font-label-md text-label-md px-space-sm py-space-xs rounded">
                      Episode #143
                    </span>
                    <h2 className="font-headline-md text-headline-md text-on-surface">
                      The Impossible 1x1 Parody
                    </h2>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Target length: 32 seconds
                    </span>
                    <span className="bg-surface-container-low text-on-surface font-label-sm text-label-sm px-space-xs py-0.5 rounded">
                      Satire
                    </span>
                  </div>
                  <div className="flex items-center gap-space-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
                    <span className="font-label-sm text-label-sm text-primary font-medium">
                      {scheduledEp143 ? 'Scheduled' : 'On track'}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 p-space-xs bg-surface-container-low rounded">
                  <div className="bg-primary-container text-on-primary p-space-xs rounded flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    <span className="font-label-sm text-label-sm font-semibold">1. Idea</span>
                  </div>
                  <div className="bg-primary-container text-on-primary p-space-xs rounded flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    <span className="font-label-sm text-label-sm font-semibold">2. Script</span>
                  </div>
                  <div className="bg-primary-container text-on-primary p-space-xs rounded flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    <span className="font-label-sm text-label-sm font-semibold">
                      3. Voice direction
                    </span>
                  </div>
                  <div className="bg-primary-container text-on-primary p-space-xs rounded flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    <span className="font-label-sm text-label-sm font-semibold">4. Packaged</span>
                  </div>
                  <div className="bg-primary-container text-on-primary p-space-xs rounded flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    <span className="font-label-sm text-label-sm font-semibold">
                      5. Media pending
                    </span>
                  </div>
                  <div className="bg-secondary-fixed text-on-secondary-fixed p-space-xs rounded flex flex-col items-center justify-center text-center shadow-[0_0_0_2px_#ff5d3b]">
                    <span className="material-symbols-outlined text-[16px] text-secondary-container">
                      video_settings
                    </span>
                    <span className="font-label-sm text-label-sm font-bold">6. Assembled</span>
                  </div>
                  <div className="bg-surface-container-lowest text-on-surface-variant p-space-xs rounded border border-outline-variant flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[16px] text-outline">
                      horizontal_rule
                    </span>
                    <span className="font-label-sm text-label-sm">7. Scheduled</span>
                  </div>
                  <div className="bg-surface-container-lowest text-on-surface-variant p-space-xs rounded border border-outline-variant flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[16px] text-outline">
                      horizontal_rule
                    </span>
                    <span className="font-label-sm text-label-sm">8. Published</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pt-space-xs">
                  <div className="flex items-center gap-space-sm text-primary">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span className="font-body-md text-body-md text-on-surface">
                      CapCut assembly complete, 1080x1920 60fps export verified
                    </span>
                  </div>
                  <div className="flex items-center gap-space-sm">
                    <button
                      onClick={() => onShowToast('Opening 1080x1920 60fps master preview')}
                      className="bg-surface-container text-on-surface font-label-md text-label-md px-space-md py-space-xs rounded border border-on-surface shadow-[2px_2px_0px_#0c1f19] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                      type="button"
                    >
                      Watch preview
                    </button>
                    <button
                      onClick={() => {
                        setScheduledEp143(true);
                        onShowToast('Episode #143 approved and pushed to release schedule');
                      }}
                      className="bg-primary-container text-on-primary font-label-md text-label-md px-space-md py-space-xs rounded border border-on-surface shadow-[2px_2px_0px_#0c1f19] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                      type="button"
                    >
                      {scheduledEp143 ? 'Scheduled ✓' : 'Approve & schedule'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Episode #140 */}
          {showEpisode('ready') && (
            <div className="bg-surface-container-lowest rounded border border-outline-variant relative overflow-hidden flex flex-col md:flex-row">
              <div className="w-full md:w-2 bg-primary-container h-2 md:h-auto shrink-0"></div>
              <div className="p-space-md flex-1 flex flex-col gap-space-md">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-sm">
                  <div className="flex items-center gap-space-md flex-wrap">
                    <span className="bg-surface-container-high text-on-surface font-label-md text-label-md px-space-sm py-space-xs rounded">
                      Episode #140
                    </span>
                    <h2 className="font-headline-md text-headline-md text-on-surface">
                      Pyraminx 1-Look Solves
                    </h2>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Target length: 42 seconds
                    </span>
                    <span className="bg-surface-container-low text-on-surface font-label-sm text-label-sm px-space-xs py-0.5 rounded">
                      Tutorial
                    </span>
                  </div>
                  <div className="flex items-center gap-space-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
                    <span className="font-label-sm text-label-sm text-primary font-medium">
                      Scheduled
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 p-space-xs bg-surface-container-low rounded">
                  <div className="bg-primary-container text-on-primary p-space-xs rounded flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    <span className="font-label-sm text-label-sm font-semibold">1. Idea</span>
                  </div>
                  <div className="bg-primary-container text-on-primary p-space-xs rounded flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    <span className="font-label-sm text-label-sm font-semibold">2. Script</span>
                  </div>
                  <div className="bg-primary-container text-on-primary p-space-xs rounded flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    <span className="font-label-sm text-label-sm font-semibold">
                      3. Voice direction
                    </span>
                  </div>
                  <div className="bg-primary-container text-on-primary p-space-xs rounded flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    <span className="font-label-sm text-label-sm font-semibold">4. Packaged</span>
                  </div>
                  <div className="bg-primary-container text-on-primary p-space-xs rounded flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    <span className="font-label-sm text-label-sm font-semibold">
                      5. Media pending
                    </span>
                  </div>
                  <div className="bg-primary-container text-on-primary p-space-xs rounded flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    <span className="font-label-sm text-label-sm font-semibold">6. Assembled</span>
                  </div>
                  <div className="bg-secondary-fixed text-on-secondary-fixed p-space-xs rounded flex flex-col items-center justify-center text-center shadow-[0_0_0_2px_#ff5d3b]">
                    <span className="material-symbols-outlined text-[16px] text-secondary-container">
                      calendar_month
                    </span>
                    <span className="font-label-sm text-label-sm font-bold">7. Scheduled</span>
                  </div>
                  <div className="bg-surface-container-lowest text-on-surface-variant p-space-xs rounded border border-outline-variant flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[16px] text-outline">
                      horizontal_rule
                    </span>
                    <span className="font-label-sm text-label-sm">8. Published</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pt-space-xs">
                  <div className="flex items-center gap-space-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px] text-primary">
                      schedule
                    </span>
                    <span className="font-body-md text-body-md text-on-surface">
                      Auto-publishing set for Friday 15:00 UTC (YouTube Shorts + TikTok queue
                      synced)
                    </span>
                  </div>
                  <div className="flex items-center gap-space-sm">
                    <button
                      onClick={() => onNavigate('calendar')}
                      className="bg-surface-container text-on-surface font-label-md text-label-md px-space-md py-space-xs rounded border border-on-surface shadow-[2px_2px_0px_#0c1f19] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                      type="button"
                    >
                      View scheduled post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Episode #144 */}
          {showEpisode('in-assembly') && (
            <div className="bg-surface-container-lowest rounded border border-outline-variant relative overflow-hidden flex flex-col md:flex-row">
              <div className="w-full md:w-2 bg-tertiary-fixed-dim h-2 md:h-auto shrink-0"></div>
              <div className="p-space-md flex-1 flex flex-col gap-space-md">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-sm">
                  <div className="flex items-center gap-space-md flex-wrap">
                    <span className="bg-surface-container-high text-on-surface font-label-md text-label-md px-space-sm py-space-xs rounded">
                      Episode #144
                    </span>
                    <h2 className="font-headline-md text-headline-md text-on-surface">
                      Square-1 Shape Shifting Explained
                    </h2>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Target length: 50 seconds
                    </span>
                    <span className="bg-surface-container-low text-on-surface font-label-sm text-label-sm px-space-xs py-0.5 rounded">
                      Mechanism analysis
                    </span>
                  </div>
                  <div className="flex items-center gap-space-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed-dim"></span>
                    <span className="font-label-sm text-label-sm text-on-surface font-medium">
                      Script review
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 p-space-xs bg-surface-container-low rounded">
                  <div className="bg-primary-container text-on-primary p-space-xs rounded flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    <span className="font-label-sm text-label-sm font-semibold">1. Idea</span>
                  </div>
                  <div className="bg-secondary-fixed text-on-secondary-fixed p-space-xs rounded flex flex-col items-center justify-center text-center shadow-[0_0_0_2px_#ff5d3b]">
                    <span className="material-symbols-outlined text-[16px] text-secondary-container">
                      edit_document
                    </span>
                    <span className="font-label-sm text-label-sm font-bold">2. Script</span>
                  </div>
                  <div className="bg-surface-container-lowest text-on-surface-variant p-space-xs rounded border border-outline-variant flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[16px] text-outline">
                      horizontal_rule
                    </span>
                    <span className="font-label-sm text-label-sm">3. Voice direction</span>
                  </div>
                  <div className="bg-surface-container-lowest text-on-surface-variant p-space-xs rounded border border-outline-variant flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[16px] text-outline">
                      horizontal_rule
                    </span>
                    <span className="font-label-sm text-label-sm">4. Packaged</span>
                  </div>
                  <div className="bg-surface-container-lowest text-on-surface-variant p-space-xs rounded border border-outline-variant flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[16px] text-outline">
                      horizontal_rule
                    </span>
                    <span className="font-label-sm text-label-sm">5. Media pending</span>
                  </div>
                  <div className="bg-surface-container-lowest text-on-surface-variant p-space-xs rounded border border-outline-variant flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[16px] text-outline">
                      horizontal_rule
                    </span>
                    <span className="font-label-sm text-label-sm">6. Assembled</span>
                  </div>
                  <div className="bg-surface-container-lowest text-on-surface-variant p-space-xs rounded border border-outline-variant flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[16px] text-outline">
                      horizontal_rule
                    </span>
                    <span className="font-label-sm text-label-sm">7. Scheduled</span>
                  </div>
                  <div className="bg-surface-container-lowest text-on-surface-variant p-space-xs rounded border border-outline-variant flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-[16px] text-outline">
                      horizontal_rule
                    </span>
                    <span className="font-label-sm text-label-sm">8. Published</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pt-space-xs">
                  <div className="flex items-center gap-space-sm text-on-surface">
                    <span className="material-symbols-outlined text-[18px] text-tertiary">
                      rate_review
                    </span>
                    <span className="font-body-md text-body-md text-on-surface">
                      Draft 2 in review: checking kite-to-barrel transformation pacing
                    </span>
                  </div>
                  <div className="flex items-center gap-space-sm">
                    <button
                      onClick={() => onNavigate('script-viewer')}
                      className="bg-surface-container text-on-surface font-label-md text-label-md px-space-md py-space-xs rounded border border-on-surface shadow-[2px_2px_0px_#0c1f19] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                      type="button"
                    >
                      Review draft
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-surface-container p-space-lg rounded border border-outline-variant flex flex-col lg:flex-row items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md">
            <div className="w-12 h-12 bg-surface-container-lowest rounded border border-outline-variant flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-[28px]">speed</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-on-surface">
                Weekly throughput velocity
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Target cadence: 4 published Shorts per week | Current pace: 3 on schedule
              </span>
            </div>
          </div>
          <div className="flex items-center gap-space-sm w-full lg:w-auto justify-end">
            <button
              onClick={() => onNavigate('publish-log')}
              className="bg-surface-container-lowest text-on-surface font-label-md text-label-md px-space-md py-space-xs rounded border border-on-surface shadow-[2px_2px_0px_#0c1f19] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              type="button"
            >
              Pipeline analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
