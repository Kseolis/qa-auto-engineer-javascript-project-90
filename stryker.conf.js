/**
 * @type {import('@stryker-mutator/api/core').PartialStrykerOptions}
 */
export default {
  packageManager: 'npm',
  reporters: ['html', 'clear-text', 'progress', 'json'],
  testRunner: 'vitest',
  
  // Файлы для мутирования - только helpers и factories
  mutate: [
    'tests/helpers/**/*.js',
    'tests/factories/**/*.js',
    '!tests/**/*.test.js',
    '!tests/**/*.spec.js',
  ],
  
  // Coverage analysis
  coverageAnalysis: 'perTest',
  
  // Thresholds для quality gates
  thresholds: {
    high: 80, // Хороший уровень - 80% мутаций убиты
    low: 60,  // Низкий уровень - 60% мутаций убиты
    break: 50 // Break build если < 50%
  },
  
  // Таймауты
  timeoutMS: 60000,
  timeoutFactor: 2,
  
  // Concurrency
  concurrency: 4,
  
  // Vitest runner config
  vitest: {
    configFile: 'vitest.config.js'
  },
  
  // Мутаторы - какие типы мутаций применять
  // В Stryker 9.x с vitest-runner, mutator это просто объект с excludedMutations
  mutator: {
    excludedMutations: [
      // Исключаем некоторые мутации для speed up
      'StringLiteral', // Замена строк слишком много вариантов
      'ObjectLiteral', // Замена объектов
    ]
  },
  
  // HTML Report
  htmlReporter: {
    fileName: 'mutation-report.html'
  },
  
  // JSON Report для CI/CD
  // Stryker создает JSON отчет в корне проекта
  jsonReporter: {
    fileName: 'mutation-report.json'
  },
  
  // Output directory для отчетов
  tempDirName: '.stryker-tmp',
  
  // Incremental mode - мутировать только измененные файлы
  incremental: true,
  incrementalFile: '.stryker-tmp/incremental.json',
  
  // Ignore patterns
  ignorePatterns: [
    'node_modules',
    'dist',
    'test-results',
    'playwright-report',
    'coverage',
    '*.config.js'
  ],
  
  // Clear console между тестами
  clearTextReporter: {
    allowColor: true,
    logTests: false
  }
}

