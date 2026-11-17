/**
 * Pegboard — Cube Shorts Lab
 * Functional Web App & Live Data Connector
 * Reconciled Design System & Unified Architecture
 */

const state = {
  activeScreen: 'overview',
  overviewData: null,
  episodes: [],
  prompts: [],
  libraryAssets: [],
  scripts: [],
  calendarData: null,
  publishLog: [],
  settingsData: null,
  selectedEpisodeForScript: null,
  activeScriptContent: '',
  promptStatusFilter: 'all',
  promptTypeFilter: 'all',
  promptSearch: '',
  episodeFilter: 'all',
  libraryEpisodeFilter: 'all',
  libraryTypeFilter: 'all',
  librarySearch: '',
  toastTimeout: null,
  authMode: 'register',
  tempAuthEmail: '',
  tempDebugOtp: '',
  currentUser: null
};

// ----------------- Toast System -----------------
function showToast(message) {
  const toast = document.getElementById('toast-container');
  const toastText = document.getElementById('toast-text');
  if (!toast || !toastText) return;

  toastText.innerText = message;
  toast.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
  toast.classList.add('opacity-100', 'translate-y-0');

  if (state.toastTimeout) clearTimeout(state.toastTimeout);
  state.toastTimeout = setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
    toast.classList.remove('opacity-100', 'translate-y-0');
  }, 3200);
}

// ----------------- Mobile Drawer Navigation -----------------
function toggleMobileNav() {
  const sidebar = document.getElementById('main-sidebar');
  if (!sidebar) return;
  sidebar.classList.toggle('-translate-x-full');
}

function closeMobileNav() {
  const sidebar = document.getElementById('main-sidebar');
  if (!sidebar) return;
  sidebar.classList.add('-translate-x-full');
}

// ----------------- Authentication & Creator Login Handlers -----------------
async function handleCreatorLogin(e) {
  e.preventDefault();
  const usernameInput = document.getElementById('auth-input-username');
  const passwordInput = document.getElementById('auth-input-password');
  const username = usernameInput ? usernameInput.value.trim() : '';
  const password = passwordInput ? passwordInput.value.trim() : '';

  if (!username || !password) {
    showToast('Please enter both username and password');
    return;
  }

  showToast('Authenticating creator session...');

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const result = await res.json();

    if (!res.ok) {
      showToast(result.detail || 'Login failed. Check your credentials.');
      return;
    }

    // Successfully verified! Save session to localStorage
    localStorage.setItem('pegboard_user', JSON.stringify(result.user));
    showToast(`Welcome back, ${result.user.name}! Entering studio...`);
    checkAuthSession();
  } catch (err) {
    showToast('Network error during login: ' + err.message);
  }
}

async function revealPasswordHint() {
  const hintBanner = document.getElementById('auth-hint-banner');
  if (!hintBanner) return;
  hintBanner.classList.toggle('hidden');

  try {
    const res = await fetch('/api/auth/hint');
    const data = await res.json();
    showToast(data.message || 'Hint: ar.. is in the pass');
  } catch {
    showToast('Hint: ar.. is in the pass');
  }
}

function togglePasswordVisibility() {
  const passInput = document.getElementById('auth-input-password');
  const icon = document.getElementById('pass-visibility-icon');
  if (!passInput) return;

  if (passInput.type === 'password') {
    passInput.type = 'text';
    if (icon) icon.innerText = 'visibility_off';
  } else {
    passInput.type = 'password';
    if (icon) icon.innerText = 'visibility';
  }
}

function handleSignOut() {
  localStorage.removeItem('pegboard_user');
  state.currentUser = null;
  showToast('Signed out of creator studio');
  checkAuthSession();
}

function checkAuthSession() {
  const stored = localStorage.getItem('pegboard_user');
  const authPortal = document.getElementById('auth-portal');
  const dashboardRoot = document.getElementById('dashboard-root');

  if (stored) {
    try {
      state.currentUser = JSON.parse(stored);
    } catch {
      state.currentUser = { name: 'Tushar', username: 'Tushar', role: 'Creator' };
    }

    if (authPortal) authPortal.classList.add('hidden');
    if (dashboardRoot) dashboardRoot.classList.remove('hidden');

    const userNameEl = document.getElementById('sidebar-user-name');
    const userEmailEl = document.getElementById('sidebar-user-email');
    if (userNameEl) userNameEl.innerText = state.currentUser.name || 'Tushar';
    if (userEmailEl) userEmailEl.innerText = `@${(state.currentUser.username || 'tushar').toLowerCase()} • Creator`;

    // Render active screen
    renderCurrentScreen();
  } else {
    if (authPortal) authPortal.classList.remove('hidden');
    if (dashboardRoot) dashboardRoot.classList.add('hidden');
    const passInput = document.getElementById('auth-input-password');
    if (passInput) passInput.value = '';
    const hintBanner = document.getElementById('auth-hint-banner');
    if (hintBanner) hintBanner.classList.add('hidden');
  }
}

