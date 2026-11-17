import React, { useState } from 'react';

interface PublishLogScreenProps {
  onShowToast: (msg: string) => void;
}

interface LedgerEntry {
  id: string;
  episode: string;
  title: string;
  videoId: string;
  duration: string;
  thumbnail: string;
  publishedDay: string;
  publishedSlot: string;
  turnaroundMain: string;
  turnaroundSub: string;
  views: string;
  retentionLabel: string;
  retentionPercent: number;
  isViral?: boolean;
  youtubeUrl: string;
  stateNote: string;
}

const LEDGER_ENTRIES: LedgerEntry[] = [
  {
    id: 'l1',
    episode: 'Episode #141',
    title: 'World Record Megaminx Fails',
    videoId: 'ID: sh_mgmx_141_final',
    duration: '0:54',
    thumbnail:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjqO7crwDu_pHb_Uxpp_i_QNNvAeAi2K8T_XJBpUoB0BFIPR6FHpjat8r4G2jjnCTcG7Z_NSflXzGo-g7ndCy1l5pL77ogHA7RQ_-Gz2eroIs_dKqTCHN7KmseWiAoOqNa5FuDFVqKO0q9da-PK0Ls4H3WS7GYUTcL6yPVXvMiDFLB3d7pbHJZHt7FOHn_lL8UrxLpPNQI2_Ib4OoJRA59EzC7i_Mw-EzoJ9dMIeE',
    publishedDay: 'Yesterday',
    publishedSlot: '18:00 UTC (Slot A)',
    turnaroundMain: 'Idea to live: 3.2 days',
    turnaroundSub: 'Prompt: 4h • Render: 12m',
    views: '42.8k views',
    retentionLabel: '88% retention',
    retentionPercent: 88,
    youtubeUrl: '#shorts-141',
    stateNote: 'First-frame hook validated',
  },
  {
    id: 'l2',
    episode: 'Episode #140',
    title: 'Pyraminx 1-Look Solves',
    videoId: 'ID: sh_pyrx_140_final',
    duration: '0:49',
    thumbnail:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDJePDtFqu1AQKaoakBPa6Nnu8M5flaNZlJ2IqyeRFgwUN5IkFRCJAaAi5g-W7BAyOADhF6byBaYC6MXwg93vIusrvr73FkYRewYbxiZKscjGNE8U44AZQzUPHdkXTj_rmaRlHjAnW4_9I80Z7f40WNqOFMBspjnqOIc1khb6NkeO3YY2yWovEQrZQnqZSa0TTCzOqCqtOvTroZRLeeUrQc0kyUfUxjDLz0bTwO5Dk',
    publishedDay: 'Oct 12',
    publishedSlot: '18:00 UTC (Slot A)',
    turnaroundMain: 'Idea to live: 2.8 days',
    turnaroundSub: 'Prompt: 2h • Render: 9m',
    views: '118.2k views',
    retentionLabel: '94% retention (Viral)',
    retentionPercent: 94,
    isViral: true,
    youtubeUrl: '#shorts-140',
    stateNote: 'Pushed to top algorithm shelf',
  },
  {
    id: 'l3',
    episode: 'Episode #139',
    title: 'Clock Puzzle Speed Secrets',
    videoId: 'ID: sh_clk_139_final',
    duration: '0:58',
    thumbnail:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAfsPWQvyShsZr1P73Sm3BquVFKqUQqJGHUZax-XZZr4mJYYmPC7yoFYtVWI48oPsJUwXib8tjiPF4DvnYpe2rQi7YfN8ejMG0YkgYZwIbdKPQMg1zvuEdRrEhYFjewRuzxUEbeaHDMwO5K65LjiAleQso3Sup8mOK4IhVPHkOju7NEngUMJxUJjn_rpr1wlKJq1eb4IU3kai3bP4Xdm7cmdFD574Vscs5c6hbFC24',
    publishedDay: 'Oct 10',
    publishedSlot: '18:00 UTC (Slot A)',
    turnaroundMain: 'Idea to live: 4.1 days',
    turnaroundSub: 'Prompt: 8h • Render: 16m',
    views: '28.4k views',
    retentionLabel: '79% retention',
    retentionPercent: 79,
    youtubeUrl: '#shorts-139',
    stateNote: 'Comment pinned with algorithm notes',
  },
  {
    id: 'l4',
    episode: 'Episode #138',
    title: 'Why GAN Cubes Cost $90',
    videoId: 'ID: sh_ganc_138_final',
    duration: '0:59',
    thumbnail:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCFsyt-K0Ydz5lNa1kT8xnGydMFUijEJVUhxGkhN1N3F2V4d76YipQPC7eNobX30lxH2xhxj2SqBKMAOnDVPM4QVfIhlLT9TKYwzyO8wsEQAHLtK5aVx1cGlsbWh0Rfgxwz9mOCst8Jm6y6mN0_Im-KaJ6P8ILvOGrtEbWHHXayg3T69QHScUO27E5m4vlk8CpEyCcn0d38QxrtOWAI-8y4_W8zwCcmu9DF3_d-D_A',
    publishedDay: 'Oct 07',
    publishedSlot: '18:00 UTC (Slot A)',
    turnaroundMain: 'Idea to live: 3.5 days',
    turnaroundSub: 'Prompt: 6h • Render: 14m',
    views: '89.1k views',
    retentionLabel: '85% retention',
    retentionPercent: 85,
    youtubeUrl: '#shorts-138',
    stateNote: 'Affiliate disclosure verified',
  },
  {
    id: 'l5',
    episode: 'Episode #137',
    title: 'Blindfold Memory Palace Hack',
    videoId: 'ID: sh_bld_137_final',
    duration: '0:57',
    thumbnail:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDl_3fAt1il3lchGsuNrlWBa9qkeCb62Y6H0P8zQBfygAdJXkesxmpuCafjkTqmI54CGTymYF2XCMR8gsR4_CYMidPxRMWf3UrCXT3tKtFSEo7OqOeSOeBQ99ODPMVgUttcckW0SKI3K9P_SQRRLj6WZzZejDviuHajvBinncoiOUYi9zlV8UCjRZoL7DtsqwU4JducZPQgx4NY5koVYSwNWtjKLVPttQvXsCWTNYc',
    publishedDay: 'Oct 05',
    publishedSlot: '18:00 UTC (Slot A)',
    turnaroundMain: 'Idea to live: 2.1 days',
    turnaroundSub: 'Prompt: 3h • Render: 8m',
    views: '61.5k views',
    retentionLabel: '82% retention',
    retentionPercent: 82,
    youtubeUrl: '#shorts-137',
    stateNote: 'Audio track rights cleared',
  },
];

