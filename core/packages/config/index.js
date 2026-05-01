function getEnv(name, fallback) {
  const value = process.env[name];
  if (value === undefined || value === "") {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
}

module.exports = { getEnv };
