import React, { useState } from 'react';

interface CalendarScreenProps {
  onShowToast: (msg: string) => void;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({ onShowToast }) => {
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [scheduledAll, setScheduledAll] = useState(false);
  const [recheckedSlots, setRecheckedSlots] = useState(false);
  const [assignedSlots, setAssignedSlots] = useState<Record<string, string>>({});

  const handleScheduleAll = () => {
    setScheduledAll(true);
    setAssignedSlots({
      '20': 'Ep #144 Square-1 Shape Shifting',
      '22': 'Ep #139 Clock World Record Analysis',
    });
    onShowToast('Scheduled all 2 unassigned finished Shorts to optimal 18:00 UTC slots');
    setTimeout(() => setScheduledAll(false), 2600);
  };

  const handleRecheckSlots = () => {
    setRecheckedSlots(true);
    onShowToast('Rechecked YouTube Shorts cadence windows — 4 of 5 weekly slots filled');
    setTimeout(() => setRecheckedSlots(false), 2200);
  };

  const handleAssignToDay = (day: string, label: string) => {
    setAssignedSlots((prev) => ({ ...prev, [day]: label }));
    onShowToast(`Assigned ${label} to Oct ${day} at 18:00 UTC`);
  };

  return (
    <div className="flex flex-col w-full p-space-md lg:p-margin-desktop gap-space-lg">
      {/* Top Action & Navigation Workbench Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-md pb-space-xs">
        {/* Left: Month Switcher & Mode Segment */}
        <div className="flex flex-wrap items-center gap-space-md">
          {/* Month Stepper */}
          <div className="flex items-center bg-surface-container-lowest border border-outline-variant rounded p-1 shadow-[2px_2px_0px_#0c1f19]">
            <button
              aria-label="Previous month"
              onClick={() => onShowToast('Viewing October 2025 production cycle')}
              className="flex items-center justify-center w-8 h-8 rounded text-on-surface hover:bg-surface-container-low transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <span className="font-headline-md text-headline-md text-on-surface px-space-sm select-none">
              October 2025
            </span>
            <button
              aria-label="Next month"
              onClick={() => onShowToast('Viewing October 2025 production cycle')}
              className="flex items-center justify-center w-8 h-8 rounded text-on-surface hover:bg-surface-container-low transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>

          {/* View Selector */}
          <div className="flex items-center bg-surface-container-lowest border border-outline-variant rounded p-1">
            <button
              onClick={() => setViewMode('month')}
              className={
                viewMode === 'month'
                  ? 'px-space-sm py-1 font-label-md text-label-md bg-surface-container-low text-on-surface rounded border border-outline-variant font-semibold'
                  : 'px-space-sm py-1 font-label-md text-label-md text-on-surface-variant hover:text-on-surface rounded transition-colors'
              }
              type="button"
            >
              Month view
            </button>
            <button
              onClick={() => {
                setViewMode('week');
                onShowToast('Switched to Week schedule focus');
              }}
              className={
                viewMode === 'week'
                  ? 'px-space-sm py-1 font-label-md text-label-md bg-surface-container-low text-on-surface rounded border border-outline-variant font-semibold'
                  : 'px-space-sm py-1 font-label-md text-label-md text-on-surface-variant hover:text-on-surface rounded transition-colors'
              }
              type="button"
            >
              Week schedule
            </button>
          </div>

          {/* Cadence Telemetry Chip */}
          <div className="flex items-center gap-space-xs px-space-sm py-space-xs rounded bg-surface-container border border-outline-variant">
            <span className="material-symbols-outlined text-primary text-[18px]">insights</span>
            <span className="font-label-sm text-label-sm text-on-surface">
              Optimal rhythm: Mon, Wed, Fri, Sun at 18:00 UTC (4 of 5 slots filled this week)
            </span>
          </div>
        </div>

        {/* Right: Global Actions */}
        <div className="flex items-center gap-space-sm">
          <button
            onClick={handleRecheckSlots}
            className="px-space-md py-space-xs font-label-md text-label-md bg-surface-container-lowest text-on-surface border border-on-surface rounded shadow-[2px_2px_0px_#0c1f19] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-space-xs"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">
              {recheckedSlots ? 'check' : 'sync'}
            </span>
            <span>{recheckedSlots ? 'Slots verified' : 'Recheck slots'}</span>
          </button>
          <button
            onClick={handleScheduleAll}
            className="px-space-md py-space-xs font-label-md text-label-md bg-secondary-container text-on-primary border border-on-surface rounded shadow-[2px_2px_0px_#0c1f19] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-space-xs"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">
              {scheduledAll ? 'check_circle' : 'auto_schedule'}
            </span>
            <span>{scheduledAll ? 'All scheduled ✓' : 'Schedule all'}</span>
          </button>
        </div>
      </div>

      {/* Main Asymmetric Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Primary Calendar Canvas */}
        <div className="lg:col-span-8 xl:col-span-9 bg-surface-container-lowest border border-outline-variant rounded p-space-md">
          {/* Weekday Header (Mon-Sun) */}
          <div className="grid grid-cols-7 gap-space-xs pb-space-sm border-b border-outline-variant text-center font-label-md text-label-md text-on-surface-variant">
            <div>Monday</div>
            <div>Tuesday</div>
            <div>Wednesday</div>
            <div>Thursday</div>
            <div>Friday</div>
            <div>Saturday</div>
            <div>Sunday</div>
          </div>

          {/* Month Day Cells (7 x 5 Grid) */}
          <div className="grid grid-cols-7 gap-space-xs pt-space-xs">
            {/* Row 1: Sept 29 to Oct 5 */}
            <div className="min-h-[110px] p-space-xs bg-surface-container-low rounded border border-outline-variant opacity-60 flex flex-col justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant">29</span>
            </div>
            <div className="min-h-[110px] p-space-xs bg-surface-container-low rounded border border-outline-variant opacity-60 flex flex-col justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant">30</span>
            </div>
            <div className="min-h-[110px] p-space-xs bg-surface-container-lowest rounded border border-outline-variant flex flex-col justify-between">
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">1</span>
            </div>
            <div className="min-h-[110px] p-space-xs bg-surface-container-lowest rounded border border-outline-variant flex flex-col justify-between">
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">2</span>
            </div>
            <div className="min-h-[110px] p-space-xs bg-surface-container-lowest rounded border border-outline-variant flex flex-col justify-between">
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">3</span>
              <div className="bg-surface-container-low rounded border border-outline-variant p-space-xs relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-container"></div>
                <div className="pl-space-xs">
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold block truncate">
                    Ep #137
                  </span>
                  <span className="font-body-sm text-body-sm text-primary flex items-center gap-0.5 text-[11px]">
                    <span className="material-symbols-outlined text-[13px]">check_circle</span>{' '}
                    Published
                  </span>
                </div>
              </div>
            </div>
            <div className="min-h-[110px] p-space-xs bg-surface-container-lowest rounded border border-outline-variant flex flex-col justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant">4</span>
            </div>
            <div className="min-h-[110px] p-space-xs bg-surface-container-lowest rounded border border-outline-variant flex flex-col justify-between">
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">5</span>
              <div className="bg-surface-container-low rounded border border-outline-variant p-space-xs relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-container"></div>
                <div className="pl-space-xs">
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold block truncate">
                    Ep #138
                  </span>
                  <span className="font-body-sm text-body-sm text-primary flex items-center gap-0.5 text-[11px]">
                    <span className="material-symbols-outlined text-[13px]">check_circle</span>{' '}
                    Published
                  </span>
                </div>
              </div>
            </div>

            {/* Row 2: Oct 6 to Oct 12 */}
            <div className="min-h-[110px] p-space-xs bg-surface-container-lowest rounded border border-outline-variant flex flex-col justify-between">
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">6</span>
            </div>
            <div className="min-h-[110px] p-space-xs bg-surface-container-lowest rounded border border-outline-variant flex flex-col justify-between">
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">7</span>
            </div>
            <div className="min-h-[110px] p-space-xs bg-surface-container-lowest rounded border border-outline-variant flex flex-col justify-between">
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">8</span>
              <div className="bg-surface-container-low rounded border border-outline-variant p-space-xs relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-container"></div>
                <div className="pl-space-xs">
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold block truncate">
                    Ep #139
                  </span>
                  <span className="font-body-sm text-body-sm text-primary flex items-center gap-0.5 text-[11px]">
                    <span className="material-symbols-outlined text-[13px]">check_circle</span>{' '}
                    Published
                  </span>
                </div>
              </div>
            </div>
            <div className="min-h-[110px] p-space-xs bg-surface-container-lowest rounded border border-outline-variant flex flex-col justify-between">
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">9</span>
            </div>
            <div className="min-h-[110px] p-space-xs bg-surface-container-lowest rounded border border-outline-variant flex flex-col justify-between">
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">10</span>
              <div className="bg-surface-container-low rounded border border-outline-variant p-space-xs relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-container"></div>
                <div className="pl-space-xs">
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold block truncate">
                    Ep #140
                  </span>
                  <span className="font-body-sm text-body-sm text-primary flex items-center gap-0.5 text-[11px]">
                    <span className="material-symbols-outlined text-[13px]">check_circle</span>{' '}
                    Published
                  </span>
                </div>
              </div>
            </div>
            <div className="min-h-[110px] p-space-xs bg-surface-container-lowest rounded border border-outline-variant flex flex-col justify-between">
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">11</span>
            </div>
            <div className="min-h-[110px] p-space-xs bg-surface-container-lowest rounded border border-outline-variant flex flex-col justify-between">
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">12</span>
            </div>

            {/* Row 3: Current Focus Week (Oct 13 to Oct 19) */}
            <div className="min-h-[125px] p-space-xs bg-surface-container-lowest rounded border border-outline-variant flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                  13
                </span>
                <span className="font-label-sm text-label-sm text-outline">Yesterday</span>
              </div>
              <div className="bg-surface-container-low rounded border border-outline-variant p-space-xs relative overflow-hidden shadow-sm">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-container"></div>
                <div className="pl-space-xs">
                  <span className="font-label-sm text-label-sm text-on-surface font-bold truncate block">
                    Ep #141 Speed Skewb
                  </span>
                  <span className="font-body-sm text-body-sm text-primary flex items-center gap-0.5 text-[11px]">
                    <span className="material-symbols-outlined text-[12px]">check_circle</span>{' '}
                    Published · 18:00
                  </span>
                </div>
              </div>
            </div>

            <div className="min-h-[125px] p-space-xs bg-surface-container-lowest rounded border border-outline-variant flex flex-col justify-between">
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">14</span>
              <span className="font-label-sm text-label-sm text-outline text-center pb-2">
                Off-cycle
              </span>
            </div>

            <div className="min-h-[125px] p-space-xs bg-surface rounded border-2 border-on-surface flex flex-col justify-between shadow-[2px_2px_0px_#0c1f19]">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm font-bold text-on-surface bg-primary-fixed px-1 rounded">
                  15
                </span>
                <span className="font-label-sm text-label-sm text-primary font-bold">
                  Tomorrow
                </span>
              </div>
              <div className="bg-surface-container-lowest rounded border border-on-surface p-space-xs relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-container"></div>
                <div className="pl-space-xs">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-label-sm text-label-sm text-on-surface font-bold truncate">
                      Ep #142
                    </span>
                    <span className="material-symbols-outlined text-secondary text-[14px]">
                      smart_display
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface font-medium truncate block text-[11px]">
                    God&apos;s Number Blindfolded
                  </span>
                  <span className="font-label-sm text-label-sm text-primary font-semibold block text-[10px] mt-0.5">
                    Ready · 18:00 UTC
                  </span>
                </div>
              </div>
            </div>

            <div className="min-h-[125px] p-space-xs bg-surface-container-lowest rounded border border-outline-variant flex flex-col justify-between">
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">16</span>
              <span className="font-label-sm text-label-sm text-outline text-center pb-2">
                Off-cycle
              </span>
            </div>

            <div className="min-h-[125px] p-space-xs bg-surface-container-lowest rounded border border-outline-variant flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                  17
                </span>
                <span className="font-label-sm text-label-sm text-tertiary font-medium">
                  Cadence
                </span>
              </div>
              <div className="bg-surface-container-lowest rounded border border-outline-variant p-space-xs relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-tertiary-fixed-dim"></div>
                <div className="pl-space-xs">
                  <span className="font-label-sm text-label-sm text-on-surface font-bold truncate block">
                    Ep #143
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface truncate block text-[11px]">
                    The Impossible 1x1 Parody
                  </span>
                  <span className="font-label-sm text-label-sm text-tertiary font-semibold block text-[10px] mt-0.5">
                    Assembly review · 18:00 UTC
                  </span>
                </div>
              </div>
            </div>

            <div className="min-h-[125px] p-space-xs bg-surface-container-lowest rounded border border-outline-variant flex flex-col justify-between">
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">18</span>
            </div>

            <div className="min-h-[125px] p-space-xs bg-surface-container-lowest rounded border border-outline-variant flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                  19
                </span>
                <span className="font-label-sm text-label-sm text-primary font-medium">
                  Cadence
                </span>
              </div>
              <div className="bg-surface-container-lowest rounded border border-outline-variant p-space-xs relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-container"></div>
                <div className="pl-space-xs">
                  <span className="font-label-sm text-label-sm text-on-surface font-bold truncate block">
                    Ep #140
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface truncate block text-[11px]">
                    Pyraminx 1-Look Solves
                  </span>
                  <span className="font-label-sm text-label-sm text-primary font-semibold block text-[10px] mt-0.5">
                    Scheduled · 18:00 UTC
                  </span>
                </div>
              </div>
            </div>

            {/* Row 4: Oct 20 to Oct 26 */}
            <div className="min-h-[120px] p-space-xs bg-surface-container-lowest rounded border border-outline-variant flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                  20
                </span>
                <span className="font-label-sm text-label-sm text-primary font-medium">
                  Cadence
                </span>
              </div>
              {assignedSlots['20'] ? (
                <div className="bg-surface-container-low rounded border border-outline-variant p-space-xs relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-container"></div>
                  <div className="pl-space-xs">
                    <span className="font-label-sm text-label-sm text-on-surface font-bold truncate block">
                      {assignedSlots['20']}
                    </span>
                    <span className="font-label-sm text-label-sm text-primary font-semibold block text-[10px] mt-0.5">
                      Scheduled · 18:00 UTC
                    </span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleAssignToDay('20', 'Ep #144 Square-1 Shape Shifting')}
                  className="w-full py-1 text-center font-label-sm text-label-sm text-outline border border-dashed border-outline-variant rounded hover:border-on-surface hover:text-on-surface bg-surface-container-low transition-colors"
                  type="button"
                >
                  + Assign finished Short
                </button>
              )}
            </div>

            <div className="min-h-[120px] p-space-xs bg-surface-container-lowest rounded border border-outline-variant flex flex-col justify-between">
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">21</span>
            </div>

            <div className="min-h-[120px] p-space-xs bg-surface-container-low rounded border border-outline-variant flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                  22
                </span>
                <span className="font-label-sm text-label-sm text-primary font-medium">
                  Target slot
                </span>
              </div>
              {assignedSlots['22'] ? (
                <div className="bg-surface-container-lowest rounded border border-outline-variant p-space-xs relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-container"></div>
                  <div className="pl-space-xs">
                    <span className="font-label-sm text-label-sm text-on-surface font-bold truncate block">
                      {assignedSlots['22']}
                    </span>
                    <span className="font-label-sm text-label-sm text-primary font-semibold block text-[10px] mt-0.5">
                      Scheduled · 18:00 UTC
                    </span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleAssignToDay('22', 'Ep #144 Square-1 Shape Shifting')}
                  className="w-full py-2 text-center font-label-sm text-label-sm text-on-surface font-semibold border border-dashed border-primary-container rounded bg-surface-container-lowest hover:bg-surface transition-colors flex items-center justify-center gap-1"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[14px] text-primary">add</span>
                  <span>Assign finished Short</span>
                </button>
              )}
            </div>

