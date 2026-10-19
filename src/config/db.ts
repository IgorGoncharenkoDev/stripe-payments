import mongoose from 'mongoose'

import { env } from '@/config/env'
import { chalkLogger } from '@/lib/shared/utils/chalkLogger'

export async function connectToDB() {
  try {
    await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    })

    chalkLogger.success('Connected to MongoDB')
  } catch (error) {
    chalkLogger.error(`Failed to connect to MongoDB: ${error}`)

    process.exit(1)
  }
}
