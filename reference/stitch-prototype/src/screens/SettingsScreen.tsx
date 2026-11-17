import React, { useState } from 'react';

interface SettingsScreenProps {
  onShowToast: (msg: string) => void;
}

const DEFAULT_VOICE_MD = `# Pegboard Channel Voice Guidelines
- Tone: Energetic, mathematically precise, enthusiastic puzzle nerd with deadpan comedic delivery on absurd fails.
- Pacing: 165 words per minute. Never pause longer than 0.3s between sentences.
- Hook Formula: Question or impossible premise in 0:00 - 0:02. Immediate visual proof in 0:02 - 0:04.
- Speedcubing terminology: Use official WCA terms (F2L, OLL, PLL, God's Number, TPS). Never explain what a standard 3x3 is.
- Prohibited words: Do not use "Hey guys", "Smash that like button", or "In today's video".`;

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onShowToast }) => {
  const [showBotToken, setShowBotToken] = useState(false);
  const [botToken, setBotToken] = useState('6291048128:AAHj9xkLq1zM0P_N-9VpQz_8mKjL2x0W');
  const [chatId, setChatId] = useState('582910481');
  const [pingSent, setPingSent] = useState(false);
  const [botSaved, setBotSaved] = useState(false);

  const [voiceMarkdown, setVoiceMarkdown] = useState(DEFAULT_VOICE_MD);
  const [validatedMd, setValidatedMd] = useState(false);
  const [voiceSaved, setVoiceSaved] = useState(false);

  const [refreshingConnections, setRefreshingConnections] = useState(false);

  const handleSendPing = () => {
    setPingSent(true);
    onShowToast(`Telegram ping dispatched to Alex Solves (ID: ${chatId})`);
    setTimeout(() => setPingSent(false), 3500);
  };

  const handleSaveBot = () => {
    setBotSaved(true);
    onShowToast('Telegram bot configuration saved');
    setTimeout(() => setBotSaved(false), 2200);
  };

  const handleValidateMarkdown = () => {
    setValidatedMd(true);
    onShowToast('voice.md validated — Clean syntax & valid Markdown');
    setTimeout(() => setValidatedMd(false), 2500);
  };

  const handleSaveVoiceMd = () => {
    setVoiceSaved(true);
    onShowToast('Master voice.md saved and injected into pipeline');
    setTimeout(() => setVoiceSaved(false), 2200);
  };

  const handleRefreshConnections = () => {
    setRefreshingConnections(true);
    onShowToast('Refreshed all 5 pipeline integration heartbeats');
    setTimeout(() => setRefreshingConnections(false), 1200);
  };

  return (
    <div className="flex flex-col w-full p-space-md lg:p-margin-desktop gap-space-lg max-w-7xl mx-auto">
      {/* Workbench Header Strip */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pb-space-sm border-b border-outline-variant">
        <div className="flex flex-col">
          <h1 className="font-headline-lg text-headline-lg text-on-surface">
            Station settings &amp; pipeline config
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Calibrate automated alert relays, the master prompt persona, and external API
            connectors.
          </p>
        </div>
        <div className="flex items-center gap-space-sm self-start md:self-auto">
          <span className="font-label-sm text-label-sm px-space-sm py-space-xs bg-surface-container-high text-on-surface rounded border border-outline-variant">
            Profile: Cube Shorts Lab
          </span>
          <span className="font-label-sm text-label-sm px-space-sm py-space-xs bg-surface-container text-primary font-semibold rounded border border-outline-variant">
            Sync active
          </span>
        </div>
      </div>

      {/* Section 1: Telegram Bot Connection (Coral Left Tape) */}
      <section className="flex flex-col bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm relative pl-1.5">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-secondary-container"></div>
        <div className="p-space-lg flex flex-col gap-space-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm border-b border-outline-variant">
            <div className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-on-surface">
                <span className="material-symbols-outlined text-[20px]">send</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                  Notification setup (Telegram bot connection)
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Real-time alerts piped directly to your mobile Telegram client during batch
                  production.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-space-xs px-space-sm py-space-xs bg-surface-container-low rounded border border-outline-variant self-start sm:self-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-container inline-block"></span>
              <span className="font-label-md text-label-md text-on-surface">
                Connected as @PegboardAlertsBot
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-space-xs">
            {/* Input Bot Token */}
            <div className="flex flex-col gap-space-xs">
              <label
                className="font-label-md text-label-md text-on-surface flex justify-between"
                htmlFor="telegram-token"
              >
                <span>Bot token</span>
                <span className="text-on-surface-variant font-normal">HTTP API key</span>
              </label>
              <div className="relative flex items-center">
                <input
                  className="w-full px-space-sm py-space-xs pr-10 bg-surface-container-lowest border border-on-surface rounded font-body-md text-on-surface focus:outline-none focus:border-primary-container"
                  id="telegram-token"
                  type={showBotToken ? 'text' : 'password'}
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                />
                <button
                  aria-label="Toggle token visibility"
                  onClick={() => setShowBotToken((v) => !v)}
                  className="absolute right-2 text-on-surface-variant hover:text-on-surface p-1 flex items-center justify-center"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]" id="token-icon">
                    {showBotToken ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Input Chat ID */}
            <div className="flex flex-col gap-space-xs">
              <label
                className="font-label-md text-label-md text-on-surface flex justify-between"
                htmlFor="creator-chat-id"
              >
                <span>Creator chat ID</span>
                <span className="text-on-surface-variant font-normal">Direct personal ID</span>
              </label>
              <input
                className="w-full px-space-sm py-space-xs bg-surface-container-lowest border border-on-surface rounded font-body-md text-on-surface focus:outline-none focus:border-primary-container"
                id="creator-chat-id"
                type="text"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
              />
            </div>
          </div>

          {/* Trigger Checkboxes */}
          <div className="flex flex-col gap-space-xs pt-space-xs">
            <span className="font-label-md text-label-md text-on-surface mb-1">
              Active event dispatchers
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
              <label className="flex items-center gap-space-sm p-space-sm bg-surface-container-low rounded border border-outline-variant cursor-pointer select-none">
                <input
                  defaultChecked
                  className="w-4 h-4 rounded border-on-surface text-primary-container focus:ring-0 accent-primary-container"
                  type="checkbox"
                />
                <span className="font-body-md text-body-md text-on-surface">
                  Alert on AI render completion
                </span>
              </label>
              <label className="flex items-center gap-space-sm p-space-sm bg-surface-container-low rounded border border-outline-variant cursor-pointer select-none">
                <input
                  defaultChecked
                  className="w-4 h-4 rounded border-on-surface text-primary-container focus:ring-0 accent-primary-container"
                  type="checkbox"
                />
                <span className="font-body-md text-body-md text-on-surface">
                  Alert when hook review is required
                </span>
              </label>
              <label className="flex items-center gap-space-sm p-space-sm bg-surface-container-low rounded border border-outline-variant cursor-pointer select-none">
                <input
                  defaultChecked
                  className="w-4 h-4 rounded border-on-surface text-primary-container focus:ring-0 accent-primary-container"
                  type="checkbox"
                />
                <span className="font-body-md text-body-md text-on-surface">
                  Daily morning triage summary at 08:00 UTC
                </span>
              </label>
              <label className="flex items-center gap-space-sm p-space-sm bg-surface-container-low rounded border border-outline-variant cursor-pointer select-none">
                <input
                  defaultChecked
                  className="w-4 h-4 rounded border-on-surface text-primary-container focus:ring-0 accent-primary-container"
                  type="checkbox"
                />
                <span className="font-body-md text-body-md text-on-surface">
                  Emergency alert if scheduled drop has missing assets within 4 hours
                </span>
              </label>
            </div>
          </div>

          {/* Section Actions */}
          <div className="flex flex-wrap items-center justify-between gap-space-md pt-space-sm border-t border-outline-variant mt-space-xs">
            <button
              onClick={handleSendPing}
              className="bg-surface-container-lowest text-on-surface font-label-md text-label-md px-space-md py-space-xs rounded border border-on-surface shadow-[2px_2px_0px_#0c1f19] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-space-xs"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">notifications_active</span>
              <span>Send test ping</span>
            </button>
            {pingSent && (
              <div
                className="text-primary font-label-sm text-label-sm flex items-center gap-1"
                id="ping-status"
              >
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Telegram ping dispatched to Alex Solves (ID: {chatId})</span>
              </div>
            )}
            <button
              onClick={handleSaveBot}
              className="bg-secondary-container text-on-primary font-label-md text-label-md px-space-md py-space-xs rounded border border-on-surface shadow-[2px_2px_0px_#0c1f19] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all ml-auto"
              type="button"
            >
              {botSaved ? 'Configuration saved ✓' : 'Save bot configuration'}
            </button>
          </div>
        </div>
      </section>

      {/* Section 2: voice.md Text Editor (Teal Left Tape) */}
      <section className="flex flex-col bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm relative pl-1.5">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-container"></div>
        <div className="p-space-lg flex flex-col gap-space-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm border-b border-outline-variant">
            <div className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-on-surface">
                <span className="material-symbols-outlined text-[20px]">record_voice_over</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                  Master voice &amp; style guidelines (voice.md)
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Injected into every script generation prompt and ElevenLabs voice delivery
                  instruction.
                </p>
              </div>
            </div>
            <span className="font-label-sm text-label-sm px-space-sm py-space-xs bg-surface-container text-on-surface-variant rounded border border-outline-variant self-start sm:self-auto">
              Markdown v2.4
            </span>
          </div>

          {/* Editor Panel Frame */}
          <div className="flex flex-col border border-on-surface rounded bg-surface-container-low overflow-hidden">
            {/* Editor Header Bar */}
            <div className="flex items-center justify-between px-space-md py-space-xs bg-surface-container border-b border-outline-variant">
              <div className="flex items-center gap-space-xs text-on-surface">
                <span className="material-symbols-outlined text-[16px] text-primary">
                  description
                </span>
                <label htmlFor="voice-markdown-area" className="font-label-md text-label-md">
                  voice.md
                </label>
                <span className="text-on-surface-variant font-body-sm text-body-sm ml-2">
                  UTF-8 / 5 constraints active
                </span>
              </div>
              <div className="flex items-center gap-space-xs">
                <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Validated syntax
                </span>
              </div>
            </div>
            {/* Editor Surface */}
            <div className="relative p-space-md bg-surface-container-lowest">
              <textarea
                className="w-full bg-transparent font-body-md text-body-md text-on-surface resize-y focus:outline-none leading-relaxed border-0 p-0"
                id="voice-markdown-area"
                rows={10}
                spellCheck={false}
                value={voiceMarkdown}
                onChange={(e) => setVoiceMarkdown(e.target.value)}
              />
            </div>
            {/* Editor Mini Status Footer */}
            <div className="px-space-md py-space-xs bg-surface-container-low border-t border-outline-variant flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Tokens consumed per script prompt: ~142 tokens
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Target speed: 165 WPM
              </span>
            </div>
          </div>

          {/* Editor Actions */}
          <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs">
            <div className="flex items-center gap-space-sm">
              <button
                onClick={() => {
                  setVoiceMarkdown(DEFAULT_VOICE_MD);
                  onShowToast('Reverted voice.md to default template');
                }}
                className="bg-surface-container-lowest text-on-surface font-label-md text-label-md px-space-md py-space-xs rounded border border-on-surface shadow-[2px_2px_0px_#0c1f19] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                type="button"
              >
                Revert to default
              </button>
              <button
                onClick={handleValidateMarkdown}
                className="bg-surface-container-lowest text-on-surface font-label-md text-label-md px-space-md py-space-xs rounded border border-on-surface shadow-[2px_2px_0px_#0c1f19] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-space-xs"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">spellcheck</span>
                <span>Validate markdown</span>
              </button>
              {validatedMd && (
                <span
                  className="text-primary font-label-sm text-label-sm font-semibold"
                  id="validate-pill"
                >
                  Clean syntax &amp; valid Markdown
                </span>
              )}
            </div>
            <button
              onClick={handleSaveVoiceMd}
              className="bg-secondary-container text-on-primary font-label-md text-label-md px-space-md py-space-xs rounded border border-on-surface shadow-[2px_2px_0px_#0c1f19] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              type="button"
            >
              {voiceSaved ? 'Saved voice.md ✓' : 'Save voice.md'}
            </button>
          </div>
        </div>
      </section>

      {/* Section 3: Connection-status indicators for pipeline integrations (Yellow Left Tape) */}
      <section className="flex flex-col bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm relative pl-1.5">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-tertiary-fixed-dim"></div>
        <div className="p-space-lg flex flex-col gap-space-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm border-b border-outline-variant">
            <div className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-on-surface">
                <span className="material-symbols-outlined text-[20px]">hub</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                  Connection-status indicators for pipeline integrations
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Live telemetry and authorization heartbeat across active synthesis engines.
                </p>
              </div>
            </div>
            <button
              onClick={handleRefreshConnections}
              className="bg-surface-container-lowest text-on-surface font-label-md text-label-md px-space-md py-space-xs rounded border border-on-surface shadow-[2px_2px_0px_#0c1f19] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-space-xs self-start sm:self-auto"
              type="button"
            >
              <span
                className={`material-symbols-outlined text-[16px] ${
                  refreshingConnections ? 'animate-spin' : ''
                }`}
                id="refresh-spinner"
              >
                sync
              </span>
              <span>
                {refreshingConnections ? 'Refreshing...' : 'Refresh all connections'}
              </span>
            </button>
          </div>

          {/* Integrations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md pt-space-xs">
            {/* Card 1: YouTube Data API v3 */}
            <div className="flex flex-col p-space-md bg-surface-container-low rounded border border-outline-variant justify-between gap-space-sm">
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface">
                    YouTube Data API v3
                  </span>
                  <div className="flex items-center gap-1.5 px-space-xs py-0.5 rounded bg-surface-container-lowest border border-outline-variant">
                    <span className="w-2 h-2 rounded-full bg-primary-container inline-block"></span>
                    <span className="font-label-sm text-label-sm text-primary">
                      Connected &amp; authorized
                    </span>
                  </div>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Channel: Alex Solves (420k subs)
                </span>
              </div>
              <div className="flex flex-col gap-1 pt-space-xs border-t border-outline-variant">
                <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                  <span>Daily quota utilization</span>
                  <span className="font-semibold text-on-surface">18% used</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary-container" style={{ width: '18%' }}></div>
                </div>
              </div>
            </div>

            {/* Card 2: ElevenLabs Audio API */}
            <div className="flex flex-col p-space-md bg-surface-container-low rounded border border-outline-variant justify-between gap-space-sm">
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface">
                    ElevenLabs Audio API
                  </span>
                  <div className="flex items-center gap-1.5 px-space-xs py-0.5 rounded bg-surface-container-lowest border border-outline-variant">
                    <span className="w-2 h-2 rounded-full bg-primary-container inline-block"></span>
                    <span className="font-label-sm text-label-sm text-primary">Connected</span>
                  </div>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Active voice: Adam - Snappy Narrator
                </span>
              </div>
              <div className="flex items-center justify-between pt-space-xs border-t border-outline-variant font-label-sm text-label-sm">
                <span className="text-on-surface-variant">Allocated balance</span>
                <span className="font-semibold text-on-surface">48,200 credits remaining</span>
              </div>
            </div>

            {/* Card 3: Runway Gen-3 Video API */}
            <div className="flex flex-col p-space-md bg-surface-container-low rounded border border-outline-variant justify-between gap-space-sm">
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface">
                    Runway Gen-3 Video API
                  </span>
                  <div className="flex items-center gap-1.5 px-space-xs py-0.5 rounded bg-surface-container-lowest border border-outline-variant">
                    <span className="w-2 h-2 rounded-full bg-primary-container inline-block"></span>
                    <span className="font-label-sm text-label-sm text-primary">Connected</span>
                  </div>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  High-motion visual generation
                </span>
              </div>
              <div className="flex items-center justify-between pt-space-xs border-t border-outline-variant font-label-sm text-label-sm">
                <span className="text-on-surface-variant">Rendering pipe</span>
                <span className="font-semibold text-on-surface">2 active jobs</span>
              </div>
            </div>

            {/* Card 4: Midjourney / Imagine API */}
            <div className="flex flex-col p-space-md bg-surface-container-low rounded border border-outline-variant justify-between gap-space-sm">
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface">
                    Midjourney / Imagine API
                  </span>
                  <div className="flex items-center gap-1.5 px-space-xs py-0.5 rounded bg-surface-container-lowest border border-outline-variant">
                    <span className="w-2 h-2 rounded-full bg-primary-container inline-block"></span>
                    <span className="font-label-sm text-label-sm text-primary">
                      Standby / Healthy
                    </span>
                  </div>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Thumbnail &amp; overlay assets node
                </span>
              </div>
              <div className="flex items-center justify-between pt-space-xs border-t border-outline-variant font-label-sm text-label-sm">
                <span className="text-on-surface-variant">Cluster latency</span>
                <span className="font-semibold text-on-surface">184 ms</span>
              </div>
            </div>

            {/* Card 5: Google Drive Backup */}
            <div className="flex flex-col p-space-md bg-surface-container-low rounded border border-outline-variant justify-between gap-space-sm">
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface">
                    Google Drive Backup
                  </span>
                  <div className="flex items-center gap-1.5 px-space-xs py-0.5 rounded bg-surface-container-lowest border border-outline-variant">
                    <span className="w-2 h-2 rounded-full bg-primary-container inline-block"></span>
                    <span className="font-label-sm text-label-sm text-primary">Syncing</span>
                  </div>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Shorts master project archive
                </span>
              </div>
              <div className="flex items-center justify-between pt-space-xs border-t border-outline-variant font-label-sm text-label-sm">
                <span className="text-on-surface-variant">Incremental sync</span>
                <span className="font-semibold text-on-surface">
                  Last sync: {refreshingConnections ? 'Just now' : '12 minutes ago'}
                </span>
              </div>
            </div>

            {/* Card 6: Pipeline Health Card / Telemetry summary */}
            <div className="flex flex-col p-space-md bg-surface-container rounded border border-outline-variant justify-between gap-space-sm">
              <div className="flex flex-col gap-space-xs">
                <span className="font-label-md text-label-md text-on-surface">
                  Overall pipeline gateway
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  5 of 5 operational bridges functioning with optimal throughput.
                </p>
              </div>
              <div className="flex items-center gap-space-sm pt-space-xs border-t border-outline-variant">
                <span className="font-label-sm text-label-sm font-semibold text-primary">
                  All relays green
                </span>
                <span className="text-on-surface-variant font-body-sm text-body-sm">
                  Zero critical errors logged
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
