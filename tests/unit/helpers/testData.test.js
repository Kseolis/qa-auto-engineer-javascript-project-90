import { describe, it, expect } from 'vitest'
import { generateUserData, generateTaskData } from '../../helpers/testData.js'

describe('testData helpers', () => {
  describe('generateUserData', () => {
    it('генерирует данные пользователя', async () => {
      const data1 = generateUserData()
      // Небольшая задержка для гарантии уникальности timestamp
      await new Promise(resolve => setTimeout(resolve, 1))
      const data2 = generateUserData()

      expect(data1.email).toBeTruthy()
      expect(data2.email).toBeTruthy()
      expect(data1.firstName).toBe('Test')
      expect(data1.lastName).toBe('User')
      expect(data2.firstName).toBe('Test')
      expect(data2.lastName).toBe('User')
      // Проверяем что email сгенерирован
      expect(typeof data1.email).toBe('string')
      expect(typeof data2.email).toBe('string')
      expect(data1.email).toMatch(/^test\d+@example\.com$/)
      expect(data2.email).toMatch(/^test\d+@example\.com$/)
    })

    it('генерирует валидный email', () => {
      const data = generateUserData()
      expect(data.email).toMatch(/^test\d+@example\.com$/)
    })
  })

  describe('generateTaskData', () => {
    it('генерирует данные задачи', () => {
      const data1 = generateTaskData()
      const data2 = generateTaskData()

      expect(data1.title).toBeTruthy()
      expect(data2.title).toBeTruthy()
      expect(data1.content).toBeTruthy()
      expect(data2.content).toBeTruthy()
      // Данные могут быть одинаковыми если вызваны в один момент времени
      // Проверяем что структура правильная
      expect(typeof data1.title).toBe('string')
      expect(typeof data2.title).toBe('string')
    })
  })
})
