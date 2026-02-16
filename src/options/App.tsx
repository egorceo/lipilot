import { useState, useEffect } from 'react';
import { getSettings, saveSettings, getPersonaObservations, clearPersonaObservations } from '../utils/storage';
import { testLLMConnection } from '../utils/llm-client';
import type { LLMProvider, UserSettings, LanguageLevel } from '../types';
import { PROVIDER_MODELS, PROVIDER_LABELS, LANGUAGE_LEVEL_OPTIONS } from '../types';

export default function App() {
  const [settings, setSettings] = useState<UserSettings>({
    llmProvider: 'openai',
    apiKey: '',
    model: 'gpt-4o',
    persona: '',
    enableEmojis: false,
    languageLevel: 'fluent',
    enableImageAnalysis: false,
    serviceDescription: '',
  });

  const [observations, setObservations] = useState<{ text: string; timestamp: number }[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; error?: string } | null>(null);

  useEffect(() => {
    getSettings().then((s) => setSettings(s));
    getPersonaObservations().then((obs) => setObservations(obs));
  }, []);

  const handleProviderChange = (provider: LLMProvider) => {
    const models = PROVIDER_MODELS[provider];
    setSettings((prev) => ({
      ...prev,
      llmProvider: provider,
      model: models[0].value,
    }));
    setTestResult(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    await saveSettings(settings);
    setSaveSuccess(true);
    setIsSaving(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    const result = await testLLMConnection(settings.llmProvider, settings.apiKey, settings.model);
    setTestResult(result);
    setIsTesting(false);
  };

  const handleClearObservations = async () => {
    await clearPersonaObservations();
    setObservations([]);
  };

  const currentModels = PROVIDER_MODELS[settings.llmProvider] || [];

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconWrapper}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
            </svg>
          </div>
          <h1 style={styles.title}>LiPilot Settings</h1>
          <p style={styles.subtitle}>Configure your AI-powered LinkedIn assistant</p>
        </div>

        {/* Main Card */}
        <div style={styles.card}>
          {/* LLM Provider */}
          <div style={styles.section}>
            <label style={styles.label}>LLM Provider</label>
            <div style={styles.providerGrid}>
              {(Object.keys(PROVIDER_LABELS) as LLMProvider[]).map((provider) => (
                <button
                  key={provider}
                  onClick={() => handleProviderChange(provider)}
                  style={{
                    ...styles.providerButton,
                    ...(settings.llmProvider === provider ? styles.providerButtonActive : {}),
                  }}
                >
                  {PROVIDER_LABELS[provider]}
                </button>
              ))}
            </div>
          </div>

          {/* API Key */}
          <div style={styles.section}>
            <label style={styles.label}>API Key</label>
            <div style={styles.apiKeyRow}>
              <input
                type="password"
                value={settings.apiKey}
                onChange={(e) => setSettings((prev) => ({ ...prev, apiKey: e.target.value }))}
                placeholder={`Enter your ${PROVIDER_LABELS[settings.llmProvider]} API key`}
                style={styles.input}
              />
              <button
                onClick={handleTestConnection}
                disabled={isTesting || !settings.apiKey}
                style={{
                  ...styles.testButton,
                  opacity: isTesting || !settings.apiKey ? 0.5 : 1,
                }}
              >
                {isTesting ? 'Testing...' : 'Test'}
              </button>
            </div>
            {testResult && (
              <div
                style={{
                  ...styles.testResult,
                  background: testResult.success ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  borderColor: testResult.success ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                  color: testResult.success ? '#4ade80' : '#fca5a5',
                }}
              >
                {testResult.success ? 'Connection successful!' : testResult.error || 'Connection failed'}
              </div>
            )}
          </div>

          {/* Model */}
          <div style={styles.section}>
            <label style={styles.label}>Model</label>
            <select
              value={settings.model}
              onChange={(e) => setSettings((prev) => ({ ...prev, model: e.target.value }))}
              style={styles.select}
            >
              {currentModels.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Divider */}
          <div style={styles.divider} />

          {/* Persona */}
          <div style={styles.section}>
            <label style={styles.label}>Persona</label>
            <p style={styles.hint}>Describe yourself, your role, expertise, and communication style. This helps the AI generate comments that sound like you.</p>
            <textarea
              value={settings.persona}
              onChange={(e) => setSettings((prev) => ({ ...prev, persona: e.target.value }))}
              placeholder="e.g., I'm a startup founder building AI tools for marketing. I speak directly, avoid buzzwords, and love sharing practical insights from my experience..."
              rows={5}
              style={styles.textarea}
            />
          </div>

          {/* Language Level */}
          <div style={styles.section}>
            <label style={styles.label}>Language Level</label>
            <select
              value={settings.languageLevel}
              onChange={(e) => setSettings((prev) => ({ ...prev, languageLevel: e.target.value as LanguageLevel }))}
              style={styles.select}
            >
              {LANGUAGE_LEVEL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} — {opt.description}
                </option>
              ))}
            </select>
          </div>

          {/* Toggles */}
          <div style={styles.section}>
            <div style={styles.toggleRow}>
              <div>
                <div style={styles.toggleLabel}>Enable Emojis</div>
                <div style={styles.toggleHint}>Allow emojis in generated comments</div>
              </div>
              <button
                onClick={() => setSettings((prev) => ({ ...prev, enableEmojis: !prev.enableEmojis }))}
                style={{
                  ...styles.toggle,
                  background: settings.enableEmojis
                    ? 'linear-gradient(135deg, #0a66c2, #00a0dc)'
                    : 'rgba(255,255,255,0.1)',
                }}
              >
                <span
                  style={{
                    ...styles.toggleKnob,
                    transform: settings.enableEmojis ? 'translateX(20px)' : 'translateX(0)',
                  }}
                />
              </button>
            </div>

            <div style={{ ...styles.toggleRow, marginTop: 16 }}>
              <div>
                <div style={styles.toggleLabel}>Image Analysis</div>
                <div style={styles.toggleHint}>Analyze images attached to posts for better context</div>
              </div>
              <button
                onClick={() => setSettings((prev) => ({ ...prev, enableImageAnalysis: !prev.enableImageAnalysis }))}
                style={{
                  ...styles.toggle,
                  background: settings.enableImageAnalysis
                    ? 'linear-gradient(135deg, #0a66c2, #00a0dc)'
                    : 'rgba(255,255,255,0.1)',
                }}
              >
                <span
                  style={{
                    ...styles.toggleKnob,
                    transform: settings.enableImageAnalysis ? 'translateX(20px)' : 'translateX(0)',
                  }}
                />
              </button>
            </div>
          </div>

          {/* Service Description */}
          <div style={styles.section}>
            <label style={styles.label}>Service Description <span style={styles.optional}>(optional)</span></label>
            <p style={styles.hint}>Describe your service or product. When enabled during comment generation, the AI will subtly weave in a mention of your expertise.</p>
            <textarea
              value={settings.serviceDescription}
              onChange={(e) => setSettings((prev) => ({ ...prev, serviceDescription: e.target.value }))}
              placeholder="e.g., We help B2B SaaS companies increase qualified leads by 3x using AI-powered outbound..."
              rows={3}
              style={styles.textarea}
            />
          </div>

          {/* Divider */}
          <div style={styles.divider} />

          {/* Learned Traits */}
          <div style={styles.section}>
            <div style={styles.learnedHeader}>
              <div>
                <label style={styles.label}>Learned Preferences</label>
                <p style={styles.hint}>The AI learns from your edits to improve future suggestions.</p>
              </div>
              {observations.length > 0 && (
                <button onClick={handleClearObservations} style={styles.clearButton}>
                  Clear All
                </button>
              )}
            </div>
            {observations.length === 0 ? (
              <div style={styles.emptyState}>
                No learned preferences yet. The AI will learn as you edit and use its suggestions.
              </div>
            ) : (
              <div style={styles.observationsList}>
                {observations.map((obs, i) => (
                  <div key={i} style={styles.observationItem}>
                    <div style={styles.observationText}>{obs.text}</div>
                    <div style={styles.observationTime}>
                      {new Date(obs.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              ...styles.saveButton,
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Settings'}
          </button>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <span>Supported by </span>
          <a href="https://travel-code.com/" target="_blank" rel="noopener noreferrer" style={styles.footerLink}>
            Travel Code
          </a>
          <span> — AI-powered corporate travel platform</span>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    padding: '48px 16px',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
    fontFamily: "'Inter', 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  wrapper: {
    maxWidth: 640,
    margin: '0 auto',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: 40,
  },
  iconWrapper: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
    borderRadius: 16,
    background: 'linear-gradient(135deg, #0a66c2 0%, #00a0dc 100%)',
    marginBottom: 20,
    boxShadow: '0 8px 32px rgba(10, 102, 194, 0.3)',
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: '#fff',
    margin: '0 0 8px',
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    margin: 0,
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(20px)',
    borderRadius: 20,
    border: '1px solid rgba(255,255,255,0.1)',
    padding: 32,
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#e5e7eb',
    marginBottom: 8,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  hint: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 1.5,
  },
  optional: {
    fontWeight: 400,
    color: '#6b7280',
    fontSize: 11,
    textTransform: 'none' as const,
  },
  providerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 8,
  },
  providerButton: {
    padding: '12px 8px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  providerButtonActive: {
    background: 'rgba(10,102,194,0.2)',
    borderColor: '#0a66c2',
    color: '#60a5fa',
    fontWeight: 600,
  },
  apiKeyRow: {
    display: 'flex',
    gap: 8,
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    fontFamily: 'inherit',
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    background: '#1a1a2e',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    color: '#fff',
    fontSize: 14,
    cursor: 'pointer',
    outline: 'none',
    fontFamily: 'inherit',
  },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    color: '#fff',
    fontSize: 14,
    fontFamily: 'inherit',
    resize: 'vertical' as const,
    lineHeight: 1.6,
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
  testButton: {
    padding: '10px 20px',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 10,
    color: '#fff',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
  },
  testResult: {
    marginTop: 8,
    padding: '8px 12px',
    borderRadius: 8,
    border: '1px solid',
    fontSize: 13,
  },
  divider: {
    height: 1,
    background: 'rgba(255,255,255,0.08)',
    margin: '28px 0',
  },
  toggleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: 500,
    color: '#e5e7eb',
  },
  toggleHint: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    border: 'none',
    cursor: 'pointer',
    position: 'relative' as const,
    transition: 'background 0.2s',
    flexShrink: 0,
  },
  toggleKnob: {
    position: 'absolute' as const,
    top: 2,
    left: 2,
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: '#fff',
    transition: 'transform 0.2s',
    display: 'block',
  },
  learnedHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  clearButton: {
    padding: '6px 12px',
    background: 'transparent',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: 6,
    color: '#ef4444',
    fontSize: 12,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    flexShrink: 0,
    marginTop: 2,
  },
  emptyState: {
    padding: 20,
    textAlign: 'center' as const,
    color: '#6b7280',
    fontSize: 13,
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 10,
    border: '1px dashed rgba(255,255,255,0.1)',
  },
  observationsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 8,
    marginTop: 8,
  },
  observationItem: {
    padding: '10px 12px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.08)',
  },
  observationText: {
    fontSize: 13,
    color: '#d1d5db',
    lineHeight: 1.5,
  },
  observationTime: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 4,
  },
  saveButton: {
    width: '100%',
    padding: '14px 24px',
    background: 'linear-gradient(135deg, #0a66c2 0%, #0077b5 100%)',
    border: 'none',
    borderRadius: 12,
    color: '#fff',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 16px rgba(10, 102, 194, 0.3)',
  },
  footer: {
    marginTop: 32,
    textAlign: 'center' as const,
    fontSize: 13,
    color: '#6b7280',
  },
  footerLink: {
    color: '#9ca3af',
    fontWeight: 600,
    textDecoration: 'none',
  },
};
