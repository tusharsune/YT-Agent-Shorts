import React, { useState } from 'react';

interface ScriptViewerScreenProps {
  onShowToast: (msg: string) => void;
}

interface ScriptListItem {
  id: string;
  title: string;
  score: string;
  scoreColor: string;
  episode: string;
  target: string;
  statusLabel: string;
  statusClass: string;
  icon: string;
  iconColor: string;
  barColor: string;
  category: 'locked' | 'draft' | 'revise';
}

const SCRIPT_LIST_ITEMS: ScriptListItem[] = [
  {
    id: 's1',
    title: "God's Number Blindfolded",
    score: '94/100',
    scoreColor: 'text-primary',
    episode: 'Episode 142',
    target: '48s target',
    statusLabel: 'Locked for recording',
    statusClass: 'bg-surface border border-outline-variant rounded text-on-primary-container',
    icon: 'check_circle',
    iconColor: 'text-primary-container',
    barColor: 'bg-primary-container',
    category: 'locked',
  },
  {
    id: 's2',
    title: 'The Impossible 1x1 Parody',
    score: '88/100',
    scoreColor: 'text-tertiary',
    episode: 'Episode 143',
    target: '32s target',
    statusLabel: 'Script complete',
    statusClass:
      'bg-surface-container-highest border border-outline-variant rounded text-on-tertiary-container',
    icon: 'edit_note',
    iconColor: 'text-outline',
    barColor: 'bg-tertiary-fixed-dim',
    category: 'draft',
  },
  {
    id: 's3',
    title: 'World Record Megaminx Fails',
    score: '62/100',
    scoreColor: 'text-secondary',
    episode: 'Episode 141',
    target: '54s target',
    statusLabel: 'Hook rewrite needed',
    statusClass:
      'bg-error-container border border-outline-variant rounded text-on-secondary-container',
    icon: 'warning',
    iconColor: 'text-secondary',
    barColor: 'bg-secondary-container',
    category: 'revise',
  },
  {
    id: 's4',
    title: 'Pyraminx 1-Look Solves',
    score: '91/100',
    scoreColor: 'text-primary',
    episode: 'Episode 140',
    target: '42s target',
    statusLabel: 'Produced',
    statusClass: 'bg-surface border border-outline-variant rounded text-on-surface-variant',
    icon: 'movie',
    iconColor: 'text-outline',
    barColor: 'bg-primary-container',
    category: 'locked',
  },
  {
    id: 's5',
    title: 'Square-1 Shape Shifting Explained',
    score: '79/100',
    scoreColor: 'text-tertiary',
    episode: 'Episode 144',
    target: '50s target',
    statusLabel: 'Draft 2',
    statusClass:
      'bg-surface-container-highest border border-outline-variant rounded text-on-tertiary-container',
    icon: 'pending',
    iconColor: 'text-outline',
    barColor: 'bg-tertiary-fixed-dim',
    category: 'draft',
  },
];

