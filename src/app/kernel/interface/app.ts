export interface App {
  isMinimized: boolean;
  title: string;
  id: number;

  path?: string;
  type: AppType;
}

export type AppType = 'file' | 'custom';
