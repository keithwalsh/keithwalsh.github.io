/**
 * @fileoverview Main application configuration file for controlling
 * various UI features and app behavior.
 */

export interface AppConfig {
  /** Controls whether the app bar/header is displayed */
  showAppBar: boolean;
  /** Controls whether the drawer/sidebar is available */
  showDrawer: boolean;
  /** Default theme mode */
  defaultTheme: 'light' | 'dark' | 'system';
}

/**
 * Main application configuration
 * Modify these values to control app behavior
 */
export const appConfig: AppConfig = {
  // Set to false to hide the app bar completely
  showAppBar: false,
  
  // Set to false to hide the drawer/sidebar
  showDrawer: true,
  
  // Default theme preference
  defaultTheme: 'system',
} as const;

/**
 * Runtime config getter that can be extended for dynamic configuration
 */
export const getAppConfig = (): AppConfig => {
  return appConfig;
};