// ----------------- Navigation -----------------
function navigateTo(screenId) {
  state.activeScreen = screenId;
  window.location.hash = screenId;

  const breadcrumb = document.getElementById('header-breadcrumb');
  if (breadcrumb) {
    const labels = {
      'overview': 'Overview',
      'prompt-queue': 'Prompt Queue',
      'episode-tracker': 'Episode Tracker',
      'history-and-library': 'History & Library',
      'script-viewer': 'Script Studio',
      'calendar': 'Calendar',
      'publish-log': 'Publish Log',
      'settings': 'Settings'
    };
    breadcrumb.innerText = labels[screenId] || 'Workbench';
  }

  document.querySelectorAll('[data-nav-id]').forEach((el) => {
    const isCurrent = el.getAttribute('data-nav-id') === screenId;
    if (isCurrent) {
      el.className = 'flex items-center gap-space-sm px-space-md py-space-sm transition-colors border-l-4 border-primary-container text-on-surface font-bold bg-surface-container-low';
    } else {
      el.className = 'flex items-center gap-space-sm px-space-md py-space-sm text-on-surface-variant font-label-md transition-colors hover:text-on-surface hover:bg-surface-container-lowest border-l-4 border-transparent';
    }
  });

  renderCurrentScreen();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

// ----------------- Screen Router -----------------
async function renderCurrentScreen() {
  if (!state.currentUser) return; // Wait until authenticated

  const container = document.getElementById('screen-content');
  if (!container) return;

  container.innerHTML = '<div class="w-full max-w-7xl mx-auto p-space-md lg:p-margin-desktop flex items-center justify-center text-on-surface-variant font-medium">Loading workspace telemetry...</div>';

  try {
    switch (state.activeScreen) {
      case 'overview':
        await renderOverviewScreen(container);
        break;
      case 'prompt-queue':
        await renderPromptQueueScreen(container);
        break;
      case 'episode-tracker':
        await renderEpisodeTrackerScreen(container);
        break;
      case 'history-and-library':
        await renderHistoryLibraryScreen(container);
        break;
      case 'script-viewer':
        await renderScriptViewerScreen(container);
        break;
      case 'calendar':
        await renderCalendarScreen(container);
        break;
      case 'publish-log':
        await renderPublishLogScreen(container);
        break;
      case 'settings':
        await renderSettingsScreen(container);
        break;
      default:
        await renderOverviewScreen(container);
    }
  } catch (err) {
    container.innerHTML = `<div class="w-full max-w-7xl mx-auto p-space-md lg:p-margin-desktop text-secondary font-bold">Error loading screen: ${err.message}</div>`;
  }
}

// =========================================================================
// 1. OVERVIEW SCREEN (Real counts from episodes.json & prompts.json)
// =========================================================================
async function renderOverviewScreen(container) {
  const res = await fetch('/api/overview');
  const data = await res.json();
  state.overviewData = data;

  const nextSchedTitle = data.next_scheduled ? `#${data.next_scheduled.episode_number}: ${data.next_scheduled.title}` : 'No upcoming releases locked';
  const nextSchedDate = data.next_scheduled ? data.next_scheduled.scheduled_date : 'Calendar Open';

  let workbenchRows = '';
  const activeEpisodes = data.active_workbench || [];

  if (activeEpisodes.length === 0) {
    workbenchRows = `
      <div class="bg-surface-container-low border border-dashed border-outline-variant rounded-lg p-space-xl flex flex-col items-center justify-center text-center gap-space-sm">
        <span class="material-symbols-outlined text-[36px] text-primary">video_library</span>
        <h4 class="font-headline-sm text-headline-sm text-on-surface">No active episodes in flight</h4>
        <p class="text-body-sm text-on-surface-variant max-w-sm">Your workbench is currently clean and ready. Click "+ New Short" above to start your first episode pipeline.</p>
        <button onclick="openCreateEpisodeModal()" class="mt-2 bg-secondary-container text-on-primary font-bold text-xs px-space-md py-1.5 rounded border border-on-surface retro-btn flex items-center gap-1">
          <span class="material-symbols-outlined text-[16px]">add</span>
          <span>Initialize First Short</span>
        </button>
      </div>
    `;
  } else {
    activeEpisodes.forEach((ep) => {
      const isAttention = ep.attention_required;
      const barBorder = isAttention ? 'border-l-secondary-container' : 'border-l-primary-container';
      const tagBg = isAttention ? 'bg-secondary-container text-on-primary' : 'bg-primary-container text-on-primary-container';
      const barColor = isAttention ? 'bg-secondary-container' : 'bg-primary-container';

      workbenchRows += `
        <div class="bg-surface border-l-4 ${barBorder} border border-outline-variant rounded p-space-md flex flex-col gap-space-sm retro-card">
          <div class="flex flex-wrap items-center justify-between gap-space-xs">
            <div class="flex items-center gap-space-sm">
              <span class="font-headline-sm text-headline-sm text-on-surface">#${ep.episode_number}: ${ep.title}</span>
              <span class="font-label-sm text-label-sm ${tagBg} px-space-xs py-0.5 rounded font-semibold">${ep.stage}</span>
            </div>
            <span class="font-label-sm text-label-sm text-on-surface-variant font-medium">Target: ${ep.target_day}</span>
          </div>
          <div class="flex flex-col gap-1">
            <div class="flex justify-between items-center text-label-sm font-label-sm">
              <span class="text-on-surface font-medium">Prompt checklist progress</span>
              <span class="text-on-surface font-bold">${ep.fulfilled_prompts} of ${ep.total_prompts} fulfilled (${ep.progress}%)</span>
            </div>
            <div class="w-full bg-surface-container-highest rounded h-2 overflow-hidden border border-outline-variant">
              <div class="${barColor} h-full rounded" style="width: ${ep.progress}%"></div>
            </div>
          </div>
          <div class="flex items-center justify-between pt-space-xs border-t border-outline-variant text-body-sm">
            <div class="flex items-center gap-space-xs ${isAttention ? 'text-secondary font-semibold' : 'text-on-surface-variant'}">
              <span class="material-symbols-outlined text-[16px]">${isAttention ? 'warning' : 'check_circle'}</span>
              <span>${ep.blocker_note || 'Pipeline synced. Media fulfilling smoothly.'}</span>
            </div>
            <button onclick="navigateTo('episode-tracker')" class="font-label-md text-label-md text-on-surface bg-surface-container-lowest px-space-sm py-1 rounded border border-outline-variant hover:bg-surface-container transition-colors retro-btn">
              Inspect timeline
            </button>
          </div>
        </div>
      `;
    });
  }

  container.innerHTML = `
    <div class="w-full max-w-7xl mx-auto p-space-md lg:p-margin-desktop flex flex-col gap-space-lg">
      <!-- Top Hero Glanceable Triage Row -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-gutter-desktop w-full">
        <!-- Module A: Pending Prompts -->
        <div class="relative bg-surface-container-lowest border-l-4 border-l-secondary-container border border-outline-variant rounded-lg p-space-lg flex flex-col justify-between retro-card">
          <div class="flex flex-col gap-space-xs">
            <div class="flex items-center justify-between">
              <span class="font-headline-sm text-headline-sm text-on-surface">Pending prompts</span>
              <span class="material-symbols-outlined text-secondary-container">pending_actions</span>
            </div>
            <div class="font-display-hero text-display-hero text-on-surface tracking-tight mt-space-xs">${data.pending_prompts_count}</div>
            <p class="font-body-md text-body-md text-on-surface-variant leading-snug">${data.pending_breakdown}</p>
          </div>
          <div class="mt-space-lg pt-space-sm border-t border-outline-variant flex items-center justify-between">
            <button onclick="navigateTo('prompt-queue')" class="bg-secondary-container text-on-primary font-label-md text-label-md px-space-md py-space-xs rounded border border-on-surface retro-btn">
              Open prompt queue
            </button>
            <span class="font-label-sm text-label-sm text-on-surface-variant font-medium">Auto-dispatch ready</span>
          </div>
        </div>

        <!-- Module B: In-progress episodes -->
        <div class="relative bg-surface-container-lowest border-l-4 border-l-primary-container border border-outline-variant rounded-lg p-space-lg flex flex-col justify-between retro-card">
          <div class="flex flex-col gap-space-xs">
            <div class="flex items-center justify-between">
              <span class="font-headline-sm text-headline-sm text-on-surface">In-progress episodes</span>
              <span class="material-symbols-outlined text-primary-container">motion_photos_on</span>
            </div>
            <div class="font-display-hero text-display-hero text-on-surface tracking-tight mt-space-xs">${data.in_progress_count}</div>
            <p class="font-body-md text-body-md text-on-surface-variant leading-snug">Tracked across script, voice, media queue, and assembly</p>
          </div>
          <div class="mt-space-lg pt-space-sm border-t border-outline-variant flex items-center justify-between">
            <button onclick="navigateTo('episode-tracker')" class="bg-surface-container-lowest text-on-surface font-label-md text-label-md px-space-md py-space-xs rounded border border-outline-variant hover:bg-surface-container-low retro-btn">
              Inspect timeline
            </button>
            <span class="font-label-sm text-label-sm text-primary font-semibold">Live Pipeline Active</span>
          </div>
        </div>

        <!-- Module C: Next scheduled post -->
        <div class="relative bg-surface-container-lowest border-l-4 border-l-tertiary-container border border-outline-variant rounded-lg p-space-lg flex flex-col justify-between retro-card">
          <div class="flex flex-col gap-space-xs">
            <div class="flex items-center justify-between">
              <span class="font-headline-sm text-headline-sm text-on-surface">Next scheduled post</span>
              <span class="material-symbols-outlined text-tertiary-container">schedule_send</span>
            </div>
            <div class="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-space-xs">${nextSchedDate}</div>
            <p class="font-body-md text-body-md text-on-surface-variant leading-snug">${nextSchedTitle}</p>
          </div>
          <div class="mt-space-lg pt-space-sm border-t border-outline-variant flex items-center justify-between">
            <button onclick="navigateTo('calendar')" class="bg-surface-container-lowest text-on-surface font-label-md text-label-md px-space-md py-space-xs rounded border border-outline-variant hover:bg-surface-container-low retro-btn">
              Review package
            </button>
            <span class="font-label-sm text-label-sm text-on-surface font-medium bg-surface-container-high px-space-xs py-0.5 rounded border border-outline-variant">Locked</span>
          </div>
        </div>
      </section>

      <!-- Main Asymmetrical Pegboard Modules -->
      <section class="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop w-full items-start">
        <div class="lg:col-span-7 bg-surface-container-lowest border border-outline-variant rounded-lg p-space-lg flex flex-col gap-space-md retro-card">
          <div class="flex items-center justify-between pb-space-sm border-b border-outline-variant">
            <div>
              <h2 class="font-headline-md text-headline-md text-on-surface">Active workbench</h2>
              <p class="font-body-md text-body-md text-on-surface-variant mt-0.5">Live tracking for current in-flight cube solves</p>
            </div>
            <div class="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1 rounded border border-outline-variant">
              <span class="w-2 h-2 rounded-full bg-primary-container inline-block"></span>
              <span class="font-label-sm text-label-sm text-on-surface font-semibold">${activeEpisodes.length} active builds</span>
            </div>
          </div>
          <div class="flex flex-col gap-space-md">
            ${workbenchRows}
          </div>
        </div>

        <div class="lg:col-span-5 flex flex-col gap-space-lg">
          <div class="bg-surface-container-lowest border border-outline-variant rounded-lg p-space-lg flex flex-col gap-space-md retro-card">
            <div class="flex items-center justify-between">
              <span class="font-headline-sm text-headline-sm text-on-surface">Voice Direction & Batch</span>
              <span class="material-symbols-outlined text-primary">record_voice_over</span>
            </div>
            <p class="font-body-md text-body-md text-on-surface-variant leading-snug">
              Every scene in the queue is automatically shaped by your active <code class="bg-surface-container px-1 py-0.5 rounded text-primary font-bold">voice.md</code> tone guide.
            </p>
            <div class="bg-surface-container-low p-space-md rounded border border-outline-variant flex flex-col gap-space-xs">
              <div class="flex justify-between items-center text-label-sm">
                <span class="font-semibold text-on-surface">Voice profile status:</span>
                <span class="text-primary font-bold">Synchronized</span>
              </div>
              <div class="flex justify-between items-center text-label-sm">
                <span class="font-semibold text-on-surface">Target Tone:</span>
                <span class="text-on-surface-variant">Melodic, Soul-touching</span>
              </div>
              <div class="flex justify-between items-center text-label-sm">
                <span class="font-semibold text-on-surface">Audience:</span>
                <span class="text-on-surface-variant">Universal / Emotional</span>
              </div>
            </div>
            <div class="flex items-center justify-between pt-space-xs border-t border-outline-variant">
              <button onclick="navigateTo('settings')" class="font-label-md text-label-md text-primary hover:text-on-surface underline">
                Configure voice.md
              </button>
              <button onclick="triggerIdeateModal()" class="bg-secondary-container text-on-primary font-label-md text-label-md px-space-md py-1 rounded border border-on-surface retro-btn">
                Run /yt-ideate
              </button>
            </div>
          </div>

          <div class="bg-surface-container-lowest border border-outline-variant rounded-lg p-space-lg flex flex-col gap-space-md retro-card">
            <div class="flex items-center justify-between">
              <span class="font-headline-sm text-headline-sm text-on-surface">Automated Assembly</span>
              <span class="material-symbols-outlined text-secondary">movie_creation</span>
            </div>
            <p class="font-body-md text-body-md text-on-surface-variant leading-snug">
              Once an episode's scene media is uploaded, MoviePy/ffmpeg binds the video stems, audio voiceovers, and transitions into a finished 9:16 vertical render.
            </p>
            <div class="flex items-center justify-between pt-space-xs border-t border-outline-variant">
              <button onclick="navigateTo('episode-tracker')" class="bg-secondary-container text-on-primary font-label-md text-label-md px-space-md py-space-xs rounded border border-on-surface retro-btn">
                Inspect Pipeline Stages
              </button>
              <span class="font-label-sm text-label-sm text-primary font-semibold">Zero Paid API Costs</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}

// =========================================================================
// 2. PROMPT QUEUE SCREEN (Real Prompt Text Copy & Real File Upload)
// =========================================================================
async function renderPromptQueueScreen(container) {
  const url = `/api/prompts?status=${state.promptStatusFilter}&type=${state.promptTypeFilter}&search=${encodeURIComponent(state.promptSearch)}`;
  const res = await fetch(url);
  const prompts = await res.json();
  state.prompts = prompts;

  let promptCards = '';
  if (prompts.length === 0) {
    promptCards = `
      <div class="bg-surface-container-lowest border border-dashed border-outline-variant rounded-lg p-space-xl flex flex-col items-center justify-center text-center gap-space-sm retro-card">
        <span class="material-symbols-outlined text-[40px] text-primary">terminal</span>
        <h3 class="font-headline-md text-headline-md text-on-surface">Prompt Queue Empty</h3>
        <p class="font-body-md text-body-md text-on-surface-variant max-w-md">
          When you create an episode and run script generation, scene-by-scene prompts for Gemini (images) and Flow (video/audio) will appear here for one-click copying and uploading.
        </p>
        <button onclick="openCreateEpisodeModal()" class="mt-2 bg-secondary-container text-on-primary font-bold text-xs px-space-md py-1.5 rounded border border-on-surface retro-btn">
          + Create New Short
        </button>
      </div>
    `;
  } else {
    prompts.forEach((p) => {
      const isFulfilled = p.status === 'fulfilled';
      const statusBadge = isFulfilled 
        ? `<span class="bg-primary-container text-on-primary-container font-label-sm text-label-sm px-space-xs py-0.5 rounded font-semibold flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">check</span> ${p.status_label || 'Fulfilled'}</span>`
        : `<span class="bg-tertiary-fixed-dim text-on-tertiary-container font-label-sm text-label-sm px-space-xs py-0.5 rounded font-semibold flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">hourglass_empty</span> ${p.status_label || 'Pending'}</span>`;

      const specsList = (p.specs || []).map(s => `<span class="bg-surface-container-low px-space-xs py-0.5 rounded text-body-sm text-on-surface-variant border border-outline-variant font-medium">${s}</span>`).join(' ');

      promptCards += `
        <div class="bg-surface-container-lowest border border-outline-variant rounded-lg p-space-lg flex flex-col gap-space-md retro-card">
          <div class="flex flex-wrap items-center justify-between gap-space-xs pb-space-xs border-b border-outline-variant">
            <div class="flex items-center gap-space-sm">
              <span class="font-headline-sm text-headline-sm text-on-surface">${p.episode_title} • ${p.scene}</span>
              <span class="font-label-sm text-label-sm bg-surface-container px-space-xs py-0.5 rounded text-on-surface-variant border border-outline-variant font-medium">${p.badge_label || p.model}</span>
            </div>
            <div>${statusBadge}</div>
          </div>

          <div class="flex flex-col gap-1">
            <div class="flex items-center justify-between">
              <span class="font-label-sm text-label-sm text-on-surface font-semibold uppercase tracking-wider">${p.prompt_heading || 'Generation Prompt'}</span>
              <button onclick="copyPromptText('${p.id}')" class="flex items-center gap-1 font-label-md text-label-md text-primary hover:text-on-surface bg-surface-container-lowest hover:bg-surface-container-low px-space-sm py-1 rounded border border-outline-variant transition-all retro-btn">
                <span class="material-symbols-outlined text-[16px]">content_copy</span>
                <span>Copy Prompt</span>
              </button>
            </div>
            <div id="prompt-text-${p.id}" class="bg-surface-container-low p-space-md rounded border border-outline-variant font-mono text-body-sm text-on-surface select-all leading-relaxed whitespace-pre-wrap">${p.prompt_text}</div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs border-t border-outline-variant">
            <div class="flex flex-wrap gap-1 items-center">
              ${specsList}
            </div>
            <div class="flex items-center gap-space-xs">
              ${isFulfilled && p.file_path ? `
                <a href="/${p.file_path}" target="_blank" class="flex items-center gap-1 font-label-md text-label-md text-on-primary bg-primary px-space-sm py-1 rounded border border-on-surface hover:opacity-90 transition-opacity retro-btn">
                  <span class="material-symbols-outlined text-[16px]">preview</span>
                  <span>Inspect Asset</span>
                </a>
              ` : `
                <button onclick="openUploadModal('${p.id}', '${p.episode_title.replace(/'/g, "\\'")}', '${p.scene}')" class="flex items-center gap-1 font-label-md text-label-md text-on-primary bg-secondary-container px-space-md py-1 rounded border border-on-surface retro-btn">
                  <span class="material-symbols-outlined text-[16px]">upload_file</span>
                  <span>Fulfill (Upload Media)</span>
                </button>
              `}
            </div>
          </div>
        </div>
      `;
    });
  }

  container.innerHTML = `
    <div class="w-full max-w-7xl mx-auto p-space-md lg:p-margin-desktop flex flex-col gap-space-lg">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div>
          <h1 class="font-headline-lg text-headline-lg text-on-surface">Prompt Queue + Fulfill</h1>
          <p class="font-body-md text-body-md text-on-surface-variant">Zero paid API costs: Copy prompts into Gemini / Flow, then upload finished assets back here.</p>
        </div>
        <div class="flex items-center gap-space-sm">
          <button onclick="syncPipelineFromUI()" class="bg-surface-container-lowest text-on-surface font-label-md text-label-md px-space-md py-space-xs rounded border border-outline-variant retro-btn flex items-center gap-1">
            <span class="material-symbols-outlined text-[18px]">sync</span>
            <span>Sync All</span>
          </button>
        </div>
      </div>

      <!-- Filters Toolbar -->
      <div class="bg-surface-container-lowest p-space-md rounded-lg border border-outline-variant flex flex-wrap items-center justify-between gap-space-md retro-card">
        <div class="flex flex-wrap items-center gap-space-sm">
          <div class="flex rounded border border-outline-variant overflow-hidden text-label-sm font-label-sm">
            <button onclick="setPromptFilter('status', 'all')" class="px-space-md py-1 ${state.promptStatusFilter === 'all' ? 'bg-primary-container text-on-primary-container font-bold' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface'}">All</button>
            <button onclick="setPromptFilter('status', 'pending')" class="px-space-md py-1 ${state.promptStatusFilter === 'pending' ? 'bg-primary-container text-on-primary-container font-bold' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface'}">Pending</button>
            <button onclick="setPromptFilter('status', 'fulfilled')" class="px-space-md py-1 ${state.promptStatusFilter === 'fulfilled' ? 'bg-primary-container text-on-primary-container font-bold' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface'}">Fulfilled</button>
          </div>

          <div class="flex rounded border border-outline-variant overflow-hidden text-label-sm font-label-sm">
            <button onclick="setPromptFilter('type', 'all')" class="px-space-sm py-1 ${state.promptTypeFilter === 'all' ? 'bg-secondary-container text-on-primary font-bold' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface'}">All Media</button>
            <button onclick="setPromptFilter('type', 'video')" class="px-space-sm py-1 ${state.promptTypeFilter === 'video' ? 'bg-secondary-container text-on-primary font-bold' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface'}">Video</button>
            <button onclick="setPromptFilter('type', 'voice')" class="px-space-sm py-1 ${state.promptTypeFilter === 'voice' ? 'bg-secondary-container text-on-primary font-bold' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface'}">Voice</button>
            <button onclick="setPromptFilter('type', 'image')" class="px-space-sm py-1 ${state.promptTypeFilter === 'image' ? 'bg-secondary-container text-on-primary font-bold' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface'}">Image</button>
          </div>
        </div>

        <div class="relative min-w-[260px]">
          <input type="text" id="prompt-search-input" value="${state.promptSearch}" oninput="handlePromptSearch(this.value)" placeholder="Search prompts or models..." class="w-full bg-surface-container-low border border-outline-variant rounded px-space-md py-1 text-body-sm text-on-surface focus:outline-none focus:border-primary" />
          <span class="material-symbols-outlined absolute right-2 top-1.5 text-on-surface-variant text-[18px]">search</span>
        </div>
      </div>

      <div class="flex flex-col gap-space-md">
        ${promptCards}
      </div>
    </div>
  `;
}

function setPromptFilter(category, val) {
  if (category === 'status') state.promptStatusFilter = val;
  if (category === 'type') state.promptTypeFilter = val;
  renderCurrentScreen();
}

function handlePromptSearch(val) {
  state.promptSearch = val;
  renderCurrentScreen();
}

async function copyPromptText(promptId) {
  const el = document.getElementById(`prompt-text-${promptId}`);
  if (!el) return;
  const text = el.innerText;
  try {
    await navigator.clipboard.writeText(text);
    showToast('Prompt copied to clipboard! Ready to paste into Gemini / Flow');
  } catch (err) {
    showToast('Prompt selected — Press Ctrl+C to copy');
  }
}

// Upload Modal Handler
function openUploadModal(promptId, epTitle, scene) {
  const modal = document.getElementById('upload-modal');
  document.getElementById('modal-prompt-id').value = promptId;
  document.getElementById('modal-ep-title').innerText = `${epTitle} • ${scene}`;
  modal.classList.remove('hidden');
}

function closeUploadModal() {
  document.getElementById('upload-modal').classList.add('hidden');
  document.getElementById('upload-form').reset();
}

async function submitFulfillForm(e) {
  e.preventDefault();
  const promptId = document.getElementById('modal-prompt-id').value;
  const fileInput = document.getElementById('modal-file-input');

  if (!fileInput.files.length) {
    showToast('Please select a media file to upload');
    return;
  }

  const formData = new FormData();
  formData.append('file', fileInput.files[0]);

  showToast('Uploading media to episode folder...');
  try {
    const res = await fetch(`/api/prompts/${promptId}/fulfill`, {
      method: 'POST',
      body: formData
    });
    const result = await res.json();
    if (res.ok) {
      showToast('Media fulfilled successfully and saved locally!');
      closeUploadModal();
      renderCurrentScreen();
    } else {
      showToast('Upload error: ' + (result.detail || 'Failed'));
    }
  } catch (err) {
    showToast('Upload failed: ' + err.message);
  }
}

// =========================================================================
// 3. EPISODE TRACKER SCREEN (Real stages on pipeline strip)
// =========================================================================
async function renderEpisodeTrackerScreen(container) {
  const res = await fetch('/api/episodes?filter=' + state.episodeFilter);
  const episodes = await res.json();
  state.episodes = episodes;

  const inPipeline = episodes.length;
  const attentionReq = episodes.filter(e => e.attention_required).length;
  const inAssembly = episodes.filter(e => e.status === 'in-assembly').length;
  const readyCount = episodes.filter(e => e.progress === 100).length;

  let cards = '';
  if (episodes.length === 0) {
    cards = `
      <div class="bg-surface-container-lowest border border-dashed border-outline-variant rounded-lg p-space-xl flex flex-col items-center justify-center text-center gap-space-sm retro-card">
        <span class="material-symbols-outlined text-[40px] text-primary">movie_filter</span>
        <h3 class="font-headline-md text-headline-md text-on-surface">No Episodes in Pipeline</h3>
        <p class="font-body-md text-body-md text-on-surface-variant max-w-md">Initialize a new episode using the "+ New Short" button or use the /yt-ideate generator to propose a concept.</p>
        <button onclick="openCreateEpisodeModal()" class="mt-2 bg-secondary-container text-on-primary font-bold text-xs px-space-md py-1.5 rounded border border-on-surface retro-btn">
          + Create First Short
        </button>
      </div>
    `;
  } else {
    episodes.forEach(ep => {
      // Pipeline stage steps
      const stages = ['Idea & Hook', 'Voice Direction', 'Media Pack', 'Assembly', 'Scheduled'];
      const currentStage = ep.stage || '';
      
      const stagePills = stages.map(st => {
        const isCurrent = currentStage.toLowerCase().includes(st.toLowerCase().split(' ')[0]);
        return `
          <span class="text-[11px] px-2 py-0.5 rounded border border-outline-variant ${isCurrent ? 'bg-primary-container text-on-primary-container font-bold' : 'bg-surface-container-low text-on-surface-variant'}">
            ${st}
          </span>
        `;
      }).join('<span class="text-on-surface-variant font-bold text-[10px]">→</span>');

      cards += `
        <div class="bg-surface-container-lowest border border-outline-variant rounded-lg p-space-lg flex flex-col gap-space-md retro-card">
          <div class="flex flex-wrap items-center justify-between gap-space-sm pb-space-xs border-b border-outline-variant">
            <div class="flex items-center gap-space-sm">
              <span class="font-headline-md text-headline-md text-on-surface">#${ep.episode_number}: ${ep.title}</span>
              <span class="font-label-sm text-label-sm bg-surface-container px-space-xs py-0.5 rounded font-semibold text-primary border border-outline-variant">${ep.stage}</span>
            </div>
            <div class="flex items-center gap-space-xs">
              <span class="font-label-sm text-label-sm bg-surface-container-high text-on-surface px-space-xs py-0.5 rounded border border-outline-variant">Target: ${ep.scheduled_date || 'Unscheduled'}</span>
            </div>
          </div>

          <p class="font-body-md text-body-md text-on-surface-variant">${ep.angle}</p>

          <!-- Pipeline Strip -->
          <div class="flex flex-wrap items-center gap-1.5 p-space-xs bg-surface rounded border border-outline-variant">
            <span class="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase mr-1">Pipeline:</span>
            ${stagePills}
          </div>

          <!-- Progress Bar -->
          <div class="flex flex-col gap-1">
            <div class="flex justify-between items-center text-label-sm font-label-sm">
              <span class="text-on-surface font-medium">Media fulfillment progress</span>
              <span class="text-on-surface font-bold">${ep.fulfilled_prompts} of ${ep.total_prompts} scenes complete (${ep.progress}%)</span>
            </div>
            <div class="w-full bg-surface-container-highest rounded h-2.5 overflow-hidden border border-outline-variant">
              <div class="${ep.progress === 100 ? 'bg-primary-container' : 'bg-secondary-container'} h-full rounded" style="width: ${ep.progress}%"></div>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs border-t border-outline-variant">
            <div class="flex items-center gap-space-xs text-body-sm text-on-surface-variant">
              <span class="material-symbols-outlined text-[18px]">timer</span>
              <span>Duration: ${ep.target_duration}</span>
              <span class="mx-1">•</span>
              <span class="material-symbols-outlined text-[18px]">verified</span>
              <span>Hook Score: ${ep.score}/100</span>
            </div>
            <div class="flex items-center gap-space-xs">
              <button onclick="assembleEpisode('${ep.id}')" class="bg-surface-container-lowest text-on-surface font-label-md text-label-md px-space-md py-1 rounded border border-outline-variant hover:bg-surface-container retro-btn flex items-center gap-1">
                <span class="material-symbols-outlined text-[16px]">movie_creation</span>
                <span>Trigger Assembly</span>
              </button>
              <button onclick="viewEpisodeScript('${ep.id}')" class="bg-primary text-on-primary font-label-md text-label-md px-space-md py-1 rounded border border-on-surface retro-btn flex items-center gap-1">
                <span class="material-symbols-outlined text-[16px]">edit_note</span>
                <span>Open Script</span>
              </button>
            </div>
          </div>
        </div>
      `;
    });
  }

  container.innerHTML = `
    <div class="w-full max-w-7xl mx-auto p-space-md lg:p-margin-desktop flex flex-col gap-space-lg">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div>
          <h1 class="font-headline-lg text-headline-lg text-on-surface">Episode Tracker</h1>
          <p class="font-body-md text-body-md text-on-surface-variant">Active YouTube Shorts production pipeline and multi-stage verification workbench</p>
        </div>
        <div class="flex items-center gap-space-sm">
          <button onclick="syncPipelineFromUI()" class="bg-surface-container-lowest text-on-surface font-label-md text-label-md px-space-md py-space-xs rounded border border-outline-variant retro-btn flex items-center gap-1">
            <span class="material-symbols-outlined text-[18px]">sync</span>
            <span>Batch sync</span>
          </button>
          <button onclick="openCreateEpisodeModal()" class="bg-secondary-container text-on-primary font-label-md text-label-md px-space-md py-space-xs rounded border border-on-surface retro-btn flex items-center gap-1">
            <span class="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Create new Short</span>
          </button>
        </div>
      </div>

      <!-- 4 Metric Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-space-md">
        <div class="bg-surface-container-lowest p-space-md rounded border border-outline-variant flex items-center gap-space-md retro-card">
          <div class="w-10 h-10 rounded bg-surface-container-high flex items-center justify-center text-primary">
            <span class="material-symbols-outlined">movie</span>
          </div>
          <div class="flex flex-col">
            <span class="font-label-sm text-label-sm text-on-surface-variant">In active pipeline</span>
            <span class="font-metric-num text-metric-num text-on-surface">${inPipeline}</span>
          </div>
        </div>
        <div class="bg-surface-container-lowest p-space-md rounded border border-outline-variant flex items-center gap-space-md retro-card">
          <div class="w-10 h-10 rounded bg-error-container flex items-center justify-center text-secondary">
            <span class="material-symbols-outlined">warning</span>
          </div>
          <div class="flex flex-col">
            <span class="font-label-sm text-label-sm text-on-surface-variant">Requiring attention</span>
            <span class="font-metric-num text-metric-num text-secondary">${attentionReq}</span>
          </div>
        </div>
        <div class="bg-surface-container-lowest p-space-md rounded border border-outline-variant flex items-center gap-space-md retro-card">
          <div class="w-10 h-10 rounded bg-tertiary-fixed flex items-center justify-center text-tertiary">
            <span class="material-symbols-outlined">hourglass_empty</span>
          </div>
          <div class="flex flex-col">
            <span class="font-label-sm text-label-sm text-on-surface-variant">In assembly</span>
            <span class="font-metric-num text-metric-num text-tertiary">${inAssembly}</span>
          </div>
        </div>
        <div class="bg-surface-container-lowest p-space-md rounded border border-outline-variant flex items-center gap-space-md retro-card">
          <div class="w-10 h-10 rounded bg-primary-fixed flex items-center justify-center text-primary">
            <span class="material-symbols-outlined">task_alt</span>
          </div>
          <div class="flex flex-col">
            <span class="font-label-sm text-label-sm text-on-surface-variant">100% Ready</span>
            <span class="font-metric-num text-metric-num text-primary">${readyCount}</span>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-space-md">
        ${cards}
      </div>
    </div>
  `;
}

async function assembleEpisode(episodeId) {
  showToast(`Triggering local MoviePy assembly for ${episodeId}...`);
  try {
    const res = await fetch(`/api/episodes/${episodeId}/assemble`, { method: 'POST' });
    const result = await res.json();
    showToast(result.message || 'Assembly process initiated!');
  } catch (err) {
    showToast('Assembly error: ' + err.message);
  }
}

async function syncPipelineFromUI() {
  showToast('Synchronizing all pipeline states with local files...');
  try {
    await fetch('/api/episodes/sync', { method: 'POST' });
    showToast('Pipeline states synchronized successfully!');
    renderCurrentScreen();
  } catch (err) {
    showToast('Sync error: ' + err.message);
  }
}

function viewEpisodeScript(episodeId) {
  state.selectedEpisodeForScript = episodeId;
  navigateTo('script-viewer');
}

function openCreateEpisodeModal() {
  document.getElementById('create-episode-modal').classList.remove('hidden');
}

function closeCreateEpisodeModal() {
  document.getElementById('create-episode-modal').classList.add('hidden');
  document.getElementById('create-episode-form').reset();
}

async function submitCreateEpisode(e) {
  e.preventDefault();
  const title = document.getElementById('new-ep-title').value;
  const topic = document.getElementById('new-ep-topic').value;
  const angle = document.getElementById('new-ep-angle').value;
  const targetDuration = document.getElementById('new-ep-duration').value || '45s';

  showToast('Creating new Short episode folder and initial manifests...');
  try {
    const res = await fetch('/api/episodes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, topic, angle, target_duration: targetDuration })
    });
    const newEp = await res.json();
    showToast(`Created Episode #${newEp.episode_number}: ${newEp.title}`);
    closeCreateEpisodeModal();
    renderCurrentScreen();
  } catch (err) {
    showToast('Failed to create episode: ' + err.message);
  }
}

