import { useContext } from 'react'
import { LanguageContext } from '../context/LanguageContext'

export const useTranslation = () => {
  const context = useContext(LanguageContext)
  
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider')
  }
  
  const { currentLanguage, setCurrentLanguage, languages, isLanguageLoaded, translations } = context
  
  const t = (key: string): string => {
    const translation = translations[currentLanguage as keyof typeof translations]
    return translation?.[key as keyof typeof translation] || key
  }
  
  return { t, currentLanguage, setCurrentLanguage, languages, isLanguageLoaded }
} 