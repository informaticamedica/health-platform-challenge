function createLogger(service) {
  function log(level, message, extra) {
    const payload = {
      timestamp: new Date().toISOString(),
      level,
      service,
      message,
      ...extra
    };
    console.log(JSON.stringify(payload));
  }

  return {
    info: (message, extra = {}) => log("info", message, extra),
    error: (message, extra = {}) => log("error", message, extra)
  };
}

module.exports = { createLogger };
