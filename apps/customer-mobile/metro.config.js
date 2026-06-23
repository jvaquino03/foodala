// Learn more: https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// The Foodala logo is a single shared master at <repo>/assets/branding and is
// symlinked into this app's assets/images (see src/components/Logo.tsx and
// app.json). That symlink target lives outside the project root, so we add the
// shared assets folder to Metro's watch list — scoped to <repo>/assets only
// (no node_modules) to avoid any module-resolution collisions.
config.watchFolders = [path.resolve(projectRoot, '../../assets')];

module.exports = config;