export const ScriptViewerScreen: React.FC<ScriptViewerScreenProps> = ({ onShowToast }) => {
  const [selectedScriptId, setSelectedScriptId] = useState('s1');
  const [filterTab, setFilterTab] = useState<'all' | 'locked' | 'draft' | 'revise'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedRevisions, setSavedRevisions] = useState(false);

  const visibleScripts = SCRIPT_LIST_ITEMS.filter((item) => {
    const matchesTab = filterTab === 'all' || item.category === filterTab;
    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.episode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const activeScript =
    SCRIPT_LIST_ITEMS.find((s) => s.id === selectedScriptId) || SCRIPT_LIST_ITEMS[0];

  const handleSaveRevisions = () => {
    setSavedRevisions(true);
    onShowToast(`Saved script revisions for ${activeScript.title}`);
    setTimeout(() => setSavedRevisions(false), 2200);
  };

  return (
    <div className="flex flex-col w-full p-space-md lg:p-space-lg gap-space-md">
      {/* Top Context Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm pb-space-sm border-b border-outline-variant">
        <div className="flex flex-col">
          <span className="font-headline-md text-headline-md text-on-surface">
            Shorts Script Studio
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Review hooks, analyze retention scoring, and dispatch verified scripts to voiceover
            production
          </span>
        </div>
        <div className="flex items-center gap-space-sm">
          <div className="flex items-center gap-space-xs px-space-sm py-space-xs bg-surface-container-lowest border border-outline-variant rounded">
            <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
            <span className="font-label-sm text-label-sm text-on-surface">
              Queue target: 60s max Shorts
            </span>
          </div>
          <div className="flex items-center gap-space-xs px-space-sm py-space-xs bg-surface-container-lowest border border-outline-variant rounded">
            <span className="material-symbols-outlined text-secondary-container text-[18px]">
              bolt
            </span>
            <span className="font-label-sm text-label-sm text-on-surface">
              Pacing model: CubeLab v3.4
            </span>
          </div>
        </div>
      </div>

      {/* Two-Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-start">
        {/* Left Pane: Script Index */}
        <div className="lg:col-span-4 xl:col-span-4 flex flex-col gap-space-sm bg-surface-container-lowest p-space-md border border-outline-variant rounded-lg">
          {/* Search & Filters */}
          <div className="flex flex-col gap-space-xs">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">
                search
              </span>
              <input
                aria-label="Search scripts by hook or topic"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-container-lowest pl-9 pr-3 py-space-xs text-body-sm text-on-surface placeholder:text-on-surface-variant border border-outline rounded focus:border-primary-container focus:outline-none transition-colors"
                placeholder="Search scripts by hook or topic..."
                type="text"
              />
            </div>
            <div className="flex items-center gap-space-xs pt-space-xs overflow-x-auto">
              {(
                [
                  { id: 'all', label: 'All scripts' },
                  { id: 'locked', label: 'Locked' },
                  { id: 'draft', label: 'In draft' },
                  { id: 'revise', label: 'Revise hook' },
                ] as const
              ).map((tab) => {
                const active = filterTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setFilterTab(tab.id)}
                    className={
                      active
                        ? 'px-space-sm py-0.5 bg-surface-variant border border-on-surface rounded font-label-sm text-label-sm text-on-surface'
                        : 'px-space-sm py-0.5 bg-surface-container-lowest border border-outline-variant rounded font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface'
                    }
                    type="button"
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Script List */}
          <div className="flex flex-col gap-space-xs mt-space-xs" id="script-list">
            {visibleScripts.map((script) => {
              const isSelected = script.id === selectedScriptId;
              return (
                <button
                  key={script.id}
                  onClick={() => setSelectedScriptId(script.id)}
                  className={
                    isSelected
                      ? 'relative text-left w-full bg-surface-container-low border border-on-surface rounded p-space-sm cursor-pointer shadow-[2px_2px_0px_#0c1f19] transition-all'
                      : 'relative text-left w-full bg-surface-container-lowest hover:bg-surface-container-low border border-outline-variant rounded p-space-sm cursor-pointer transition-colors'
                  }
                  type="button"
                >
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1.5 ${script.barColor} rounded-l`}
                  ></div>
                  <div className="pl-2 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-headline-sm text-headline-sm text-on-surface">
                        {script.title}
                      </span>
                      <span className={`font-label-sm text-label-sm ${script.scoreColor} font-bold`}>
                        {script.score}
                      </span>
                    </div>
                    <div className="flex items-center gap-space-xs text-body-sm text-on-surface-variant">
                      <span>{script.episode}</span>
                      <span>•</span>
                      <span>{script.target}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span
                        className={`font-label-sm text-label-sm px-1.5 py-0.5 ${script.statusClass} font-semibold`}
                      >
                        {script.statusLabel}
                      </span>
                      <span
                        className={`material-symbols-outlined ${script.iconColor} text-[16px]`}
                      >
                        {script.icon}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Add New Script Button */}
          <button
            onClick={() => onShowToast('Initialized blank 60s Shorts script template')}
            className="mt-space-sm w-full bg-secondary-container text-on-primary font-label-md text-label-md py-space-xs px-space-md rounded border border-on-surface shadow-[2px_2px_0px_#0c1f19] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-space-xs"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>New script draft</span>
          </button>
        </div>

        {/* Right Pane: Active Script Workspace */}
        <div className="lg:col-span-8 xl:col-span-8 flex flex-col gap-space-md">
          {/* Script Summary Header & Metadata Strip */}
          <div className="bg-surface-container-lowest p-space-md border border-outline-variant rounded-lg flex flex-col gap-space-md">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-space-sm pb-space-sm border-b border-outline-variant">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-space-xs">
                  <span className="font-label-sm text-label-sm px-2 py-0.5 bg-surface border border-primary text-primary font-semibold rounded">
                    {activeScript.episode}
                  </span>
                  <span className="font-label-sm text-label-sm px-2 py-0.5 bg-surface-container-highest border border-outline-variant text-on-surface-variant rounded">
                    Algorithm deep dive
                  </span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface mt-1">
                  {activeScript.title}
                </h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Focus hook: Provoking mathematical curiosity through impossible visual
                  constraints.
                </p>
              </div>
              {/* Quick Metrics Grid */}
              <div className="flex items-center gap-space-sm bg-surface-container-low p-space-xs px-space-sm border border-outline-variant rounded">
                <div className="flex flex-col text-center px-space-xs">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Estimated read
                  </span>
                  <span className="font-headline-sm text-headline-sm text-on-surface">
                    {activeScript.target.replace(' target', '')}
                  </span>
                </div>
                <div className="h-8 w-px bg-outline-variant"></div>
                <div className="flex flex-col text-center px-space-xs">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Word count
                  </span>
                  <span className="font-headline-sm text-headline-sm text-on-surface">142</span>
                </div>
                <div className="h-8 w-px bg-outline-variant"></div>
                <div className="flex flex-col text-center px-space-xs">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Target cadence
                  </span>
                  <span className="font-headline-sm text-headline-sm text-on-surface">
                    178 wpm
                  </span>
                </div>
              </div>
            </div>

            {/* Hook Score Banner Card with Teal Left Edge */}
            <div className="relative bg-surface p-space-sm border border-outline-variant rounded">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-container rounded-l"></div>
              <div className="pl-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-space-sm">
                <div className="flex items-center gap-space-md">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      Overall Hook Score
                    </span>
                    <span className="font-headline-lg text-headline-lg text-primary font-extrabold leading-none mt-0.5">
                      {activeScript.score.replace('/', ' / ')}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-space-xs">
                    <div className="px-space-xs py-0.5 bg-surface-container-lowest border border-outline-variant rounded flex items-center gap-1">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        Pacing:
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface font-bold">
                        96/100
                      </span>
                    </div>
                    <div className="px-space-xs py-0.5 bg-surface-container-lowest border border-outline-variant rounded flex items-center gap-1">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        Curiosity gap:
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface font-bold">
                        92/100
                      </span>
                    </div>
                    <div className="px-space-xs py-0.5 bg-surface-container-lowest border border-outline-variant rounded flex items-center gap-1">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        Visual cue density:
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface font-bold">
                        95/100
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-space-xs max-w-sm">
                  <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">
                    insights
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface">
                    Strong first 3 seconds; question structure directly triggers YouTube Shorts
                    replay loop.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Script Blocks Timeline Container */}
          <div className="flex flex-col gap-space-sm">
            {/* Visualizer Bar: Beat breakdown */}
            <div className="flex items-center justify-between px-space-xs">
              <span className="font-headline-sm text-headline-sm text-on-surface">
                Timecoded Scene Flow
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                4 segments • Total 48 seconds
              </span>
            </div>

            {/* Scene 01: Hook */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-space-md flex flex-col gap-space-xs transition-shadow hover:border-on-surface">
              <div className="flex items-center justify-between border-b border-outline-variant pb-space-xs">
                <div className="flex items-center gap-space-xs">
                  <span className="px-2 py-0.5 bg-surface-container-high border border-outline-variant rounded font-label-sm text-label-sm text-on-surface font-bold">
                    Scene 01
                  </span>
                  <span className="font-label-sm text-label-sm text-primary font-semibold">
                    0:00 - 0:04
                  </span>
                  <span className="font-label-sm text-label-sm px-2 py-0.2 bg-secondary-fixed border border-secondary-container text-on-secondary-container rounded">
                    Primary Hook
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  16 words
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md pt-space-xs">
                <div className="md:col-span-8 flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Voiceover Script
                  </span>
                  <p className="font-body-lg text-body-lg text-on-surface bg-surface-container-low p-space-sm border border-outline-variant rounded leading-relaxed">
                    &quot;Can a human solve a Rubik&apos;s cube in fewer moves than God?
                    Mathematically, the answer is twenty.&quot;
                  </p>
                </div>
                <div className="md:col-span-4 flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Visual &amp; Camera Direction
                  </span>
                  <div className="bg-surface p-space-sm border border-outline-variant rounded flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-primary">
                      <span className="material-symbols-outlined text-[16px]">videocam</span>
                      <span className="font-label-sm text-label-sm font-semibold">
                        Rapid macro zoom
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      GAN 12 MagLev spinning in mid-air under high-contrast workshop rim lighting.
                      Text overlay hits on &apos;twenty&apos;.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Scene 02: Exposition */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-space-md flex flex-col gap-space-xs transition-shadow hover:border-on-surface">
              <div className="flex items-center justify-between border-b border-outline-variant pb-space-xs">
                <div className="flex items-center gap-space-xs">
                  <span className="px-2 py-0.5 bg-surface-container-high border border-outline-variant rounded font-label-sm text-label-sm text-on-surface font-bold">
                    Scene 02
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                    0:04 - 0:15
                  </span>
                  <span className="font-label-sm text-label-sm px-2 py-0.2 bg-surface-variant border border-outline-variant text-on-surface rounded">
                    Exposition
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  34 words
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md pt-space-xs">
                <div className="md:col-span-8 flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Voiceover Script
                  </span>
                  <p className="font-body-lg text-body-lg text-on-surface bg-surface-container-low p-space-sm border border-outline-variant rounded leading-relaxed">
                    &quot;In speedcubing, God&apos;s Number is the maximum number of turns needed
                    to solve ANY scrambled position. But what happens when you attempt it with a
                    blindfold on?&quot;
                  </p>
                </div>
                <div className="md:col-span-4 flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Visual &amp; Camera Direction
                  </span>
                  <div className="bg-surface p-space-sm border border-outline-variant rounded flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-on-surface">
                      <span className="material-symbols-outlined text-[16px]">
                        visibility_off
                      </span>
                      <span className="font-label-sm text-label-sm font-semibold">
                        Blindfold drop
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Snap cut to black eye mask sliding down. Kinetic 3D cube wireframe graph
                      overlay in corner.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Scene 03: Challenge & Climax */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-space-md flex flex-col gap-space-xs transition-shadow hover:border-on-surface">
              <div className="flex items-center justify-between border-b border-outline-variant pb-space-xs">
                <div className="flex items-center gap-space-xs">
                  <span className="px-2 py-0.5 bg-surface-container-high border border-outline-variant rounded font-label-sm text-label-sm text-on-surface font-bold">
                    Scene 03
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                    0:15 - 0:32
                  </span>
                  <span className="font-label-sm text-label-sm px-2 py-0.2 bg-tertiary-fixed border border-tertiary-container text-on-tertiary-container rounded">
                    Challenge &amp; Climax
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  58 words
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md pt-space-xs">
                <div className="md:col-span-8 flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Voiceover Script
                  </span>
                  <p className="font-body-lg text-body-lg text-on-surface bg-surface-container-low p-space-sm border border-outline-variant rounded leading-relaxed">
                    &quot;You don&apos;t just solve it. You memorize all fifty-four stickers in
                    eight seconds using spatial memory palace loci. One missed orientation cycle
                    turns your algorithm to dust. Here comes the parity fix.&quot;
                  </p>
                </div>
                <div className="md:col-span-4 flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Visual &amp; Camera Direction
                  </span>
                  <div className="bg-surface p-space-sm border border-outline-variant rounded flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-on-surface">
                      <span className="material-symbols-outlined text-[16px]">speed</span>
                      <span className="font-label-sm text-label-sm font-semibold">
                        Fast TPS tracking
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Overhead workbench angle. High speed 12 turns-per-second fingers, ticking
                      counter sound effect.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Scene 04: Payoff & Loop CTA */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-space-md flex flex-col gap-space-xs transition-shadow hover:border-on-surface">
              <div className="flex items-center justify-between border-b border-outline-variant pb-space-xs">
                <div className="flex items-center gap-space-xs">
                  <span className="px-2 py-0.5 bg-surface-container-high border border-outline-variant rounded font-label-sm text-label-sm text-on-surface font-bold">
                    Scene 04
                  </span>
                  <span className="font-label-sm text-label-sm text-primary font-semibold">
                    0:32 - 0:48
                  </span>
                  <span className="font-label-sm text-label-sm px-2 py-0.2 bg-primary-fixed border border-primary-container text-on-primary-container rounded">
                    Payoff &amp; Loop CTA
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  34 words
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md pt-space-xs">
                <div className="md:col-span-8 flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Voiceover Script
                  </span>
                  <p className="font-body-lg text-body-lg text-on-surface bg-surface-container-low p-space-sm border border-outline-variant rounded leading-relaxed">
                    &quot;Check the link in the comments for the full inspection breakdown, and
                    don&apos;t blink on the final layer. Because when twenty turns are up...
                    you&apos;ll understand why.&quot;
                  </p>
                </div>
                <div className="md:col-span-4 flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Visual &amp; Camera Direction
                  </span>
                  <div className="bg-surface p-space-sm border border-outline-variant rounded flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-primary">
                      <span className="material-symbols-outlined text-[16px]">repeat</span>
                      <span className="font-label-sm text-label-sm font-semibold">
                        Seamless loop lock
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Cube slams on timer mat, hands lift up, final phrase seamlessly transitions
                      back into Scene 01 opening audio.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="bg-surface-container-lowest p-space-md border border-outline-variant rounded-lg flex flex-col sm:flex-row items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-xs w-full sm:w-auto">
              <button
                onClick={() => onShowToast(`Copied full script for ${activeScript.title}`)}
                className="flex-1 sm:flex-none bg-surface-container-lowest hover:bg-surface-container-low text-on-surface font-label-md text-label-md px-space-md py-space-xs rounded border border-on-surface transition-colors flex items-center justify-center gap-1.5"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">content_copy</span>
                <span>Copy full script</span>
              </button>
              <button
                onClick={() =>
                  onShowToast(`Pushed ${activeScript.title} (4 segments) to ElevenLabs`)
                }
                className="flex-1 sm:flex-none bg-surface-container-lowest hover:bg-surface-container-low text-on-surface font-label-md text-label-md px-space-md py-space-xs rounded border border-on-surface transition-colors flex items-center justify-center gap-1.5"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">graphic_eq</span>
                <span>Push to ElevenLabs</span>
              </button>
            </div>
            <div className="flex items-center gap-space-sm w-full sm:w-auto justify-end">
              <span className="font-body-sm text-body-sm text-on-surface-variant hidden md:inline">
                {savedRevisions ? 'Saved just now' : 'Last autosaved 2m ago'}
              </span>
              <button
                onClick={handleSaveRevisions}
                className="w-full sm:w-auto bg-secondary-container text-on-primary font-label-md text-label-md px-space-lg py-space-xs rounded border border-on-surface shadow-[2px_2px_0px_#0c1f19] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-1.5"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {savedRevisions ? 'check' : 'save'}
                </span>
                <span>{savedRevisions ? 'Revisions saved' : 'Save revisions'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
