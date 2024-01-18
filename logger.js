import pino from 'pino';

const levels = {
  notice: 35, // Any number between info (30) and warn (40) will work the same
};
export default pino({
  level: process.env.PINO_LOG_LEVEL || 'info',
  customLevels: levels,
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: {
    target: './pino-pretty-transport.js',
    options: {
      // levelLabel: 'hola' // para manejo dentro del pino pretty transport
    }
  },
});