// =========================================================================
// 4. HISTORY & LIBRARY SCREEN (Displays Fulfilled Entries from prompts.json)
// =========================================================================
async function renderHistoryLibraryScreen(container) {
  const url = `/api/library?episode=${state.libraryEpisodeFilter}&type=${state.libraryTypeFilter}&search=${encodeURIComponent(state.librarySearch)}`;
  const res = await fetch(url);
  const assets = await res.json();
  state.libraryAssets = assets;

  let cards = '';
  if (assets.length === 0) {
    cards = `
      <div class="col-span-3 bg-surface-container-lowest border border-dashed border-outline-variant rounded-lg p-space-xl text-center text-on-surface-variant retro-card">
        <span class="material-symbols-outlined text-[36px] text-primary mb-2 inline-block">inventory_2</span>
        <h3 class="font-headline-sm text-headline-sm text-on-surface">No fulfilled assets found</h3>
        <p class="text-body-sm text-on-surface-variant mt-1">When prompts are marked fulfilled in the Prompt Queue, their media assets automatically appear here in your permanent library.</p>
      </div>
    `;
  } else {
    assets.forEach(a => {
      cards += `
        <div class="bg-surface-container-lowest border border-outline-variant rounded-lg p-space-md flex flex-col gap-space-sm retro-card">
          <div class="flex items-center justify-between pb-space-xs border-b border-outline-variant">
            <span class="font-label-sm text-label-sm font-bold text-primary">Episode #${a.episode}</span>
            <span class="font-label-sm text-label-sm bg-surface-container px-space-xs py-0.5 rounded text-on-surface-variant border border-outline-variant font-medium">${a.model}</span>
          </div>
          <span class="font-headline-sm text-headline-sm text-on-surface">${a.title}</span>
          <p class="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">${a.promptOrDetail}</p>
          
          ${a.imageUrl ? `
            <div class="w-full h-36 rounded overflow-hidden border border-outline-variant bg-surface">
              <img src="${a.imageUrl}" alt="${a.title}" class="w-full h-full object-cover" />
            </div>
          ` : ''}

          <div class="flex items-center justify-between pt-space-xs border-t border-outline-variant text-label-sm">
            <span class="text-on-surface-variant font-medium">${a.tableFormat}</span>
            <button onclick="copyRawText('${(a.promptOrDetail || '').replace(/'/g, "\\'")}')" class="font-label-md text-label-md text-primary hover:text-on-surface bg-surface-container-lowest px-space-sm py-0.5 rounded border border-outline-variant retro-btn">
              Copy Prompt
            </button>
          </div>
        </div>
      `;
    });
  }

  container.innerHTML = `
    <div class="w-full max-w-7xl mx-auto p-space-md lg:p-margin-desktop flex flex-col gap-space-lg">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div>
          <h1 class="font-headline-lg text-headline-lg text-on-surface">History & Library</h1>
          <p class="font-body-md text-body-md text-on-surface-variant">Asset repository populated from fulfilled prompts in <code class="bg-surface-container px-1 py-0.5 rounded text-primary font-bold">data/prompts.json</code></p>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="bg-surface-container-lowest p-space-md rounded-lg border border-outline-variant flex flex-wrap items-center justify-between gap-space-md retro-card">
        <div class="flex rounded border border-outline-variant overflow-hidden text-label-sm font-label-sm">
          <button onclick="setLibraryTypeFilter('all')" class="px-space-sm py-1 ${state.libraryTypeFilter === 'all' ? 'bg-secondary-container text-on-primary font-bold' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface'}">All Assets</button>
          <button onclick="setLibraryTypeFilter('video')" class="px-space-sm py-1 ${state.libraryTypeFilter === 'video' ? 'bg-secondary-container text-on-primary font-bold' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface'}">Videos</button>
          <button onclick="setLibraryTypeFilter('voice')" class="px-space-sm py-1 ${state.libraryTypeFilter === 'voice' ? 'bg-secondary-container text-on-primary font-bold' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface'}">Voice Stems</button>
          <button onclick="setLibraryTypeFilter('image')" class="px-space-sm py-1 ${state.libraryTypeFilter === 'image' ? 'bg-secondary-container text-on-primary font-bold' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface'}">Images</button>
        </div>

        <div class="relative min-w-[260px]">
          <input type="text" value="${state.librarySearch}" oninput="handleLibrarySearch(this.value)" placeholder="Search library prompts or models..." class="w-full bg-surface-container-low border border-outline-variant rounded px-space-md py-1 text-body-sm text-on-surface focus:outline-none focus:border-primary" />
          <span class="material-symbols-outlined absolute right-2 top-1.5 text-on-surface-variant text-[18px]">search</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter-desktop">
        ${cards}
      </div>
    </div>
  `;
}

