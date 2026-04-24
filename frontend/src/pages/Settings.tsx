import { useTheme } from '../context/ThemeContext';
import { Bell, Globe, Shield, ChevronRight, Palette } from 'lucide-react';
export function Settings() {
  const {
    theme,
    setTheme
  } = useTheme();
  const themes = [{
    id: 'light',
    name: 'Light',
    description: 'Clean and bright',
    colors: ['#fdfcfa', '#d4af37', '#1a1614']
  }, {
    id: 'dark',
    name: 'Dark',
    description: 'Easy on the eyes',
    colors: ['#1a1a1a', '#d4af37', '#f3f3f3']
  }, {
    id: 'warm',
    name: 'Warm',
    description: 'Cozy and inviting',
    colors: ['#fef6e4', '#c17817', '#2d1b00']
  }, {
    id: 'cool',
    name: 'Cool',
    description: 'Calm and serene',
    colors: ['#f0f4f8', '#5a8fa8', '#1e3a4c']
  }];
  return <div className="min-h-screen pt-24 pb-12 bg-bg-light dark:bg-bg-dark px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl font-bold text-text-primary mb-8">
          Settings
        </h1>

        <div className="bg-bg-card dark:bg-bg-card rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
          {/* Theme Selection */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-5 h-5 text-accent" />
              <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider">
                Theme
              </h2>
            </div>
            <p className="text-sm text-text-secondary mb-6">
              Choose your preferred color theme for the website
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {themes.map(t => <button key={t.id} onClick={() => setTheme(t.id as any)} className={`p-4 rounded-lg border-2 transition-all text-left ${theme === t.id ? 'border-accent bg-accent/5' : 'border-gray-200 dark:border-gray-700 hover:border-accent/50'}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex gap-1">
                      {t.colors.map((color, idx) => <div key={idx} className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600" style={{
                    backgroundColor: color
                  }} />)}
                    </div>
                  </div>
                  <p className="font-medium text-text-primary mb-1">{t.name}</p>
                  <p className="text-xs text-text-secondary">{t.description}</p>
                </button>)}
            </div>
          </div>

          {/* Notifications */}
          <div className="p-6">
            <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">
              Preferences
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-text-secondary" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      Push Notifications
                    </p>
                    <p className="text-xs text-text-muted">
                      Receive updates about your orders
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-text-secondary" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      Email Newsletter
                    </p>
                    <p className="text-xs text-text-muted">
                      Get updates on new collections
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>
            </div>
          </div>

          {/* General */}
          <div className="p-6">
            <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">
              General
            </h2>
            <div className="space-y-1">
              <button className="w-full flex items-center justify-between py-3 px-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-text-secondary" />
                  <span className="text-sm font-medium text-text-primary">
                    Language
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-text-secondary">English</span>
                  <ChevronRight className="w-4 h-4 text-text-muted" />
                </div>
              </button>

              <button className="w-full flex items-center justify-between py-3 px-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-text-secondary" />
                  <span className="text-sm font-medium text-text-primary">
                    Privacy & Security
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-text-muted" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
}
// Helper component for icon
function Mail({
  className
}: {
  className?: string;
}) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>;
}