import { useTranslation } from 'react-i18next';

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const targetLang = currentLang === 'ru' ? 'en' : 'ru';
  const buttonLabel = (targetLang === 'ru' ? 'en' : 'ru').toUpperCase();

  const changeLanguage = () => i18n.changeLanguage(targetLang);

  return (
    <div className="flex space-x-2">
      <button
        onClick={changeLanguage}
        className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default LanguageToggle;