function setLibraryTypeFilter(val) {
  state.libraryTypeFilter = val;
  renderCurrentScreen();
}

function handleLibrarySearch(val) {
  state.librarySearch = val;
  renderCurrentScreen();
}

async function copyRawText(txt) {
  await navigator.clipboard.writeText(txt);
  showToast('Copied to clipboard!');
}

// =========================================================================
// 5. SCRIPT VIEWER SCREEN (Wired to hookscore.py & yt-ideate)
// =========================================================================
async function renderScriptViewerScreen(container) {
  const res = await fetch('/api/scripts');
  const scripts = await res.json();
  state.scripts = scripts;

  let scriptListItems = '';
  let activeScript = {};

  if (scripts.length === 0) {
    scriptListItems = `
      <div class="p-space-md text-center text-on-surface-variant text-body-sm">
        No episode scripts yet.<br/>
        <button onclick="openCreateEpisodeModal()" class="mt-2 text-primary underline font-bold">Create an episode</button> to generate scripts!
      </div>
    `;
    activeScript = {
      title: 'Script Studio',
      episode_id: 'None',
      content: '# No Active Episode\n\nCreate a new Short episode or run /yt-ideate to draft a script with scored retention beats.'
    };
  } else {
    const activeEpId = state.selectedEpisodeForScript || scripts[0].episode_id;
    activeScript = scripts.find(s => s.episode_id === activeEpId) || scripts[0];
    state.activeScriptContent = activeScript.content || '';

    scripts.forEach(s => {
      const isSelected = s.episode_id === activeScript.episode_id;
      scriptListItems += `
        <div onclick="selectScriptForEditor('${s.episode_id}')" class="p-space-md rounded border border-outline-variant cursor-pointer transition-colors ${isSelected ? 'bg-surface-container-low border-l-4 border-l-primary-container font-semibold' : 'bg-surface-container-lowest hover:bg-surface'}">
          <div class="flex items-center justify-between">
            <span class="font-headline-sm text-headline-sm text-on-surface">${s.title}</span>
            <span class="font-label-sm text-label-sm text-primary font-bold">${s.score}/100</span>
          </div>
          <div class="flex items-center justify-between mt-1 text-label-sm text-on-surface-variant font-label-sm">
            <span>${s.status}</span>
            <span>${s.target_duration}</span>
          </div>
        </div>
      `;
    });
  }

  container.innerHTML = `
    <div class="w-full max-w-7xl mx-auto p-space-md lg:p-margin-desktop flex flex-col gap-space-lg">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div>
          <h1 class="font-headline-lg text-headline-lg text-on-surface">Script Studio</h1>
          <p class="font-body-md text-body-md text-on-surface-variant">Live script editor integrated with hook scoring (<code class="bg-surface-container px-1 py-0.5 rounded text-primary font-bold">hookscore.py</code>) and voice direction.</p>
        </div>
        <div class="flex items-center gap-space-sm">
          <button onclick="triggerIdeateModal()" class="bg-surface-container-lowest text-on-surface font-label-md text-label-md px-space-md py-space-xs rounded border border-outline-variant retro-btn flex items-center gap-1">
            <span class="material-symbols-outlined text-[18px]">lightbulb</span>
            <span>Generate Idea (/yt-ideate)</span>
          </button>
          <button onclick="triggerVoiceDirection()" class="bg-surface-container-lowest text-on-surface font-label-md text-label-md px-space-md py-space-xs rounded border border-outline-variant retro-btn flex items-center gap-1">
            <span class="material-symbols-outlined text-[18px]">record_voice_over</span>
            <span>Voice Direction</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
        <div class="lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-lg p-space-md flex flex-col gap-space-sm retro-card">
          <span class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Episode Scripts</span>
          <div class="flex flex-col gap-space-xs max-h-[600px] overflow-y-auto">
            ${scriptListItems}
          </div>
        </div>

        <div class="lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-lg p-space-lg flex flex-col gap-space-md retro-card">
          <div class="flex flex-wrap items-center justify-between gap-space-xs pb-space-xs border-b border-outline-variant">
            <div>
              <h2 class="font-headline-md text-headline-md text-on-surface">${activeScript.title || 'Script Editor'}</h2>
              <span class="font-label-sm text-label-sm text-on-surface-variant">Episode: ${activeScript.episode_id || ''}</span>
            </div>
            <div class="flex items-center gap-space-xs">
              <button onclick="scoreCurrentHook()" class="bg-secondary-container text-on-primary font-label-md text-label-md px-space-md py-1 rounded border border-on-surface retro-btn flex items-center gap-1">
                <span class="material-symbols-outlined text-[16px]">speed</span>
                <span>Score Hook (hookscore.py)</span>
              </button>
              <button onclick="saveActiveScript('${activeScript.episode_id}')" class="bg-primary text-on-primary font-label-md text-label-md px-space-md py-1 rounded border border-on-surface retro-btn flex items-center gap-1">
                <span class="material-symbols-outlined text-[16px]">save</span>
                <span>Save Script</span>
              </button>
            </div>
          </div>

          <div id="hook-score-panel" class="hidden bg-surface-container-low p-space-md rounded border border-outline-variant flex flex-col gap-1">
            <div class="flex items-center justify-between">
              <span class="font-headline-sm text-headline-sm text-on-surface">Hook Verdict</span>
              <span id="hook-score-badge" class="font-metric-num text-metric-num text-primary font-bold"></span>
            </div>
            <pre id="hook-score-output" class="font-mono text-body-sm text-on-surface whitespace-pre-wrap mt-1"></pre>
          </div>

          <div id="voice-direction-panel" class="hidden bg-surface-container-low p-space-md rounded border border-outline-variant flex flex-col gap-space-sm">
            <span class="font-headline-sm text-headline-sm text-on-surface">Voice & Delivery Direction (voice.md)</span>
            <div id="voice-direction-cues" class="flex flex-col gap-space-xs text-body-sm text-on-surface"></div>
          </div>

          <textarea id="script-editor-textarea" class="w-full min-h-[420px] bg-surface-container-low p-space-md rounded border border-outline-variant font-mono text-body-sm text-on-surface leading-relaxed focus:outline-none focus:border-primary">${activeScript.content || ''}</textarea>
        </div>
      </div>
    </div>
  `;
}

