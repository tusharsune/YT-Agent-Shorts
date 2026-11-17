import React, { useState } from 'react';
import { NAV_ITEMS, PROFILE_AVATAR_URL, ScreenId } from '../utils/navigation';

interface ShellLayoutProps {
  activeScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  toastMessage: string | null;
  children: React.ReactNode;
  onNewShortClick: () => void;
}

export const ShellLayout: React.FC<ShellLayoutProps> = ({
  activeScreen,
  onSelectScreen,
  toastMessage,
  children,
  onNewShortClick,
}) => {
  const [newShortConfirmed, setNewShortConfirmed] = useState(false);

  const handleNewShort = () => {
    setNewShortConfirmed(true);
    onNewShortClick();
    setTimeout(() => setNewShortConfirmed(false), 2200);
  };

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen">
      {/* Shared Left Navigation Rail */}
      <aside className="fixed left-0 top-0 h-full w-60 bg-surface-container-lowest border-r border-outline-variant z-50 flex flex-col justify-between select-none">
        <div className="flex flex-col">
          <div className="h-16 px-space-md border-b border-outline-variant flex items-center justify-between bg-surface-container-lowest">
            <div className="flex items-center gap-space-sm">
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-outline-variant"
                src={PROFILE_AVATAR_URL}
              />
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-on-surface leading-none">
                  Pegboard
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant leading-none mt-1">
                  Cube Shorts Lab
                </span>
              </div>
            </div>
          </div>

          <nav
            aria-label="Primary navigation"
            className="flex flex-col py-space-sm"
            data-active-classes="border-l-4 border-primary-container text-on-surface font-bold bg-surface-container-low"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeScreen === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  aria-current={isActive ? 'page' : undefined}
                  data-path={item.id}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectScreen(item.id);
                  }}
                  className={
                    isActive
                      ? 'flex items-center gap-space-sm px-space-md py-space-sm transition-colors border-l-4 border-primary-container text-on-surface font-bold bg-surface-container-low'
                      : 'flex items-center gap-space-sm px-space-md py-space-sm text-on-surface-variant font-label-md text-label-md transition-colors hover:text-on-surface hover:bg-surface-container-lowest border-l-4 border-transparent'
                  }
                >
                  <span className="material-symbols-outlined text-outline">{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>

        <div className="p-space-md border-t border-outline-variant bg-surface-container-lowest flex flex-col gap-space-sm">
          <div className="flex items-center justify-between p-space-xs px-space-sm border border-outline-variant rounded bg-surface-container-low">
            <div className="flex items-center gap-space-xs">
              <span className="w-2 h-2 rounded-full bg-primary-container inline-block"></span>
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                Pipeline: Active
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">v1.2</span>
          </div>
          <div className="flex flex-col">
            <span className="font-body-sm text-body-sm font-semibold text-on-surface">Alex R.</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Solo Creator</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area with Fixed Top Header */}
      <div className="pl-60">
        <header className="fixed top-0 left-60 right-0 h-16 bg-surface-container-lowest border-b border-outline-variant z-40 flex items-center justify-between px-margin-desktop">
          <div className="flex items-center gap-space-md">
            <div className="flex items-center gap-space-xs py-space-xs px-space-sm border border-outline-variant rounded bg-surface-container-low">
              <span className="material-symbols-outlined text-outline text-[16px]">schedule</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Next Drop: Tomorrow 18:00 UTC
              </span>
            </div>
          </div>

          <div className="flex items-center gap-space-md">
            <button
              onClick={handleNewShort}
              className="bg-secondary-container text-on-primary font-label-md text-label-md px-space-md py-space-xs rounded border border-on-surface shadow-[2px_2px_0px_#0c1f19] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-1"
              type="button"
            >
              {newShortConfirmed ? (
                <>
                  <span className="material-symbols-outlined text-[16px]">check</span>
                  <span>Draft Initialized</span>
                </>
              ) : (
                <span>New Short</span>
              )}
            </button>
            <img
              alt="Creator Avatar"
              className="w-8 h-8 rounded-full object-cover border border-outline-variant"
              src={PROFILE_AVATAR_URL}
            />
          </div>
        </header>

        <main className="relative pt-16 bg-surface min-h-screen">{children}</main>
      </div>

      {/* Global Visual Confirmation Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 bg-on-surface text-surface-container-lowest px-space-md py-space-sm rounded border border-on-surface shadow-[2px_2px_0px_#0c1f19] font-label-md text-label-md flex items-center gap-space-xs z-50"
        >
          <span className="material-symbols-outlined text-primary-fixed-dim text-base">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
