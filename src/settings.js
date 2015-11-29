const localStorageKey = 'pivotal-swimlanes-config';

const getSettings = () => JSON.parse(localStorage.getItem(localStorageKey)) || {};

const updateSettings = data => (
  localStorage.setItem(localStorageKey, JSON.stringify({ ...getSettings(), ...data }))
);

export default { getSettings, updateSettings };
