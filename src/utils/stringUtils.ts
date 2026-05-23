// src/utils/stringUtils.ts
export const toUpperCaseNoDiacritics = (str: string): string => {
    if (!str) return '';
    const normalized = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return normalized.toUpperCase();
};