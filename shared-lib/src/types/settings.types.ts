export interface Settings {
    id: string;
    userId: string;
    theme: ThemeMode;
    language: Language;
    createdAt: Date;
    updatedAt: Date;
}

export enum ThemeMode {
    LIGHT = 'LIGHT',
    DARK = 'DARK',
    SYSTEM = 'SYSTEM'
}

export enum Language {
    EN = 'EN',
    ES = 'ES',
    HE = 'HE'
}

export interface SettingsUpdateData {
    theme?: ThemeMode;
    language?: Language;
}

export type SettingsResponse = Settings; 