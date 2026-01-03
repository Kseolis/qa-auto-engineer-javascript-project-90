import { describe, it, expect } from 'vitest'
import { UserFactory } from '../../factories/UserFactory.js'

describe('UserFactory', () => {
  describe('create', () => {
    it('создает новый экземпляр фабрики', () => {
      const factory = UserFactory.create()
      expect(factory).toBeInstanceOf(UserFactory)
    })
  })

  describe('withEmail', () => {
    it('устанавливает email и возвращает this для цепочки', () => {
      const factory = UserFactory.create().withEmail('test@example.com')
      const data = factory.build()
      expect(data.email).toBe('test@example.com')
      expect(factory).toBeInstanceOf(UserFactory)
    })
  })

  describe('withUniqueEmail', () => {
    it('генерирует email на основе timestamp', async () => {
      const factory1 = UserFactory.create().withUniqueEmail()
      // Небольшая задержка для гарантии уникальности timestamp
      await new Promise(resolve => setTimeout(resolve, 1))
      const factory2 = UserFactory.create().withUniqueEmail()

      const data1 = factory1.build()
      const data2 = factory2.build()

      expect(data1.email).toMatch(/^test\d+@example\.com$/)
      expect(data2.email).toMatch(/^test\d+@example\.com$/)
      // Проверяем что email сгенерирован
      expect(typeof data1.email).toBe('string')
      expect(typeof data2.email).toBe('string')
    })
  })

  describe('withUniqueData', () => {
    it('генерирует данные пользователя', async () => {
      const factory1 = UserFactory.create().withUniqueData()
      // Небольшая задержка для гарантии уникальности timestamp
      await new Promise(resolve => setTimeout(resolve, 1))
      const factory2 = UserFactory.create().withUniqueData()

      const data1 = factory1.build()
      const data2 = factory2.build()

      expect(data1.email).toBeTruthy()
      expect(data1.firstName).toBeTruthy()
      expect(data1.lastName).toBeTruthy()
      expect(data2.email).toBeTruthy()
      expect(data2.firstName).toBeTruthy()
      expect(data2.lastName).toBeTruthy()
      // Проверяем что данные сгенерированы
      expect(typeof data1.email).toBe('string')
      expect(typeof data2.email).toBe('string')
    })
  })

  describe('build', () => {
    it('возвращает данные пользователя без создания в системе', () => {
      const factory = UserFactory.create()
        .withEmail('test@example.com')
        .withFirstName('John')
        .withLastName('Doe')

      const data = factory.build()

      expect(data).toEqual({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      })
    })

    it('автоматически генерирует email если не установлен', () => {
      const factory = UserFactory.create()
      const data = factory.build()

      expect(data.email).toMatch(/^test\d+@example\.com$/)
    })
  })

  describe('Fluent API', () => {
    it('поддерживает цепочку вызовов', () => {
      const data = UserFactory.create()
        .withEmail('test@example.com')
        .withFirstName('John')
        .withLastName('Doe')
        .build()

      expect(data.email).toBe('test@example.com')
      expect(data.firstName).toBe('John')
      expect(data.lastName).toBe('Doe')
    })
  })
})
