import { useTheme, TextStyle, TextColor } from '@/contexts/ThemeContext';
import { motion } from 'motion/react';
import { Type, Palette, Save, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

const fontOptions: { id: TextStyle; name: string; preview: string; description: string }[] = [
  { id: 'sans', name: 'Modern Sans', preview: 'Inter', description: 'Clean, professional and accessible.' },
  { id: 'serif', name: 'Elegant Serif', preview: 'Fraunces', description: 'Sophisticated and luxury food feel.' },
  { id: 'mono', name: 'Technical Mono', preview: 'JetBrains', description: 'Modern, precise and technical.' },
  { id: 'grotesk', name: 'Space Grotesk', preview: 'Space', description: 'Bold and futuristic aesthetic.' },
  { id: 'rounded', name: 'Soft Rounded', preview: 'Outfit', description: 'Friendly, warm and organic.' },
];

const colorOptions: { id: TextColor; name: string; hex: string }[] = [
  { id: 'charcoal', name: 'Deep Charcoal', hex: '#1A1A1A' },
  { id: 'brown', name: 'Artisanal Brown', hex: '#5D4037' },
  { id: 'navy', name: 'Midnight Navy', hex: '#1A237E' },
  { id: 'emerald', name: 'Forest Emerald', hex: '#064E3B' },
  { id: 'slate', name: 'Slate Gray', hex: '#334155' },
];

export function AdminSettings() {
  const { settings, updateSettings, loading } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  // Sync local settings when context settings load
  useEffect(() => {
    if (!loading) {
      setLocalSettings(settings);
    }
  }, [loading, settings]);

  if (loading) return <div>Loading settings...</div>;

  const handleSave = async () => {
    setIsSaving(true);
    await updateSettings(localSettings);
    setIsSaving(false);
  };

  return (
    <div className="max-w-4xl space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Storefront Design</h1>
          <p className="text-slate-500 mt-1">Customize how your store looks to your customers.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-3 bg-spark-orange text-white rounded-xl text-sm font-black uppercase tracking-widest hover:brightness-110 shadow-lg shadow-orange-200 transition-all flex items-center gap-3 disabled:opacity-50"
        >
          {isSaving ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? 'Applying...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Font Selection */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-slate-400">
            <Type className="w-5 h-5" />
            <h3 className="text-xs font-bold uppercase tracking-widest">Typography Styles</h3>
          </div>
          
          <div className="space-y-3">
            {fontOptions.map((font) => (
              <button
                key={font.id}
                onClick={() => setLocalSettings(prev => ({ ...prev, textStyle: font.id }))}
                className={cn(
                  "w-full p-4 rounded-2xl border-2 transition-all text-left flex items-center justify-between group",
                  localSettings.textStyle === font.id 
                    ? "bg-orange-50 border-spark-orange" 
                    : "bg-white border-slate-100 hover:border-slate-200"
                )}
              >
                <div>
                  <p className={cn(
                    "text-lg font-bold mb-0.5",
                    font.id === 'sans' && 'font-sans',
                    font.id === 'serif' && 'font-serif',
                    font.id === 'mono' && 'font-mono',
                    font.id === 'grotesk' && 'font-grotesk',
                    font.id === 'rounded' && 'font-rounded',
                  )}>
                    {font.name}
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">{font.description}</p>
                </div>
                {localSettings.textStyle === font.id && (
                  <div className="w-6 h-6 bg-spark-orange rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-slate-400">
            <Palette className="w-5 h-5" />
            <h3 className="text-xs font-bold uppercase tracking-widest">Primary Text Color</h3>
          </div>
          
          <div className="space-y-3">
            {colorOptions.map((color) => (
              <button
                key={color.id}
                onClick={() => setLocalSettings(prev => ({ ...prev, textColor: color.id }))}
                className={cn(
                  "w-full p-4 rounded-2xl border-2 transition-all text-left flex items-center justify-between",
                  localSettings.textColor === color.id 
                    ? "bg-orange-50 border-spark-orange" 
                    : "bg-white border-slate-100 hover:border-slate-200"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl" style={{ backgroundColor: color.hex }} />
                  <div>
                    <p className="text-sm font-bold text-slate-700">{color.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono tracking-widest">{color.hex}</p>
                  </div>
                </div>
                {localSettings.textColor === color.id && (
                  <div className="w-6 h-6 bg-spark-orange rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Preview Card */}
      <div className="mt-12">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Live Preview (Before Saving)</h3>
        <div 
          className="p-12 rounded-[3rem] bg-white border border-slate-100 shadow-xl"
          style={{ 
            fontFamily: `var(--font-${localSettings.textStyle})`,
            color: localSettings.textColor === 'charcoal' ? '#1A1A1A' : 
                   localSettings.textColor === 'brown' ? '#5D4037' : 
                   localSettings.textColor === 'navy' ? '#1A237E' : 
                   localSettings.textColor === 'emerald' ? '#064E3B' : '#334155'
          }}
        >
            <h2 className="text-4xl font-black italic mb-4">Sample Heading</h2>
            <p className="text-lg opacity-80 leading-relaxed max-w-md">
                This is how your storefront text will appear to customers. 
                Experience a blend of artisanal tradition and modern design.
            </p>
            <div className="mt-8 flex gap-4">
                <div className="h-2 w-12 bg-spark-orange rounded-full" />
                <div className="h-2 w-6 bg-spark-lime rounded-full" />
            </div>
            <p className="mt-6 text-[10px] font-bold uppercase tracking-widest opacity-50">
              Style: {localSettings.textStyle} | Color: {localSettings.textColor}
            </p>
        </div>
      </div>
    </div>
  );
}
