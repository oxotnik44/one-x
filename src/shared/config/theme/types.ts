export type CSSVarName =
    | '--bg-color'
    | '--text-color'
    | '--button-color'
    | '--skeleton-color'
    | '--skeleton-shadow'
    | '--bg-container'
    | '--input-color'
    | '--heart-color'
    | '--inverted-heart-color'
    | '--primary-color'
    | '--inverted-primary-color';

export type ThemeVars = Record<CSSVarName, string>;

export interface ThemeSchema {
    theme: ThemeVars;
    setTheme: (vars: ThemeVars) => void;
    updateVar: (key: CSSVarName, value: string) => void;
}