export const PublishLogScreen: React.FC<PublishLogScreenProps> = ({ onShowToast }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [releaseFilter, setReleaseFilter] = useState('all');
  const [exported, setExported] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const visibleEntries = LEDGER_ENTRIES.filter((entry) => {
    const matchesSearch =
      !searchQuery.trim() ||
      `${entry.episode} ${entry.title} ${entry.videoId} ${entry.stateNote}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesRelease =
      releaseFilter === 'all' ||
      (releaseFilter === 'viral' && entry.retentionPercent >= 90) ||
      (releaseFilter === 'standard' && entry.retentionPercent < 90);
    return matchesSearch && matchesRelease;
  });

  const handleExport = () => {
    setExported(true);
    onShowToast('Published units ledger exported (CSV)');
    setTimeout(() => setExported(false), 2000);
  };

  return (
    <div className="flex flex-col w-full p-space-md lg:p-margin-desktop gap-space-lg">
      {/* Overview Metrics Bar */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        <div className="bg-surface-container-lowest p-space-md border border-outline-variant rounded relative overflow-hidden flex flex-col justify-between">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-container"></div>
          <div className="flex items-center justify-between">
            <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
              Production total
            </span>
            <span className="material-symbols-outlined text-outline text-[20px]">videocam</span>
          </div>
          <div className="mt-space-sm flex items-baseline gap-space-xs">
            <span className="font-metric-num text-metric-num text-on-surface">38</span>
            <span className="font-body-sm text-body-sm text-on-surface font-semibold">
              Shorts published
            </span>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant mt-space-xs">
            Cadence locked at 3 uploads weekly
          </span>
        </div>

        <div className="bg-surface-container-lowest p-space-md border border-outline-variant rounded relative overflow-hidden flex flex-col justify-between">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-container"></div>
          <div className="flex items-center justify-between">
            <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
              Slot reliability
            </span>
            <span className="material-symbols-outlined text-outline text-[20px]">
              check_circle
            </span>
          </div>
          <div className="mt-space-sm flex items-baseline gap-space-xs">
            <span className="font-metric-num text-metric-num text-on-surface">99.4%</span>
            <span className="font-body-sm text-body-sm text-on-surface font-semibold">
              on-time cadence
            </span>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant mt-space-xs">
            18:00 UTC target benchmark
          </span>
        </div>

        <div className="bg-surface-container-lowest p-space-md border border-outline-variant rounded relative overflow-hidden flex flex-col justify-between">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary-container"></div>
          <div className="flex items-center justify-between">
            <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
              Algorithmic stickiness
            </span>
            <span className="material-symbols-outlined text-outline text-[20px]">
              trending_up
            </span>
          </div>
          <div className="mt-space-sm flex items-baseline gap-space-xs">
            <span className="font-metric-num text-metric-num text-on-surface">74%</span>
            <span className="font-body-sm text-body-sm text-on-surface font-semibold">
              first-hour retention
            </span>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant mt-space-xs">
            +12% over niche channel baseline
          </span>
        </div>
      </section>

      {/* Filter Controls & Utility Toolbar */}
      <section className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md bg-surface-container-lowest p-space-md border border-outline-variant rounded">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm flex-1">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              aria-label="Search title, video ID, or tags"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-space-md py-space-xs bg-surface-container-lowest border border-outline-variant rounded text-on-surface font-body-sm text-body-sm placeholder:text-outline focus:outline-none focus:border-primary-container"
              id="search-input"
              placeholder="Search title, video ID, or tags..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-space-xs border border-outline-variant rounded">
            <span className="material-symbols-outlined text-outline text-[16px]">
              calendar_month
            </span>
            <select
              aria-label="Date range filter"
              className="bg-transparent font-label-md text-label-md text-on-surface border-none focus:outline-none cursor-pointer"
            >
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>All time ledger</option>
            </select>
          </div>
          <div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-space-xs border border-outline-variant rounded">
            <span className="material-symbols-outlined text-outline text-[16px]">tune</span>
            <select
              aria-label="Release velocity filter"
              value={releaseFilter}
              onChange={(e) => setReleaseFilter(e.target.value)}
              className="bg-transparent font-label-md text-label-md text-on-surface border-none focus:outline-none cursor-pointer"
            >
              <option value="all">All releases</option>
              <option value="viral">Viral velocity (&gt;90% retention)</option>
              <option value="standard">Standard pacing</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end gap-space-sm pt-space-sm lg:pt-0 border-t lg:border-t-0 border-outline-variant">
          <button
            onClick={handleExport}
            className="bg-surface-container-lowest hover:bg-surface-container-low text-on-surface font-label-md text-label-md px-space-md py-space-xs rounded border border-on-surface shadow-[2px_2px_0px_#0c1f19] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-space-xs"
            id="export-btn"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">
              {exported ? 'check' : 'download'}
            </span>
            <span>{exported ? 'Ledger downloaded' : 'Export publish ledger'}</span>
          </button>
        </div>
      </section>

      {/* Main Ledger Table Container */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded overflow-hidden">
        <div className="p-space-md border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <span className="font-headline-sm text-headline-sm text-on-surface">
              Live units ledger
            </span>
            <span className="font-label-sm text-label-sm px-2 py-0.5 bg-surface-container-low text-on-surface border border-outline-variant rounded">
              Verified broadcast
            </span>
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Showing latest {visibleEntries.length} entries
          </span>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[980px]">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant text-on-surface font-label-md text-label-md">
                <th className="py-space-sm px-space-md w-[320px]">Episode &amp; Title</th>
                <th className="py-space-sm px-space-md">Published timestamp</th>
                <th className="py-space-sm px-space-md">Turnaround</th>
                <th className="py-space-sm px-space-md">Performance glance</th>
                <th className="py-space-sm px-space-md">YouTube record</th>
                <th className="py-space-sm px-space-md">State &amp; notes</th>
              </tr>
            </thead>
            <tbody
              className="divide-y divide-outline-variant font-body-sm text-body-sm text-on-surface"
              id="ledger-body"
            >
              {visibleEntries.map((entry) => (
                <tr
                  key={entry.id}
                  className="hover:bg-surface-container-low transition-colors relative"
                >
                  <td className="py-space-md px-space-md">
                    <div className="flex items-center gap-space-sm">
                      <div className="relative w-12 h-20 flex-shrink-0 bg-surface-container border border-outline-variant rounded overflow-hidden">
                        <img
                          alt={entry.title}
                          className="w-full h-full object-cover"
                          src={entry.thumbnail}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-inverse-surface/80 text-surface-container-lowest text-[10px] text-center font-bold py-0.5">
                          {entry.duration}
                        </div>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          {entry.episode}
                        </span>
                        <span className="font-body-md text-body-md font-semibold text-on-surface truncate">
                          {entry.title}
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                          {entry.videoId}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-space-md px-space-md">
                    <div className="flex flex-col">
                      <span className="font-semibold text-on-surface">{entry.publishedDay}</span>
                      <span className="text-on-surface-variant font-label-sm text-label-sm">
                        {entry.publishedSlot}
                      </span>
                    </div>
                  </td>
                  <td className="py-space-md px-space-md">
                    <div className="flex flex-col">
                      <span className="font-semibold text-on-surface">
                        {entry.turnaroundMain}
                      </span>
                      <span className="text-on-surface-variant font-label-sm text-label-sm">
                        {entry.turnaroundSub}
                      </span>
                    </div>
                  </td>
                  <td className="py-space-md px-space-md">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-space-xs">
                        <span className="font-semibold text-on-surface">{entry.views}</span>
                        <span className="text-on-surface-variant">/</span>
                        <span
                          className={
                            entry.isViral
                              ? 'font-semibold text-secondary-container'
                              : 'font-semibold text-primary'
                          }
                        >
                          {entry.retentionLabel}
                        </span>
                      </div>
                      <div className="w-32 h-1.5 bg-surface-container rounded overflow-hidden">
                        <div
                          className={
                            entry.isViral
                              ? 'bg-secondary-container h-full'
                              : 'bg-primary-container h-full'
                          }
                          style={{ width: `${entry.retentionPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-space-md px-space-md">
                    <button
                      onClick={() =>
                        onShowToast(`Verified YouTube Short record for ${entry.episode}`)
                      }
                      className="inline-flex items-center gap-space-xs px-space-sm py-space-xs bg-surface-container-lowest hover:bg-surface-container-low border border-on-surface rounded text-on-surface font-label-sm text-label-sm shadow-[1px_1px_0px_#0c1f19] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                      type="button"
                    >
                      <span>Open on YouTube</span>
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </button>
                  </td>
                  <td className="py-space-md px-space-md">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-6 bg-primary-container rounded"></div>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-label-sm font-semibold text-on-surface">
                          Live &amp; synced
                        </span>
                        <span className="text-[11px] text-on-surface-variant">
                          {entry.stateNote}
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Ledger Footer / Pagination Stats */}
        <div className="p-space-md border-t border-outline-variant bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
            <span>Recorded units 1 to 5 of 38 total releases</span>
          </div>
          <div className="flex items-center gap-space-xs">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-space-sm py-1 bg-surface-container-lowest border border-outline-variant rounded font-label-sm text-label-sm text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50"
              type="button"
            >
              Previous
            </button>
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                onClick={() => {
                  setCurrentPage(p);
                  onShowToast(`Viewing ledger page ${p}`);
                }}
                className={
                  currentPage === p
                    ? 'px-space-sm py-1 bg-surface-container-lowest border border-on-surface rounded font-label-sm text-label-sm text-on-surface font-semibold shadow-[1px_1px_0px_#0c1f19]'
                    : 'px-space-sm py-1 bg-surface-container-lowest border border-outline-variant rounded font-label-sm text-label-sm text-on-surface hover:bg-surface-container transition-colors'
                }
                type="button"
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => {
                setCurrentPage((p) => Math.min(3, p + 1));
                onShowToast('Viewing next ledger page');
              }}
              className="px-space-sm py-1 bg-surface-container-lowest border border-outline-variant rounded font-label-sm text-label-sm text-on-surface hover:bg-surface-container transition-colors"
              type="button"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
