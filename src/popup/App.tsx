import { useState, useEffect } from 'react';
import { getSettings } from '../utils/storage';
import { PROVIDER_LABELS } from '../types';
import type { UserSettings } from '../types';

type ConfigStatus = 'loading' | 'configured' | 'missing';

export default function App() {
  const [status, setStatus] = useState<ConfigStatus>('loading');
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [missingItems, setMissingItems] = useState<string[]>([]);

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = async () => {
    try {
      const s = await getSettings();
      setSettings(s);

      const missing: string[] = [];
      if (!s.apiKey || s.apiKey.trim().length === 0) missing.push('API key');
      if (!s.persona || s.persona.trim().length === 0) missing.push('Persona');

      setMissingItems(missing);
      setStatus(missing.length === 0 ? 'configured' : 'missing');
    } catch (error) {
      console.error('Configuration check failed:', error);
      setStatus('missing');
    }
  };

  const openSettings = () => {
    chrome.runtime.openOptionsPage();
  };

  const openLinkedIn = () => {
    chrome.tabs.create({ url: 'https://www.linkedin.com/feed/' });
  };

  const openGitHub = () => {
    chrome.tabs.create({ url: 'https://github.com/egorceo/lipilot' });
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.iconWrapper}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
            </svg>
          </div>
          <div>
            <div style={styles.headerTitle}>LiPilot</div>
            <div style={styles.headerSubtitle}>
              {settings ? `${PROVIDER_LABELS[settings.llmProvider]} / ${settings.model}` : 'AI Comment Assistant'}
            </div>
          </div>
        </div>
        <button onClick={openSettings} style={styles.settingsButton} title="Settings">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {status === 'loading' ? (
          <div style={styles.loadingWrapper}>
            <div style={styles.spinner} />
          </div>
        ) : status === 'configured' ? (
          <>
            {/* Status: Active */}
            <div style={styles.statusBox}>
              <div style={styles.statusIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div>
                <div style={styles.statusTitle}>Active & Ready</div>
                <div style={styles.statusSubtitle}>Extension is configured</div>
              </div>
            </div>

            {/* Open LinkedIn */}
            <button onClick={openLinkedIn} style={styles.primaryButton}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Open LinkedIn
            </button>

            <div style={styles.hintText}>
              Click the AI button on any LinkedIn post to generate comments
            </div>

            {/* Links */}
            <div style={styles.linksSection}>
              <button onClick={openSettings} style={styles.linkButton}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                Settings
              </button>
              <button onClick={openGitHub} style={styles.linkButton}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Status: Setup Required */}
            <div style={{ ...styles.statusBox, background: 'rgba(251, 191, 36, 0.1)', borderColor: 'rgba(251, 191, 36, 0.2)' }}>
              <div style={{ ...styles.statusIcon, background: 'rgba(251, 191, 36, 0.2)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div>
                <div style={{ ...styles.statusTitle, color: '#fbbf24' }}>Setup Required</div>
                <div style={styles.statusSubtitle}>
                  Missing: {missingItems.join(', ')}
                </div>
              </div>
            </div>

            {/* Open Settings */}
            <button onClick={openSettings} style={styles.primaryButton}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              Open Settings
            </button>

            <div style={styles.hintText}>
              Add your API key and persona to start using the extension
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <span>Supported by </span>
        <a href="https://travel-code.com/" target="_blank" rel="noopener noreferrer" style={styles.footerLink}>
          Travel Code
        </a>
        <span> — AI-powered corporate travel</span>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: 320,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    color: '#fff',
    background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: 'linear-gradient(135deg, #0a66c2 0%, #00a0dc 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(10, 102, 194, 0.3)',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 600,
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#6b7280',
  },
  settingsButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: 'rgba(255,255,255,0.05)',
    border: 'none',
    color: '#9ca3af',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
  },
  loadingWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 0',
  },
  spinner: {
    width: 24,
    height: 24,
    border: '2px solid rgba(59,130,246,0.3)',
    borderTopColor: '#3b82f6',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  statusBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    background: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.2)',
    marginBottom: 14,
  },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: 'rgba(34, 197, 94, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statusTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: '#4ade80',
  },
  statusSubtitle: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  primaryButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '10px 16px',
    background: 'linear-gradient(135deg, #0a66c2 0%, #0077b5 100%)',
    border: 'none',
    borderRadius: 10,
    color: '#fff',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(10, 102, 194, 0.3)',
    marginBottom: 10,
  },
  hintText: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center' as const,
    marginBottom: 14,
  },
  linksSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 4,
    borderTop: '1px solid rgba(255,255,255,0.05)',
    paddingTop: 10,
  },
  linkButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 10px',
    background: 'transparent',
    border: 'none',
    borderRadius: 8,
    color: '#9ca3af',
    fontSize: 13,
    cursor: 'pointer',
    textAlign: 'left' as const,
  },
  footer: {
    padding: '10px 16px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    background: 'rgba(0,0,0,0.2)',
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center' as const,
  },
  footerLink: {
    color: '#9ca3af',
    fontWeight: 600,
    textDecoration: 'none',
  },
};
