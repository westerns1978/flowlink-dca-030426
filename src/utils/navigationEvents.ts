
export type AppView = 'dashboard' | 'devices' | 'sites' | 'alerts' | 'reports' | 'dcas' | 'settings';

export const navigateToView = (view: AppView) => {
  const event = new CustomEvent('navigate-view', { detail: view });
  window.dispatchEvent(event);
};
