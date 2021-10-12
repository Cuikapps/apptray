export interface Setting {
  searchEngine: SearchEngine;
  mailProvider: MailProvider;
  theme: Theme;
}

export type Theme = 'Light' | 'Default' | 'Dark';

export type SearchEngine =
  | 'Google'
  | 'MS Bing'
  | 'Yahoo'
  | 'Yandex'
  | 'Ask.com'
  | 'DuckDuckGo'
  | 'Ecosia'
  | 'Aol.com';

export enum SearchEngineURL {
  GOOGLE = 'https://google.com/search?q=',
  MS_BING = 'https://www.bing.com/search?q=',
  YAHOO = 'https://search.yahoo.com/seach?p=',
  YANDEX = 'https://yandex.com/search/?text=',
  DUCK_DUCK_GO = 'https://duckduckgo.com/?q=',
  ASK_DOT_COM = 'https://www.ask.com/web?q=',
  ECOSIA = 'https://www.ecosia.org/search?q=',
  AOL_DOT_COM = 'https://search.aol.com/aol/search?q=',
}

export enum MailProviderURL {
  GMAIL = 'https://mail.google.com/mail',
  OUTLOOK = 'https://outlook.live.com/mail',
  YAHOO = 'https://mail.yahoo.com/',
}

export type MailProvider = 'Gmail' | 'Yahoo' | 'Outlook';
