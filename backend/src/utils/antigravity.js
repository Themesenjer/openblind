// src/utils/antigravity.js

const buildAntigravityResponse = ({ success = true, speechMessage = '', data = null, status = 'Success' }) => {
  return {
    status,
    success,
    speechMessage, // Campo que usará Steven para la lectura de voz
    data,
    timestamp: new Date().toISOString()
  };
};

module.exports = buildAntigravityResponse;