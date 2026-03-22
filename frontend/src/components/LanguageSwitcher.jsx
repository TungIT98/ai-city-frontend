/**
 * LanguageSwitcher - EN/VN language toggle component
 * Part of Phase 7: Internationalization (AIC-703)
 */
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
];

export function LanguageSwitcher({ style = {} }) {
  const { i18n } = useTranslation();
  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(nextLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      aria-label={`Current language: ${currentLang.label}. Click to switch.`}
      title={`Switch to ${i18n.language === 'en' ? 'Tiếng Việt' : 'English'}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 0.75rem',
        background: 'transparent',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        cursor: 'pointer',
        color: 'var(--text-primary)',
        fontSize: '0.8125rem',
        fontWeight: 500,
        ...style,
      }}
    >
      <Globe size={16} aria-hidden="true" />
      <span style={{ fontWeight: 600 }}>{currentLang.code.toUpperCase()}</span>
    </button>
  );
}

export default LanguageSwitcher;
