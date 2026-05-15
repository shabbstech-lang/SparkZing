import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

export type TextStyle = 'sans' | 'serif' | 'mono' | 'grotesk' | 'rounded';
export type TextColor = 'charcoal' | 'brown' | 'navy' | 'emerald' | 'slate';

interface ThemeSettings {
  textStyle: TextStyle;
  textColor: TextColor;
}

interface ThemeContextType {
  settings: ThemeSettings;
  updateSettings: (newSettings: Partial<ThemeSettings>) => Promise<void>;
  loading: boolean;
}

const defaultSettings: ThemeSettings = {
  textStyle: 'sans',
  textColor: 'charcoal'
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'theme'), (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.data() as ThemeSettings);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'settings/theme');
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const updateSettings = async (newSettings: Partial<ThemeSettings>) => {
    try {
      const updated = { ...settings, ...newSettings };
      await setDoc(doc(db, 'settings', 'theme'), updated);
      setSettings(updated);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/theme');
    }
  };

  return (
    <ThemeContext.Provider value={{ settings, updateSettings, loading }}>
        <div className={`theme-${settings.textStyle} color-${settings.textColor}`}>
            {children}
        </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