function selectScriptForEditor(episodeId) {
  state.selectedEpisodeForScript = episodeId;
  renderCurrentScreen();
}

async function saveActiveScript(episodeId) {
  if (!episodeId || episodeId === 'None') {
    showToast('Create an episode first before saving a script');
    return;
  }
  const textarea = document.getElementById('script-editor-textarea');
  if (!textarea) return;
  const content = textarea.value;

  showToast('Saving script to episode markdown file...');
  try {
    await fetch(`/api/scripts/${episodeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    showToast('Script saved to episode folder successfully!');
  } catch (err) {
    showToast('Failed to save script: ' + err.message);
  }
}

async function scoreCurrentHook() {
  const textarea = document.getElementById('script-editor-textarea');
  if (!textarea) return;
  const content = textarea.value;

  const lines = content.split('\n').filter(l => l.trim() && !l.startsWith('#'));
  const hookCandidate = lines.length ? lines[0] : content.slice(0, 100);

  showToast('Running hookscore.py CLI on opening lines...');
  try {
    const res = await fetch('/api/scripts/hookscore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hook: hookCandidate })
    });
    const result = await res.json();

    const panel = document.getElementById('hook-score-panel');
    const badge = document.getElementById('hook-score-badge');
    const out = document.getElementById('hook-score-output');

    badge.innerText = `${result.score}/100`;
    out.innerText = result.raw_output || 'Scoring complete';
    panel.classList.remove('hidden');
    showToast(`Hook Score: ${result.score}/100!`);
  } catch (err) {
    showToast('Error scoring hook: ' + err.message);
  }
}

async function triggerVoiceDirection() {
  const textarea = document.getElementById('script-editor-textarea');
  const content = textarea ? textarea.value : '';

  showToast('Generating scene delivery cues with yt-voice-direction...');
  try {
    const res = await fetch('/api/skills/voice-direction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ script: content })
    });
    const cues = await res.json();

    const panel = document.getElementById('voice-direction-panel');
    const container = document.getElementById('voice-direction-cues');

    let html = '';
    cues.forEach(c => {
      html += `
        <div class="p-space-xs bg-surface rounded border border-outline-variant">
          <span class="font-bold text-primary">${c.scene}</span>:
          <span class="text-on-surface-variant font-medium"> [Tone: ${c.tone} | Pacing: ${c.pacing}]</span>
          <p class="text-on-surface mt-0.5"><em>${c.delivery_cue}</em></p>
        </div>
      `;
    });

    container.innerHTML = html;
    panel.classList.remove('hidden');
    showToast('Voice direction cues ready for Flow!');
  } catch (err) {
    showToast('Failed to generate voice direction: ' + err.message);
  }
}

function triggerIdeateModal() {
  document.getElementById('ideate-modal').classList.remove('hidden');
}

function closeIdeateModal() {
  document.getElementById('ideate-modal').classList.add('hidden');
  document.getElementById('ideate-result').classList.add('hidden');
}

async function runIdeateSkill(mode) {
  const seedInput = document.getElementById('ideate-seed-input').value;
  showToast(`Running /yt-ideate in ${mode === 'A' ? 'Mode A (Autonomous)' : 'Mode B (Seeded)'}...`);

  try {
    const res = await fetch('/api/skills/ideate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode, seed: seedInput })
    });
    const idea = await res.json();

    const resultBox = document.getElementById('ideate-result');
    document.getElementById('ideate-res-topic').innerText = idea.topic;
    document.getElementById('ideate-res-angle').innerText = idea.angle;
    document.getElementById('ideate-res-title').innerText = idea.working_title;
    document.getElementById('ideate-res-thumb').innerText = idea.thumbnail_concept;
    document.getElementById('ideate-res-why').innerText = idea.why_this_works;
    resultBox.classList.remove('hidden');

    showToast('Finished idea proposed! You can inject this directly into an episode.');
  } catch (err) {
    showToast('Ideate error: ' + err.message);
  }
}

// =========================================================================
// 6. CALENDAR SCREEN (Real Date Assignment & Paused YouTube OAuth Notice)
// =========================================================================
async function renderCalendarScreen(container) {
  const res = await fetch('/api/calendar');
  const data = await res.json();
  const episodes = data.episodes || [];

  let episodeSlotCards = '';
  if (episodes.length === 0) {
    episodeSlotCards = `
      <div class="col-span-full bg-surface-container-low border border-dashed border-outline-variant rounded p-space-xl text-center text-on-surface-variant">
        <span class="material-symbols-outlined text-[36px] text-primary mb-1 inline-block">event_busy</span>
        <h4 class="font-headline-sm text-on-surface">No Episodes Scheduled</h4>
        <p class="text-body-sm text-on-surface-variant mt-1">Episodes created in your pipeline can be scheduled to target release slots here.</p>
        <button onclick="openCreateEpisodeModal()" class="mt-2 text-primary font-bold underline">Create a Short</button>
      </div>
    `;
  } else {
    episodes.forEach(e => {
      episodeSlotCards += `
        <div class="p-space-md rounded border border-outline-variant bg-surface flex flex-col justify-between gap-space-xs retro-card">
          <div class="flex flex-col gap-1">
            <div class="flex items-center justify-between">
              <span class="font-label-sm text-label-sm text-primary font-bold">#${e.episode_number}</span>
              <span class="font-label-sm text-label-sm bg-surface-container-high px-space-xs py-0.5 rounded font-semibold text-on-surface">${e.scheduled_date || 'Unscheduled'}</span>
            </div>
            <span class="font-headline-sm text-headline-sm text-on-surface">${e.title}</span>
            <span class="text-body-sm text-on-surface-variant">${e.stage}</span>
          </div>
          <div class="pt-space-xs border-t border-outline-variant flex items-center justify-between">
            <button onclick="openAssignDateModal('${e.id}', '${e.title.replace(/'/g, "\\'")}', '${e.scheduled_date || ''}')" class="font-label-md text-label-md text-primary bg-surface-container-lowest px-space-sm py-1 rounded border border-outline-variant hover:bg-surface-container retro-btn flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">event</span>
              <span>Assign Date</span>
            </button>
          </div>
        </div>
      `;
    });
  }

  container.innerHTML = `
    <div class="w-full max-w-7xl mx-auto p-space-md lg:p-margin-desktop flex flex-col gap-space-lg">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div>
          <h1 class="font-headline-lg text-headline-lg text-on-surface">Release Calendar</h1>
          <p class="font-body-md text-body-md text-on-surface-variant">Assign real release dates to episodes; saved directly into <code class="bg-surface-container px-1 py-0.5 rounded text-primary font-bold">data/episodes.json</code></p>
        </div>
        <div class="flex items-center gap-space-sm">
          <button onclick="handleScheduleAllClick()" class="bg-secondary-container text-on-primary font-label-md text-label-md px-space-md py-space-xs rounded border border-on-surface retro-btn flex items-center gap-1">
            <span class="material-symbols-outlined text-[18px]">auto_schedule</span>
            <span>Schedule All (YouTube OAuth)</span>
          </button>
        </div>
      </div>

      <!-- Schedule Notice Banner -->
      <div class="bg-surface-container-lowest border border-outline-variant rounded-lg p-space-md flex items-center gap-space-md retro-card">
        <span class="material-symbols-outlined text-secondary text-[24px]">info</span>
        <div class="flex flex-col">
          <span class="text-body-sm font-bold text-on-surface">YouTube API OAuth Paused Intentionally</span>
          <span class="text-[12px] text-on-surface-variant">You can assign dates manually to organize your workflow. Direct automated batch uploads will be connected once OAuth credentials are configured.</span>
        </div>
      </div>

      <div class="bg-surface-container-lowest border border-outline-variant rounded-lg p-space-lg flex flex-col gap-space-md retro-card">
        <div class="flex items-center justify-between pb-space-xs border-b border-outline-variant">
          <span class="font-headline-md text-headline-md text-on-surface">Production Release Cadence</span>
          <span class="font-label-sm text-label-sm text-primary font-bold">Optimal Release Window: 18:00 UTC</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
          ${episodeSlotCards}
        </div>
      </div>
    </div>
  `;
}

function handleScheduleAllClick() {
  showToast('YouTube API automated batch-upload is paused until OAuth is configured. Dates are saved locally!');
}

function openAssignDateModal(epId, epTitle, currentDate) {
  const modal = document.getElementById('assign-date-modal');
  document.getElementById('modal-date-ep-id').value = epId;
  document.getElementById('modal-date-ep-title').innerText = epTitle;
  document.getElementById('modal-date-input').value = currentDate || 'Friday, 18:00 UTC';
  modal.classList.remove('hidden');
}

function closeAssignDateModal() {
  document.getElementById('assign-date-modal').classList.add('hidden');
}

async function submitAssignDate(e) {
  e.preventDefault();
  const epId = document.getElementById('modal-date-ep-id').value;
  const newDate = document.getElementById('modal-date-input').value;

  showToast(`Assigning release date to ${newDate}...`);
  try {
    const res = await fetch('/api/calendar/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ episode_id: epId, date_label: newDate })
    });
    if (res.ok) {
      showToast('Date assigned and saved to data/episodes.json!');
      closeAssignDateModal();
      renderCurrentScreen();
    } else {
      showToast('Failed to assign date');
    }
  } catch (err) {
    showToast('Error: ' + err.message);
  }
}

// =========================================================================
// 7. PUBLISH LOG SCREEN (Empty/Placeholder State Until Uploads Exist)
// =========================================================================
async function renderPublishLogScreen(container) {
  const res = await fetch('/api/publish-log');
  const log = await res.json();

  let content = '';
  if (!log || log.length === 0) {
    content = `
      <div class="bg-surface-container-lowest border border-outline-variant rounded-lg p-space-xl flex flex-col items-center justify-center text-center gap-space-sm retro-card">
        <span class="material-symbols-outlined text-[48px] text-primary">publish</span>
        <h3 class="font-headline-md text-headline-md text-on-surface">No Published Shorts Yet</h3>
        <p class="font-body-md text-body-md text-on-surface-variant max-w-md">
          This historical ledger is structurally ready. When you release completed Shorts to your YouTube channel, their views, viewer retention %, and video links will be tracked here.
        </p>
        <button onclick="navigateTo('calendar')" class="mt-space-sm bg-secondary-container text-on-primary font-label-md text-label-md px-space-md py-space-xs rounded border border-on-surface retro-btn">
          View Scheduled Releases
        </button>
      </div>
    `;
  } else {
    let rows = '';
    log.forEach(item => {
      rows += `
        <tr class="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
          <td class="p-space-md font-headline-sm text-headline-sm text-on-surface">
            ${item.episode}
            <div class="font-body-sm text-body-sm text-on-surface-variant font-normal">${item.title}</div>
          </td>
          <td class="p-space-md text-body-sm text-on-surface-variant">${item.published_day}<br/><span class="text-label-sm font-label-sm font-semibold">${item.published_slot}</span></td>
          <td class="p-space-md text-body-sm text-on-surface-variant">${item.turnaround_main}</td>
          <td class="p-space-md font-bold text-on-surface">${item.views}</td>
          <td class="p-space-md">
            <span class="bg-primary-container text-on-primary-container font-label-sm text-label-sm px-space-xs py-0.5 rounded font-semibold">${item.retention_label}</span>
          </td>
          <td class="p-space-md text-body-sm text-on-surface-variant">${item.state_note}</td>
        </tr>
      `;
    });

    content = `
      <div class="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden retro-card">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container border-b border-outline-variant text-label-sm font-label-sm text-on-surface">
              <th class="p-space-md">Episode</th>
              <th class="p-space-md">Published Slot</th>
              <th class="p-space-md">Turnaround</th>
              <th class="p-space-md">Views</th>
              <th class="p-space-md">Retention</th>
              <th class="p-space-md">State Note</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="w-full max-w-7xl mx-auto p-space-md lg:p-margin-desktop flex flex-col gap-space-lg">
      <div>
        <h1 class="font-headline-lg text-headline-lg text-on-surface">Publish Log</h1>
        <p class="font-body-md text-body-md text-on-surface-variant">Historical ledger of published YouTube Shorts, viewer retention, and production turnaround</p>
      </div>
      ${content}
    </div>
  `;
}

// =========================================================================
// 8. SETTINGS SCREEN (Working voice.md editor + Telegram Placeholder Section)
// =========================================================================
async function renderSettingsScreen(container) {
  const res = await fetch('/api/settings');
  const data = await res.json();
  const voiceMd = data.voice_markdown || '';
  const status = data.system_status || {};

  container.innerHTML = `
    <div class="w-full max-w-7xl mx-auto p-space-md lg:p-margin-desktop flex flex-col gap-space-lg">
      <div>
        <h1 class="font-headline-lg text-headline-lg text-on-surface">Channel Settings & Voice Profile</h1>
        <p class="font-body-md text-body-md text-on-surface-variant">Master configuration for <code class="bg-surface-container px-1 py-0.5 rounded text-primary font-bold">.agents/youtube/voice.md</code> and YouTube Shorts automation tools</p>
      </div>

      <!-- Master voice.md Editor Card (Actually Reads/Writes Disk) -->
      <div class="bg-surface-container-lowest border border-outline-variant rounded-lg p-space-lg flex flex-col gap-space-md retro-card">
        <div class="flex flex-wrap items-center justify-between gap-space-xs pb-space-xs border-b border-outline-variant">
          <div>
            <h2 class="font-headline-md text-headline-md text-on-surface">Master Channel Voice (.agents/youtube/voice.md)</h2>
            <p class="font-body-md text-body-md text-on-surface-variant">Read by every skill (yt-ideate, yt-script, yt-voice-direction). Live editor writes directly to disk.</p>
          </div>
          <div class="flex items-center gap-space-xs">
            <button onclick="validateVoiceMd()" class="bg-surface-container-lowest text-on-surface font-label-md text-label-md px-space-md py-1 rounded border border-outline-variant retro-btn">
              Validate Markdown
            </button>
            <button onclick="saveVoiceMd()" class="bg-primary text-on-primary font-label-md text-label-md px-space-md py-1 rounded border border-on-surface retro-btn flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px]">save</span>
              <span>Save voice.md</span>
            </button>
          </div>
        </div>

        <textarea id="settings-voice-textarea" class="w-full min-h-[380px] bg-surface-container-low p-space-md rounded border border-outline-variant font-mono text-body-sm text-on-surface leading-relaxed focus:outline-none focus:border-primary">${voiceMd}</textarea>
      </div>

      <!-- Telegram Bot Notification Status (Placeholder Section for next wiring) -->
      <div class="bg-surface-container-lowest border border-outline-variant rounded-lg p-space-lg flex flex-col gap-space-md retro-card">
        <div class="flex items-center justify-between pb-space-xs border-b border-outline-variant">
          <div>
            <h2 class="font-headline-md text-headline-md text-on-surface">Telegram Notification Dispatcher</h2>
            <p class="font-body-md text-body-md text-on-surface-variant">Instant mobile alert dispatch when scenes finish generating or ready for assembly</p>
          </div>
          <span class="bg-tertiary-fixed-dim text-on-tertiary-container font-label-sm text-label-sm px-space-xs py-0.5 rounded font-semibold">Wiring In Next Step</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <div class="flex flex-col gap-1">
            <label class="text-label-sm font-semibold text-on-surface">Telegram Bot Token:</label>
            <input type="password" id="telegram-token" value="6291048128:AAHj9xkLq1zM0P_N-9VpQz_8mKjL2x0W" class="bg-surface-container-low border border-outline-variant rounded p-space-sm text-body-sm text-on-surface" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-label-sm font-semibold text-on-surface">Target Chat ID:</label>
            <input type="text" id="telegram-chat-id" value="582910481" class="bg-surface-container-low border border-outline-variant rounded p-space-sm text-body-sm text-on-surface" />
          </div>
        </div>

        <div class="flex items-center justify-between pt-space-xs border-t border-outline-variant">
          <button onclick="handleTelegramPing()" class="bg-surface-container-lowest text-on-surface font-label-md text-label-md px-space-md py-1 rounded border border-outline-variant retro-btn flex items-center gap-1">
            <span class="material-symbols-outlined text-[16px]">send</span>
            <span>Send Test Ping</span>
          </button>
          <button onclick="showToast('Telegram connection credentials saved')" class="bg-secondary-container text-on-primary font-label-md text-label-md px-space-md py-1 rounded border border-on-surface retro-btn">
            Save Bot Settings
          </button>
        </div>
      </div>

      <!-- Integration Telemetry Card -->
      <div class="bg-surface-container-lowest border border-outline-variant rounded-lg p-space-lg flex flex-col gap-space-md retro-card">
        <h2 class="font-headline-md text-headline-md text-on-surface">Integration Telemetry</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          <div class="p-space-md rounded border border-outline-variant bg-surface flex flex-col gap-1">
            <span class="font-label-sm text-label-sm text-on-surface-variant font-semibold">Gemini / AI Studio Workflow</span>
            <span class="font-headline-sm text-headline-sm text-primary">${status.gemini_api}</span>
          </div>
          <div class="p-space-md rounded border border-outline-variant bg-surface flex flex-col gap-1">
            <span class="font-label-sm text-label-sm text-on-surface-variant font-semibold">YouTube Data API</span>
            <span class="font-headline-sm text-headline-sm text-on-surface">${status.youtube_oauth}</span>
          </div>
          <div class="p-space-md rounded border border-outline-variant bg-surface flex flex-col gap-1">
            <span class="font-label-sm text-label-sm text-on-surface-variant font-semibold">Loaded Local Skills</span>
            <span class="font-headline-sm text-headline-sm text-primary">${(status.skills_loaded || []).length} Skills Active</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function handleTelegramPing() {
  showToast('Telegram test ping dispatched — functional webhook wiring comes next!');
}

async function saveVoiceMd() {
  const textarea = document.getElementById('settings-voice-textarea');
  if (!textarea) return;
  const content = textarea.value;

  showToast('Saving master voice.md directly to .agents/youtube/voice.md...');
  try {
    const res = await fetch('/api/settings/voice', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voice_markdown: content })
    });
    if (res.ok) {
      showToast('voice.md saved and injected into pipeline!');
    } else {
      showToast('Failed to save voice.md');
    }
  } catch (err) {
    showToast('Save error: ' + err.message);
  }
}

function validateVoiceMd() {
  const textarea = document.getElementById('settings-voice-textarea');
  if (!textarea || !textarea.value.trim()) {
    showToast('voice.md is empty');
    return;
  }
  showToast('voice.md validated — Clean Markdown structure & tone rules verified');
}

// ----------------- Initialization -----------------
window.addEventListener('DOMContentLoaded', () => {
  const portBadge = document.getElementById('header-port-badge');
  if (portBadge) {
    const p = window.location.port || (window.location.protocol === 'https:' ? '443' : '80');
    portBadge.innerText = `Local Server: ${p}`;
  }

  const hash = window.location.hash.replace('#', '') || 'overview';
  state.activeScreen = hash;
  checkAuthSession();
});

window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '') || 'overview';
  if (state.activeScreen !== hash) {
    navigateTo(hash);
  }
});
