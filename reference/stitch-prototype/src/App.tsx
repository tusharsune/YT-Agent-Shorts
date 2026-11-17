/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { ShellLayout } from './components/ShellLayout';
import { CalendarScreen } from './screens/CalendarScreen';
import { EpisodeTrackerScreen } from './screens/EpisodeTrackerScreen';
import { HistoryLibraryScreen } from './screens/HistoryLibraryScreen';
import { OverviewScreen } from './screens/OverviewScreen';
import { PromptQueueScreen } from './screens/PromptQueueScreen';
import { PublishLogScreen } from './screens/PublishLogScreen';
import { ScriptViewerScreen } from './screens/ScriptViewerScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { isValidScreenId, ScreenId } from './utils/navigation';

function getInitialScreen(): ScreenId {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.replace('#', '');
    if (isValidScreenId(hash)) {
      return hash;
    }
  }
  return 'overview';
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>(getInitialScreen);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 2600);
  };

  const handleSelectScreen = (screen: ScreenId) => {
    setActiveScreen(screen);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${screen}`);
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  };

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (isValidScreenId(hash)) {
        setActiveScreen(hash);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return (
    <ShellLayout
      activeScreen={activeScreen}
      onSelectScreen={handleSelectScreen}
      toastMessage={toastMessage}
      onNewShortClick={() => showToast('New Short episode workspace (#147) initialized')}
    >
      {activeScreen === 'overview' && (
        <OverviewScreen onNavigate={handleSelectScreen} onShowToast={showToast} />
      )}
      {activeScreen === 'prompt-queue' && <PromptQueueScreen onShowToast={showToast} />}
      {activeScreen === 'episode-tracker' && (
        <EpisodeTrackerScreen onNavigate={handleSelectScreen} onShowToast={showToast} />
      )}
      {activeScreen === 'history-and-library' && (
        <HistoryLibraryScreen onShowToast={showToast} />
      )}
      {activeScreen === 'script-viewer' && <ScriptViewerScreen onShowToast={showToast} />}
      {activeScreen === 'calendar' && <CalendarScreen onShowToast={showToast} />}
      {activeScreen === 'publish-log' && <PublishLogScreen onShowToast={showToast} />}
      {activeScreen === 'settings' && <SettingsScreen onShowToast={showToast} />}
    </ShellLayout>
  );
}
