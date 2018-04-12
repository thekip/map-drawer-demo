const runSetup = require('./setup');
const setupOptions = require('./options');
const setupAPI = require('./api');
const Constants = require('./constants');

const setupDraw = function(options, api) {
  options = setupOptions(options);

  const ctx = {
    options: options
  };

  api = setupAPI(ctx, api);
  ctx.api = api;

  const setup = runSetup(ctx);

  api.onAdd = setup.onAdd;
  api.onRemove = setup.onRemove;
  api.types = Constants.types;
  api.options = options;

  return api;
};

module.exports = function(options) {
  setupDraw(options, this);
};

module.exports.modes = require('./modes');
