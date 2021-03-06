import defaultsDeep from 'lodash.defaultsdeep';
import shouldIncludeAddon from './addons/should-include';
import notifyAddonIncluded from './addons/notify-included';

export const DEFAULT_OPTIONS = {
  targets: {
    browsers: ['last 2 versions']
  }
};

export default class AbstractBuild {
  constructor(defaults, options) {
    defaults = defaults || {};
    options = options || {};
    let missingProjectMessage = 'You must pass through the default arguments passed into your ember-cli-build.js file.';

    if (arguments.length === 0) {
      throw new Error(missingProjectMessage);
    }

    if (!defaults.project) {
      throw new Error(missingProjectMessage);
    }

    this.options = defaultsDeep(options, defaults);
    this.project = options.project;
    this.env = options.project.env;
    this.isProduction = (this.env === 'production');
  }

  initializeAddons() {
    this.project.initializeAddons();
  }

  dependencies(pkg) {
    return this.project.dependencies(pkg);
  }

  _notifyAddonIncluded() {
    this.initializeAddons();
    let { blacklist, whitelist } = this.options.addons;
    notifyAddonIncluded(this.project, blacklist, whitelist, addon => {
      addon.app = this;

      if (shouldIncludeAddon(addon, blacklist, whitelist)) {
        if (addon.included) {
          addon.included(this);
        }

        return addon;
      }
    });
  }

  typeScriptTree() {}

  esLatestTree() {
    throw new Error('Must implement');
  }

  esTree() {
    throw new Error('Must implement');
  }

  package() {
    throw new Error('Must implement');
  }
}
