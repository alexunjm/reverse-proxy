import pinoPretty from 'pino-pretty'

const customTransport = opts => {
  return pinoPretty({
    ...opts,
    messageFormat: (jsonLogPino, key, _levelLabel) => {
      // console.log({opts, jsonLogPino, key, _levelLabel});
      return `\n${jsonLogPino[key]}`
    }
  })
}

export default customTransport