            <div className="min-h-[120px] p-space-xs bg-surface-container-lowest rounded border border-outline-variant flex flex-col justify-between">
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">23</span>
            </div>

            <div className="min-h-[120px] p-space-xs bg-surface-container-lowest rounded border border-outline-variant flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                  24
                </span>
                <span className="font-label-sm text-label-sm text-outline">Cadence</span>
              </div>
              <button
                onClick={() => handleAssignToDay('24', 'Ep #139 Clock World Record Analysis')}
                className="w-full py-1 text-center font-label-sm text-label-sm text-outline border border-dashed border-outline-variant rounded hover:border-on-surface hover:text-on-surface bg-surface-container-low transition-colors"
                type="button"
              >
                {assignedSlots['24'] ? 'Assigned ✓' : '+ Assign'}
              </button>
            </div>

            <div className="min-h-[120px] p-space-xs bg-surface-container-lowest rounded border border-outline-variant flex flex-col justify-between">
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">25</span>
            </div>

            <div className="min-h-[120px] p-space-xs bg-surface-container-lowest rounded border border-outline-variant flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                  26
                </span>
                <span className="font-label-sm text-label-sm text-outline">Cadence</span>
              </div>
              <button
                onClick={() => handleAssignToDay('26', 'Ep #139 Clock World Record Analysis')}
                className="w-full py-1 text-center font-label-sm text-label-sm text-outline border border-dashed border-outline-variant rounded hover:border-on-surface hover:text-on-surface bg-surface-container-low transition-colors"
                type="button"
              >
                {assignedSlots['26'] ? 'Assigned ✓' : '+ Assign'}
              </button>
            </div>

