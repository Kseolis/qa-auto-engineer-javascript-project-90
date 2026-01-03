/**
 * Publish Pact contracts to Pact Broker
 *
 * USAGE:
 * npm run test:contracts:publish
 *
 * REQUIRES:
 * - PACT_BROKER_URL environment variable
 * - PACT_BROKER_TOKEN (optional, for auth)
 */

import { Publisher } from '@pact-foundation/pact'
import path from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'
import process from 'node:process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Pact обычно создает файлы в pacts/ в корне проекта
// Также проверяем test-results/pacts для обратной совместимости
const possiblePactDirs = [
  path.resolve(__dirname, '../pacts'),
  path.resolve(__dirname, '../test-results/pacts'),
]

const pactDir = possiblePactDirs.find(dir => existsSync(dir))

if (!pactDir) {
  console.error('❌ Pact directory not found. Checked:', possiblePactDirs.join(', '))
  console.error('   Run contract tests first to generate pact files')
  process.exit(1)
}

console.log(`📁 Using Pact directory: ${pactDir}`)

const opts = {
  pactFilesOrDirs: [pactDir],
  pactBroker: process.env.PACT_BROKER_URL || 'http://localhost:9292',
  pactBrokerToken: process.env.PACT_BROKER_TOKEN,
  consumerVersion: process.env.GIT_COMMIT || 'dev',
  tags: [process.env.GIT_BRANCH || 'main', 'dev'],
}

console.log('📦 Publishing Pact contracts...')
console.log(`Broker: ${opts.pactBroker}`)
console.log(`Version: ${opts.consumerVersion}`)
console.log(`Tags: ${opts.tags.join(', ')}`)

const publisher = new Publisher(opts)

publisher
  .publish()
  .then(() => {
    console.log('✅ Pact contracts published successfully!')
  })
  .catch((error) => {
    console.error('❌ Failed to publish Pact contracts:', error.message)
    process.exit(1)
  })
