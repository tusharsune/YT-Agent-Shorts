import React, { useState } from 'react';
import { ScreenId } from '../utils/navigation';

interface OverviewScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onShowToast: (msg: string) => void;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  onNavigate,
  onShowToast,
}) => {
  const [batchVoiceRunning, setBatchVoiceRunning] = useState(false);
  const [approvedAssets, setApprovedAssets] = useState<Record<string, boolean>>({});
  const [copiedAssets, setCopiedAssets] = useState<Record<string, boolean>>({});

  const handleBatchVoice = () => {
    setBatchVoiceRunning(true);
    onShowToast('Batch voice generation dispatched for 3 queued scripts');
    setTimeout(() => setBatchVoiceRunning(false), 3000);
  };

  const handleApproveAsset = (id: string, label: string) => {
    setApprovedAssets((prev) => ({ ...prev, [id]: true }));
    onShowToast(`${label} marked as Approved`);
  };

  const handleCopyTrack = (id: string, label: string) => {
    setCopiedAssets((prev) => ({ ...prev, [id]: true }));
    onShowToast(`${label} copied to assembly track`);
    setTimeout(() => {
      setCopiedAssets((prev) => ({ ...prev, [id]: false }));
    }, 2200);
  };

  return (
    <div className="flex flex-col w-full p-space-md lg:p-margin-desktop gap-space-lg">
      {/* Top Hero Glanceable Triage Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter-desktop w-full">
        {/* Module A: Pending Prompts */}
        <div className="relative bg-surface-container-lowest border-l-4 border-l-secondary-container border border-outline-variant rounded-lg p-space-lg flex flex-col justify-between shadow-[2px_2px_0px_#0c1f19]">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center justify-between">
              <span className="font-headline-sm text-headline-sm text-on-surface">
                Pending prompts
              </span>
              <span className="material-symbols-outlined text-secondary-container">
                pending_actions
              </span>
            </div>
            <div className="font-display-hero text-display-hero text-on-surface tracking-tight mt-space-xs">
              14
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant leading-snug">
              6 video generations, 5 audio stems, 3 image prompts waiting for fulfillment
            </p>
          </div>
          <div className="mt-space-lg pt-space-sm border-t border-outline-variant flex items-center justify-between">
            <button
              onClick={() => onNavigate('prompt-queue')}
              className="bg-secondary-container text-on-primary font-label-md text-label-md px-space-md py-space-xs rounded border border-on-surface shadow-[2px_2px_0px_#0c1f19] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              type="button"
            >
              Open prompt queue
            </button>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              Auto-dispatch ready
            </span>
          </div>
        </div>

        {/* Module B: In-progress episodes */}
        <div className="relative bg-surface-container-lowest border-l-4 border-l-primary-container border border-outline-variant rounded-lg p-space-lg flex flex-col justify-between shadow-[2px_2px_0px_#0c1f19]">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center justify-between">
              <span className="font-headline-sm text-headline-sm text-on-surface">
                In-progress episodes
              </span>
              <span className="material-symbols-outlined text-primary-container">
                motion_photos_on
              </span>
            </div>
            <div className="font-display-hero text-display-hero text-on-surface tracking-tight mt-space-xs">
              4
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant leading-snug">
              2 in assembly, 1 in voice direction, 1 in media pack
            </p>
          </div>
          <div className="mt-space-lg pt-space-sm border-t border-outline-variant flex items-center justify-between">
            <button
              onClick={() => onNavigate('episode-tracker')}
              className="bg-surface-container-lowest text-on-surface font-label-md text-label-md px-space-md py-space-xs rounded border border-on-surface shadow-[2px_2px_0px_#0c1f19] hover:bg-surface-container-low active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              type="button"
            >
              Inspect timeline
            </button>
            <span className="font-label-sm text-label-sm text-primary font-semibold">
              1 awaiting render check
            </span>
          </div>
        </div>

        {/* Module C: Next scheduled post */}
        <div className="relative bg-surface-container-lowest border-l-4 border-l-tertiary-container border border-outline-variant rounded-lg p-space-lg flex flex-col justify-between shadow-[2px_2px_0px_#0c1f19]">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center justify-between">
              <span className="font-headline-sm text-headline-sm text-on-surface">
                Next scheduled post
              </span>
              <span className="material-symbols-outlined text-tertiary-container">
                schedule_send
              </span>
            </div>
            <div className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-space-xs">
              Tomorrow, 18:00 UTC
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant leading-snug">
              Episode #142: God&apos;s Number blindfolded puzzle solve
            </p>
          </div>
          <div className="mt-space-lg pt-space-sm border-t border-outline-variant flex items-center justify-between">
            <button
              onClick={() => onNavigate('calendar')}
              className="bg-surface-container-lowest text-on-surface font-label-md text-label-md px-space-md py-space-xs rounded border border-on-surface shadow-[2px_2px_0px_#0c1f19] hover:bg-surface-container-low active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              type="button"
            >
              Review package
            </button>
            <span className="font-label-sm text-label-sm text-on-surface font-medium bg-surface-container-high px-space-xs py-0.5 rounded border border-outline-variant">
              Locked
            </span>
          </div>
        </div>
      </section>

      {/* Main Asymmetrical Pegboard Modules */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop w-full items-start">
        {/* Left Module (60%): Active Workbench */}
        <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant rounded-lg p-space-lg flex flex-col gap-space-md">
          <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface">
                Active workbench
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                Live tracking for current in-flight cube solves
              </p>
            </div>
            <div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1 rounded border border-outline-variant">
              <span className="w-2 h-2 rounded-full bg-primary-container inline-block"></span>
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                4 active builds
              </span>
            </div>
          </div>

          {/* Episode Workbench Rows */}
          <div className="flex flex-col gap-space-md">
            {/* Episode Item 1 */}
            <div className="bg-surface border-l-4 border-l-secondary-container border border-outline-variant rounded p-space-md flex flex-col gap-space-sm">
              <div className="flex flex-wrap items-center justify-between gap-space-xs">
                <div className="flex items-center gap-space-sm">
                  <span className="font-headline-sm text-headline-sm text-on-surface">
                    #143: Center slice permutation trick
                  </span>
                  <span className="font-label-sm text-label-sm bg-secondary-container text-on-primary px-space-xs py-0.5 rounded font-semibold">
                    Media pack block
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Target: Friday
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-label-sm font-label-sm">
                  <span className="text-on-surface font-medium">Prompt checklist progress</span>
                  <span className="text-on-surface font-bold">7 of 9 fulfilled (78%)</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded h-2 overflow-hidden border border-outline-variant">
                  <div className="bg-secondary-container h-full rounded" style={{ width: '78%' }}></div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-space-xs border-t border-outline-variant text-body-sm font-body-sm">
                <div className="flex items-center gap-space-xs text-secondary">
                  <span className="material-symbols-outlined text-[16px]">warning</span>
                  <span>Needs macro 4K hand-cam insert clip</span>
                </div>
                <button
                  onClick={() => onNavigate('prompt-queue')}
                  className="font-label-sm text-label-sm text-on-surface bg-surface-container-lowest px-space-sm py-1 rounded border border-outline-variant hover:bg-surface-container transition-colors"
                  type="button"
                >
                  Fulfill prompt
                </button>
              </div>
            </div>

            {/* Episode Item 2 */}
            <div className="bg-surface border-l-4 border-l-primary-container border border-outline-variant rounded p-space-md flex flex-col gap-space-sm">
              <div className="flex flex-wrap items-center justify-between gap-space-xs">
                <div className="flex items-center gap-space-sm">
                  <span className="font-headline-sm text-headline-sm text-on-surface">
                    #144: Why your F2L transitions are slow
                  </span>
                  <span className="font-label-sm text-label-sm bg-primary-container text-on-primary-container px-space-xs py-0.5 rounded font-semibold">
                    Assembly stage
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Target: Sunday
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-label-sm font-label-sm">
                  <span className="text-on-surface font-medium">Prompt checklist progress</span>
                  <span className="text-on-surface font-bold">11 of 12 fulfilled (91%)</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded h-2 overflow-hidden border border-outline-variant">
                  <div className="bg-primary-container h-full rounded" style={{ width: '91%' }}></div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-space-xs border-t border-outline-variant text-body-sm font-body-sm">
                <div className="flex items-center gap-space-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-[16px]">
                    check_circle
                  </span>
                  <span>Audio stems compiled, cutting rough pass</span>
                </div>
                <button
                  onClick={() => onNavigate('episode-tracker')}
                  className="font-label-sm text-label-sm text-on-surface bg-surface-container-lowest px-space-sm py-1 rounded border border-outline-variant hover:bg-surface-container transition-colors"
                  type="button"
                >
                  Inspect timeline
                </button>
              </div>
            </div>

            {/* Episode Item 3 */}
            <div className="bg-surface border-l-4 border-l-tertiary-container border border-outline-variant rounded p-space-md flex flex-col gap-space-sm">
              <div className="flex flex-wrap items-center justify-between gap-space-xs">
                <div className="flex items-center gap-space-sm">
                  <span className="font-headline-sm text-headline-sm text-on-surface">
                    #145: Solving with oven mitts on
                  </span>
                  <span className="font-label-sm text-label-sm bg-tertiary-fixed text-on-tertiary-container px-space-xs py-0.5 rounded font-semibold">
                    Voice direction
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Target: Tuesday
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-label-sm font-label-sm">
                  <span className="text-on-surface font-medium">Prompt checklist progress</span>
                  <span className="text-on-surface font-bold">4 of 8 fulfilled (50%)</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded h-2 overflow-hidden border border-outline-variant">
                  <div className="bg-tertiary-container h-full rounded" style={{ width: '50%' }}></div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-space-xs border-t border-outline-variant text-body-sm font-body-sm">
                <div className="flex items-center gap-space-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px]">
                    record_voice_over
                  </span>
                  <span>Pending fast-paced comedic voice track</span>
                </div>
                <button
                  onClick={() => onShowToast('Synthesizing comedic voice stem for #145...')}
                  className="font-label-sm text-label-sm text-on-surface bg-surface-container-lowest px-space-sm py-1 rounded border border-outline-variant hover:bg-surface-container transition-colors"
                  type="button"
                >
                  Synthesize voice
                </button>
              </div>
            </div>

            {/* Episode Item 4 */}
            <div className="bg-surface border-l-4 border-l-primary-container border border-outline-variant rounded p-space-md flex flex-col gap-space-sm">
              <div className="flex flex-wrap items-center justify-between gap-space-xs">
                <div className="flex items-center gap-space-sm">
                  <span className="font-headline-sm text-headline-sm text-on-surface">
                    #146: Megaminx vs 3x3 speed test
                  </span>
                  <span className="font-label-sm text-label-sm bg-primary-container text-on-primary-container px-space-xs py-0.5 rounded font-semibold">
                    Assembly stage
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Target: Thursday
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-label-sm font-label-sm">
                  <span className="text-on-surface font-medium">Prompt checklist progress</span>
                  <span className="text-on-surface font-bold">6 of 10 fulfilled (60%)</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded h-2 overflow-hidden border border-outline-variant">
                  <div className="bg-primary-container h-full rounded" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-space-xs border-t border-outline-variant text-body-sm font-body-sm">
                <div className="flex items-center gap-space-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px]">animation</span>
                  <span>Split comparison overlay rendered</span>
                </div>
                <button
                  onClick={() => onNavigate('script-viewer')}
                  className="font-label-sm text-label-sm text-on-surface bg-surface-container-lowest px-space-sm py-1 rounded border border-outline-variant hover:bg-surface-container transition-colors"
                  type="button"
                >
                  Open editor
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Module (40%): Weekly Rhythm & Fast Automation Workbench */}
        <div className="lg:col-span-5 flex flex-col gap-space-lg">
          {/* Weekly Release Rhythm Module */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-space-lg flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-md text-headline-md text-on-surface">
                Weekly release rhythm
              </h2>
              <span className="font-label-md text-label-md font-semibold text-primary">
                Week 14
              </span>
            </div>
            <div className="bg-surface p-space-md border border-outline-variant rounded flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Current cadence
                </span>
                <div className="flex items-baseline gap-space-xs mt-0.5">
                  <span className="font-headline-lg text-headline-lg text-on-surface">4</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface-variant">
                    / 5 shorts
                  </span>
                </div>
              </div>
              {/* Inline Sparkline / Pace Indicator SVG */}
              <div className="w-28 h-12 flex items-end gap-1.5 px-2 py-1 bg-surface-container-lowest border border-outline-variant rounded">
                <div className="w-3 bg-primary-container h-6 rounded-t" title="Mon: Released"></div>
                <div className="w-3 bg-primary-container h-10 rounded-t" title="Tue: Released"></div>
                <div className="w-3 bg-primary-container h-8 rounded-t" title="Wed: Released"></div>
                <div className="w-3 bg-primary-container h-9 rounded-t" title="Thu: Released"></div>
                <div
                  className="w-3 bg-surface-container-highest border border-dashed border-outline h-7 rounded-t"
                  title="Fri: Planned"
                ></div>
                <div className="w-3 bg-surface-container-low h-3 rounded-t" title="Sat"></div>
                <div className="w-3 bg-surface-container-low h-3 rounded-t" title="Sun"></div>
              </div>
            </div>
            {/* Metric Bars */}
            <div className="space-y-space-sm pt-space-xs text-body-sm font-body-sm">
              <div className="flex justify-between items-center text-label-sm font-label-sm">
                <span className="text-on-surface">Target pace reach</span>
                <span className="font-bold text-on-surface">80% completed</span>
              </div>
              <div className="w-full bg-surface-container-high h-2 rounded overflow-hidden border border-outline-variant">
                <div className="bg-primary-container h-full rounded" style={{ width: '80%' }}></div>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                1 short remains to satisfy the weekly YouTube algorithmic continuity threshold.
                Scheduled release will lock this target.
              </p>
            </div>
          </div>

          {/* Batch Voice Generation Run Quick Action Box */}
          <div className="bg-surface-container-lowest border-l-4 border-l-secondary-container border border-outline-variant rounded-lg p-space-lg flex flex-col gap-space-md shadow-[2px_2px_0px_#0c1f19]">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-on-surface">
                  Batch voice generation run
                </span>
                <span className="font-body-md text-body-md text-on-surface-variant mt-1">
                  Direct pipeline pass for 3 queued scripts
                </span>
              </div>
              <span className="material-symbols-outlined text-secondary-container text-2xl">
                graphic_eq
              </span>
            </div>
            <div className="bg-surface p-space-sm border border-outline-variant rounded flex flex-col gap-space-xs text-body-sm font-body-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium text-on-surface">Selected profile:</span>
                <span className="font-bold text-on-surface">
                  Hyper-clear commentator (1.15x pace)
                </span>
              </div>
              <div className="flex items-center justify-between text-on-surface-variant">
                <span>Stems queued:</span>
                <span>6 distinct solves</span>
              </div>
              <div className="flex items-center justify-between text-on-surface-variant">
                <span>Estimated render time:</span>
                <span>42 seconds</span>
              </div>
            </div>
            <button
              onClick={handleBatchVoice}
              className="w-full bg-secondary-container text-on-primary font-label-md text-label-md py-space-sm px-space-md rounded border border-on-surface shadow-[2px_2px_0px_#0c1f19] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-1.5 font-bold"
              type="button"
            >
              {batchVoiceRunning ? (
                <>
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Batch audio generation queued</span>
                </>
              ) : (
                <span>Start batch audio generation</span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Bottom Module: Recent Generation Outputs */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-space-lg flex flex-col gap-space-md w-full">
        <div className="flex flex-wrap items-center justify-between pb-space-sm border-b border-outline-variant gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <h2 className="font-headline-md text-headline-md text-on-surface">
              Recent generation outputs
            </h2>
            <span className="font-label-sm text-label-sm bg-surface-container-high text-on-surface px-space-xs py-0.5 rounded border border-outline-variant">
              Latest 4 assets
            </span>
          </div>
          <div className="flex items-center gap-space-sm">
            <button
              onClick={() => onShowToast('Filtering recent outputs by media type')}
              className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-lowest border border-outline-variant px-space-sm py-1 rounded hover:text-on-surface hover:bg-surface-container transition-colors"
              type="button"
            >
              Filter by type
            </button>
            <button
              onClick={() => onNavigate('history-and-library')}
              className="font-label-sm text-label-sm text-on-surface bg-surface-container-low border border-outline-variant px-space-sm py-1 rounded font-semibold hover:bg-surface-container transition-colors"
              type="button"
            >
              View full library
            </button>
          </div>
        </div>

        {/* 4 Asset Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop">
          {/* Asset 1 */}
          <div className="bg-surface border border-outline-variant rounded flex flex-col overflow-hidden">
            <div className="relative w-full aspect-[9/16] bg-surface-container-high border-b border-outline-variant overflow-hidden group">
              <img
                alt="#143 Solve sim"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgYNHNAegHhcz3zXo59JOz8BRfIu8YmAUDojxb1b6awf48poGhfHvaZuB81RxpIS9Qi_9YeJ2PBY1bq1YAxn1I7syvqz7mI3k3v8cXAewur3duqjSjNl3Scq2wYiN0hEbBsGy64l_SBrmUG70cyZFzF5mz2Vhvg6TClghZBcxDTad3XmnYV1VY_7teCkfg4xCNZ1d9oKHj5vvtU5sQ-2xZRAZ24tOc8S-wk28poPY"
              />
              <div className="absolute top-space-xs left-space-xs bg-surface-container-lowest px-space-xs py-0.5 rounded border border-outline-variant text-[11px] font-label-sm text-on-surface font-bold">
                0:14 / Key solve
              </div>
              <div className="absolute bottom-space-xs right-space-xs bg-surface-container-lowest px-space-xs py-0.5 rounded border border-outline-variant text-[11px] font-label-sm text-secondary-container font-bold">
                9:16 vertical
              </div>
            </div>
            <div className="p-space-sm flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-headline-sm text-on-surface truncate">
                  #143 Solve sim
                </span>
                <span
                  className={
                    approvedAssets['a1']
                      ? 'font-label-sm text-label-sm bg-primary-fixed text-on-primary-fixed-variant px-1 rounded font-medium'
                      : 'font-label-sm text-label-sm bg-tertiary-fixed text-on-tertiary-container px-1 rounded font-medium'
                  }
                >
                  {approvedAssets['a1'] ? 'Approved' : 'Pending review'}
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Step 4 OLL variant frame render
              </span>
              <div className="flex items-center gap-space-xs pt-space-xs mt-space-xs border-t border-outline-variant">
                <button
                  onClick={() => handleApproveAsset('a1', '#143 Solve sim')}
                  className="flex-1 bg-primary-container text-on-primary-container font-label-sm text-label-sm py-1 rounded border border-on-surface shadow-[1px_1px_0px_#0c1f19] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all font-semibold"
                  type="button"
                >
                  {approvedAssets['a1'] ? 'Approved ✓' : 'Approve'}
                </button>
                <button
                  onClick={() => onShowToast('Queued rerun for #143 Solve sim')}
                  className="px-space-xs py-1 bg-surface-container-lowest text-on-surface border border-outline-variant rounded font-label-sm text-label-sm hover:bg-surface-container"
                  type="button"
                >
                  Rerun
                </button>
              </div>
            </div>
          </div>

          {/* Asset 2 */}
          <div className="bg-surface border border-outline-variant rounded flex flex-col overflow-hidden">
            <div className="relative w-full aspect-[9/16] bg-surface-container-high border-b border-outline-variant overflow-hidden">
              <img
                alt="#144 First 3-sec hook"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAb_Utzi2GTNlrUQh-oPket21CzumpDFclw7KvsQOl_6gLa_n7zI3neZJ9SbZgscHqV4M4Ud6yXvoQi0BadpWBdGBoqJobCom2sgaRUJNQmhi5Cboq1bR6z78F9RDRG2pgceEGCU-_RF3cFIRcOIbykl09X_KtMDVEJKcauFDvD7K3DRpGHRLZTdlN8BIjVaPSE3-qyxKsWUfWSNFWw72IkrRyQEl_rkuGO_RtOe50"
              />
              <div className="absolute top-space-xs left-space-xs bg-surface-container-lowest px-space-xs py-0.5 rounded border border-outline-variant text-[11px] font-label-sm text-on-surface font-bold">
                Hook card
              </div>
              <div className="absolute bottom-space-xs right-space-xs bg-surface-container-lowest px-space-xs py-0.5 rounded border border-outline-variant text-[11px] font-label-sm text-primary font-bold">
                Cover asset
              </div>
            </div>
            <div className="p-space-sm flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-headline-sm text-on-surface truncate">
                  #144 First 3-sec hook
                </span>
                <span className="font-label-sm text-label-sm bg-primary-fixed text-on-primary-fixed-variant px-1 rounded font-medium">
                  Approved
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Exploded piece animation title card
              </span>
              <div className="flex items-center gap-space-xs pt-space-xs mt-space-xs border-t border-outline-variant">
                <button
                  onClick={() => handleCopyTrack('a2', '#144 First 3-sec hook')}
                  className="w-full bg-surface-container-lowest text-on-surface font-label-sm text-label-sm py-1 rounded border border-outline-variant hover:bg-surface-container transition-colors font-medium"
                  type="button"
                >
                  {copiedAssets['a2'] ? 'Copied to track ✓' : 'Copy to assembly track'}
                </button>
              </div>
            </div>
          </div>

          {/* Asset 3 */}
          <div className="bg-surface border border-outline-variant rounded flex flex-col overflow-hidden">
            <div className="relative w-full aspect-[9/16] bg-surface-container-high border-b border-outline-variant overflow-hidden">
              <img
                alt="#145 Core tension b-roll"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC29wi_Dp-5B1rUD3BhKLmT9XYdfPRPfvdJHnEmS3WEQrV9XYfNVShTCQCJADz9aJlERxs2XwvcYxUEVfsB5gsPnqnI8Gk_RqajaIlBnwdpTWy73kv6FacxkCHQETkoEoVZ1FuSOKwUVSdhJNsbId8Skok5CyUOiqXWgQUlQAyatfEIkrH-vZzqzdi3YmTsKgpSUC_3yP8RX1ZLLuonanNLWup1r7c3v_DwvI_WIlo"
              />
              <div className="absolute top-space-xs left-space-xs bg-surface-container-lowest px-space-xs py-0.5 rounded border border-outline-variant text-[11px] font-label-sm text-on-surface font-bold">
                0:22 / B-roll
              </div>
              <div className="absolute bottom-space-xs right-space-xs bg-surface-container-lowest px-space-xs py-0.5 rounded border border-outline-variant text-[11px] font-label-sm text-secondary-container font-bold">
                9:16 vertical
              </div>
            </div>
            <div className="p-space-sm flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-headline-sm text-on-surface truncate">
                  #145 Core tension b-roll
                </span>
                <span
                  className={
                    approvedAssets['a3']
                      ? 'font-label-sm text-label-sm bg-primary-fixed text-on-primary-fixed-variant px-1 rounded font-medium'
                      : 'font-label-sm text-label-sm bg-tertiary-fixed text-on-tertiary-container px-1 rounded font-medium'
                  }
                >
                  {approvedAssets['a3'] ? 'Approved' : 'Pending review'}
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Macro core rotation under tension
              </span>
              <div className="flex items-center gap-space-xs pt-space-xs mt-space-xs border-t border-outline-variant">
                <button
                  onClick={() => handleApproveAsset('a3', '#145 Core tension b-roll')}
                  className="flex-1 bg-primary-container text-on-primary-container font-label-sm text-label-sm py-1 rounded border border-on-surface shadow-[1px_1px_0px_#0c1f19] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all font-semibold"
                  type="button"
                >
                  {approvedAssets['a3'] ? 'Approved ✓' : 'Approve'}
                </button>
                <button
                  onClick={() => onShowToast('Queued rerun for #145 Core tension b-roll')}
                  className="px-space-xs py-1 bg-surface-container-lowest text-on-surface border border-outline-variant rounded font-label-sm text-label-sm hover:bg-surface-container"
                  type="button"
                >
                  Rerun
                </button>
              </div>
            </div>
          </div>

          {/* Asset 4 */}
          <div className="bg-surface border border-outline-variant rounded flex flex-col overflow-hidden">
            <div className="relative w-full aspect-[9/16] bg-surface-container-high border-b border-outline-variant overflow-hidden">
              <img
                alt="#146 Algorithm notation"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUxAbW104DzID2vQP5Ef31weo4i23HirGw308bBYlc4V7wwxAWOBKe13mGPLPkQZ18YkBZwx6-YWDzCRxf2dpw9sTKMjwriD-2o14Xg-TrSXZ3nc8NvoBVo6scQwt0VzY3HdooBvbR7l7wL82esdsJEGb8YShYftCQubfQSraqvEuUZfCUL5mrPLBRMRt-MgG1Z0D7qhTdx4S2UyK5OdtvJmAvvX-vc1vsVBMINNc"
              />
              <div className="absolute top-space-xs left-space-xs bg-surface-container-lowest px-space-xs py-0.5 rounded border border-outline-variant text-[11px] font-label-sm text-on-surface font-bold">
                0:38 / Notation
              </div>
              <div className="absolute bottom-space-xs right-space-xs bg-surface-container-lowest px-space-xs py-0.5 rounded border border-outline-variant text-[11px] font-label-sm text-primary font-bold">
                Graphic overlay
              </div>
            </div>
            <div className="p-space-sm flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-headline-sm text-on-surface truncate">
                  #146 Algorithm notation
                </span>
                <span className="font-label-sm text-label-sm bg-primary-fixed text-on-primary-fixed-variant px-1 rounded font-medium">
                  Approved
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                T-perm algorithmic notation sequence
              </span>
              <div className="flex items-center gap-space-xs pt-space-xs mt-space-xs border-t border-outline-variant">
                <button
                  onClick={() => handleCopyTrack('a4', '#146 Algorithm notation')}
                  className="w-full bg-surface-container-lowest text-on-surface font-label-sm text-label-sm py-1 rounded border border-outline-variant hover:bg-surface-container transition-colors font-medium"
                  type="button"
                >
                  {copiedAssets['a4'] ? 'Copied to track ✓' : 'Copy to assembly track'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