            {/* Row 5: Oct 27 to Nov 2 */}
            <div className="min-h-[100px] p-space-xs bg-surface-container-lowest rounded border border-outline-variant flex flex-col justify-between">
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">27</span>
            </div>
            <div className="min-h-[100px] p-space-xs bg-surface-container-lowest rounded border border-outline-variant flex flex-col justify-between">
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">28</span>
            </div>
            <div className="min-h-[100px] p-space-xs bg-surface-container-lowest rounded border border-outline-variant flex flex-col justify-between">
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">29</span>
            </div>
            <div className="min-h-[100px] p-space-xs bg-surface-container-lowest rounded border border-outline-variant flex flex-col justify-between">
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">30</span>
            </div>
            <div className="min-h-[100px] p-space-xs bg-surface-container-lowest rounded border border-outline-variant flex flex-col justify-between">
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">31</span>
            </div>
            <div className="min-h-[100px] p-space-xs bg-surface-container-low rounded border border-outline-variant opacity-60 flex flex-col justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant">1</span>
            </div>
            <div className="min-h-[100px] p-space-xs bg-surface-container-low rounded border border-outline-variant opacity-60 flex flex-col justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant">2</span>
            </div>
          </div>
        </div>

        {/* Side Workbench: Unassigned Finished Shorts Queue */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-space-md">
          {/* Queue Header Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded p-space-md shadow-[2px_2px_0px_#0c1f19]">
            <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  inventory_2
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface">
                  Unassigned finished queue
                </span>
              </div>
              <span className="font-label-sm text-label-sm px-space-xs py-0.5 bg-surface-container rounded border border-outline-variant text-on-surface font-bold">
                2 Ready
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
              These episodes are assembled, colored, and validated against YouTube Shorts vertical
              requirements.
            </p>
          </div>

          {/* Episode 144 Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded p-space-md relative overflow-hidden shadow-[2px_2px_0px_#0c1f19]">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-container"></div>
            <div className="pl-space-xs flex flex-col gap-space-sm">
              <div className="flex items-start justify-between gap-space-xs">
                <div>
                  <span className="font-label-sm text-label-sm text-primary font-bold">
                    Ep #144
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface leading-tight mt-0.5">
                    Square-1 Shape Shifting
                  </h3>
                </div>
                <span className="font-label-sm text-label-sm px-1.5 py-0.5 bg-surface-container rounded border border-outline-variant text-on-surface">
                  50s
                </span>
              </div>
              <div className="relative w-full h-28 bg-surface-container rounded border border-outline-variant overflow-hidden flex items-center justify-center">
                <img
                  alt="Square-1 Shape Shifting"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsdIGq7Y1gDI_r2LFomvFAgrin8MUcmUtif4oHwkrgWt8DZtt5qllvWva1knYuYvYpVZE3CGF3O3RgzGejczLMI3SIDfhNB_sRcgwrsr6VkWw6ecLtQ01dG0Hz8p5IONqiDHjzUNb6g_jFcyh9I3LloOnds3p16Cmz62K5pBgQ44uVn5GhwAd5nWhcypSI9U7LPr5AwhzWK5HzialhxN7BEwI9SITe_kEwGahg6ao"
                />
                <div className="absolute bottom-1 right-1 bg-surface-container-lowest border border-outline-variant px-1 rounded font-label-sm text-label-sm text-on-surface">
                  9:16 HD
                </div>
              </div>
              <div className="flex items-center justify-between pt-space-xs">
                <span className="font-body-sm text-body-sm text-primary font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                  {assignedSlots['22'] ? 'Assigned to Oct 22' : 'Ready to schedule'}
                </span>
                <button
                  onClick={() => handleAssignToDay('22', 'Ep #144 Square-1 Shape Shifting')}
                  className="px-space-sm py-1 font-label-md text-label-md bg-surface-container-lowest text-on-surface border border-on-surface rounded shadow-[1px_1px_0px_#0c1f19] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[15px]">event_upcoming</span>
                  <span>
                    {assignedSlots['22'] ? 'Assigned ✓' : 'Assign to next open slot'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Episode 139 Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded p-space-md relative overflow-hidden shadow-[2px_2px_0px_#0c1f19]">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-container"></div>
            <div className="pl-space-xs flex flex-col gap-space-sm">
              <div className="flex items-start justify-between gap-space-xs">
                <div>
                  <span className="font-label-sm text-label-sm text-primary font-bold">
                    Ep #139
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface leading-tight mt-0.5">
                    Clock World Record Analysis
                  </h3>
                </div>
                <span className="font-label-sm text-label-sm px-1.5 py-0.5 bg-surface-container rounded border border-outline-variant text-on-surface">
                  44s
                </span>
              </div>
              <div className="relative w-full h-28 bg-surface-container rounded border border-outline-variant overflow-hidden flex items-center justify-center">
                <img
                  alt="Clock World Record Analysis"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxldneXtHSnTActJUJ-SeVj-U3SvFHFBVJQZBYR0ntHE07QsondLRJGFp54N8vGkIpLHn3bwzq2Je5p98jq_bpcN3YIyFxFME-JSW1fdvYaSEOU2x8Yv8INA-Fgt6gnpWJt3uvb0v7wj8s6WzJcqwR0UVOcvOIq-chsIsJKes25nlOB6oLZdeBDlF93vG3u1yGBglFCOfEedxQCjGPbJK3HKXWorg8pEePK4gGv_A"
                />
                <div className="absolute bottom-1 right-1 bg-surface-container-lowest border border-outline-variant px-1 rounded font-label-sm text-label-sm text-on-surface">
                  9:16 HD
                </div>
              </div>
              <div className="flex items-center justify-between pt-space-xs">
                <span className="font-body-sm text-body-sm text-primary font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                  {assignedSlots['20'] ? 'Assigned to Oct 20' : 'Ready to schedule'}
                </span>
                <button
                  onClick={() => handleAssignToDay('20', 'Ep #139 Clock World Record Analysis')}
                  className="px-space-sm py-1 font-label-md text-label-md bg-surface-container-lowest text-on-surface border border-on-surface rounded shadow-[1px_1px_0px_#0c1f19] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[15px]">event_upcoming</span>
                  <span>
                    {assignedSlots['20'] ? 'Assigned ✓' : 'Assign to next open slot'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Pipeline Diagnostic Box */}
          <div className="bg-surface-container rounded border border-outline-variant p-space-md flex flex-col gap-space-xs">
            <span className="font-label-md text-label-md text-on-surface font-bold">
              Publishing cadence rule
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              YouTube algorithm favorability peaks at 4 weekly uploads spaced evenly across peak
              solver hours. Next recommended slot is Wednesday Oct 22 at 18:00 UTC.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
