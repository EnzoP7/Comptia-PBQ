/**
 * Interface language (Spanish or English), persisted per browser. The app is written in
 * Spanish; English is applied by the DOM translator (see translator.ts).
 */
import { useSyncExternalStore } from 'react';
import { loadDictionary, lookup, startDomTranslation, stopDomTranslation } from './translator';

export type Lang = 'es' | 'en';

const STORAGE_KEY = 'secplus_pbq_lang';
const listeners = new Set<() => void>();

function storedLang(): Lang | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'es' || v === 'en' ? v : null;
  } catch {
    return null;
  }
}

/** True until the visitor picks a language for the first time. */
export const isFirstVisitLanguage = () => storedLang() === null;

/** Returning visitors from before the language option keep Spanish; new ones get their browser's language. */
function defaultLang(): Lang {
  try {
    if (localStorage.getItem('secplus-pbq-progress')) return 'es';
  } catch {
    /* ignore */
  }
  return navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en';
}

let current: Lang = storedLang() ?? defaultLang();

const TITLES: Record<Lang, string> = {
  es: 'Simulador PBQ Security+ SY0-701',
  en: 'Security+ SY0-701 PBQ Simulator',
};

function applyDocument(lang: Lang) {
  document.documentElement.lang = lang;
  document.title = TITLES[lang];
}

export const getLang = () => current;

export async function setLang(lang: Lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* private mode: the choice lasts for this visit only */
  }
  if (lang === current) return;
  if (lang === 'en') {
    await loadDictionary();
    startDomTranslation();
  } else {
    stopDomTranslation();
  }
  current = lang;
  applyDocument(lang);
  listeners.forEach((l) => l());
}

/** Applies the saved language before the first render, so English pages never flash Spanish. */
export async function initLanguage() {
  if (current === 'en') {
    await loadDictionary();
    startDomTranslation();
  }
  applyDocument(current);
}

export function useLang(): Lang {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => current,
    () => current
  );
}

/** For strings shown outside the DOM (window.confirm). */
export const t = (spanish: string) => (current === 'en' ? lookup(spanish) ?? spanish : spanish);
