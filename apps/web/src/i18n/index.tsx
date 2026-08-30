import { createContext, useContext, type ReactNode } from "react";
import { enUS, type MessageKey } from "./locales/en-US.js";

export const DEFAULT_LOCALE = "en-US" as const;
export const FALLBACK_LOCALE = "en-US" as const;
export type ApplicationLocale = typeof DEFAULT_LOCALE;
export type MessageCatalog = Partial<Record<MessageKey, string>>;

export function resolveLocale(_requested?: string): ApplicationLocale { return FALLBACK_LOCALE; }
export function createTranslator(catalog: MessageCatalog = {}) { return (key: MessageKey) => catalog[key] ?? enUS[key]; }
export const translate = createTranslator();
export function formatDate(value: string | number | Date) { return new Intl.DateTimeFormat(DEFAULT_LOCALE).format(new Date(value)); }
export function formatDateTime(value: string | number | Date) { return new Intl.DateTimeFormat(DEFAULT_LOCALE, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }
export function formatNumber(value: number) { return new Intl.NumberFormat(DEFAULT_LOCALE).format(value); }

const I18nContext = createContext({ locale: DEFAULT_LOCALE, t: translate });
export function I18nProvider({ children, locale, messages }: { readonly children: ReactNode; readonly locale?: string; readonly messages?: MessageCatalog }) {
  return <I18nContext.Provider value={{ locale: resolveLocale(locale), t: createTranslator(messages) }}>{children}</I18nContext.Provider>;
}
export function useI18n() { return useContext(I18nContext); }
