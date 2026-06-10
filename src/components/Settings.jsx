import { useNavigate } from 'react-router-dom'
import { useTheme, THEMES } from '../context/ThemeContext'
import './Settings.css'

export default function Settings() {
  const { themeKey, setThemeKey, theme } = useTheme()
  const navigate = useNavigate()

  return (
    <div className="settings">

      <div className="settings-section">
        <div className="settings-section-title">Profile</div>
        <div className="profile-row">
          <div className="avatar-lg" style={{ background: theme.accent, color: theme.accentText }}>AJ</div>
          <div className="avatar-info">
            <h3>AJ Hazime</h3>
            <p>aj@university.edu</p>
          </div>
        </div>
        <div className="settings-field">
          <label>Username</label>
          <input type="text" defaultValue="ajhazime" />
        </div>
        <div className="settings-field">
          <label>Email</label>
          <input type="email" defaultValue="aj@university.edu" />
        </div>
        <div className="settings-row">
          <button className="btn-save" style={{ background: theme.accent, color: theme.accentText }}>
            Save changes
          </button>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-title">Change password</div>
        <div className="settings-field">
          <label>Current password</label>
          <input type="password" placeholder="••••••••" />
        </div>
        <div className="settings-field">
          <label>New password</label>
          <input type="password" placeholder="••••••••" />
        </div>
        <div className="settings-field">
          <label>Confirm new password</label>
          <input type="password" placeholder="••••••••" />
        </div>
        <div className="settings-row">
          <button className="btn-save" style={{ background: theme.accent, color: theme.accentText }}>
            Update password
          </button>
          <button className="btn-ghost">Cancel</button>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-title">Theme</div>
        <div className="theme-grid">
          {Object.entries(THEMES).map(([key, t]) => (
            <div
              key={key}
              className={`theme-card ${themeKey === key ? 'active' : ''}`}
              onClick={() => setThemeKey(key)}
            >
              <div className="theme-preview" style={{ background: t.gradient }} />
              <div className="theme-label">
                <div className="theme-name">{t.name}</div>
              </div>
              {themeKey === key && <div className="theme-check">✓</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-title">Account</div>
        <div className="signout-row">
          <div>
            <div className="signout-title">Sign out</div>
            <div className="signout-sub">You'll be returned to the login screen</div>
          </div>
          <button className="btn-danger" onClick={() => navigate('/')}>Sign out</button>
        </div>
      </div>

    </div>
  )
}