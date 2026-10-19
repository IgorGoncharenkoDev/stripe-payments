import http from 'node:http'

import app from '@/app'
import { connectToDB } from '@/config/db'
import { env } from '@/config/env'
import { chalkLogger } from '@/lib/shared/utils/chalkLogger'

async function startServer() {
  await connectToDB()

  const server = http.createServer(app)

  const port = env.PORT || 5000

  server.listen(port, () => {
    chalkLogger.info(`Server is now running on port ${port}`)
  })
}

startServer().catch((err) => {
  chalkLogger.error(`Error when starting the server... :(, error: ${err}`)
  process.exit(1)
})
