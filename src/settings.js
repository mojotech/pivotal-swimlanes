const localStorageKey = 'pivotal-swimlanes-config';

export const getSettings = JSON.parse(localStorage.getItem(localStorageKey)) || {};

export const updateSettings = data => (
  localStorage.setItem(localStorageKey, JSON.stringify({ ...getSettings(), ...data }))
);

