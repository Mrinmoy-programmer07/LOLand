// This is a simple module to handle the pino-pretty dependency issue
// It exports a mock version of pino-pretty that does nothing, for webpack to resolve

module.exports = {
  // Basic no-op pretty printer
  pretty: function() {
    return function(line) {
      return line;
    };
  },
  // Add additional exports that might be used by pino
  asMetaWrapper: function(line) {
    return line;
  },
  prettyFactory: function(options) {
    return function(line) {
      return line;
    };
  },
  default: function() {
    return function(line) {
      return line;
    };
  }
}; 