import pino from 'pino'
import dayjs from 'dayjs'
const logger = pino({
  transport: {
    target: 'pino-pretty'
  },
})
export default logger