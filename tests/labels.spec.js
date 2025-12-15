import { test, expect } from '@playwright/test'
import { LabelsPage } from './pages/LabelsPage.js'
import { generateLabelData, generateEditedLabelData } from './helpers/testData.js'
import { loginAsValidUser } from './helpers/authHelper.js'
import { TIMEOUTS, TEST_CONSTANTS } from './helpers/constants.js'

test.beforeEach(async ({ page }) => {
  await loginAsValidUser(page)
})

test.describe('Создание меток', () => {
  test('форма создания метки отображается корректно', async ({ page }) => {
    const labelsPage = new LabelsPage(page)

    await labelsPage.goto()
    await labelsPage.clickCreate()

    const form = await labelsPage.isCreateFormVisible()
    await expect.soft(form.name).toBeVisible()
    await expect(form.saveButton).toBeVisible()
  })

  test('создание новой метки с валидными данными', async ({ page }) => {
    const labelsPage = new LabelsPage(page)
    const labelData = generateLabelData()

    const { initialCount } = await labelsPage.createLabel(labelData)

    await expect.poll(() => labelsPage.getLabelCount(), { timeout: TIMEOUTS.MEDIUM }).toBeGreaterThan(initialCount)
    await expect.poll(() => labelsPage.isLabelVisible(labelData.name), { timeout: TIMEOUTS.MEDIUM }).toBe(true)

    const verification = await labelsPage.verifyLabelData(labelData.name, labelData)
    await expect.soft(verification.name).toBe(true)
  })

  test('валидация данных при создании метки', async ({ page }) => {
    const labelsPage = new LabelsPage(page)

    await labelsPage.goto()
    await labelsPage.clickCreate()
    const form = await labelsPage.isCreateFormVisible()

    await expect.soft(page.url()).toContain('/#/labels/create')
    await expect(form.saveButton).toBeDisabled()
  })
})

test.describe('Просмотр списка меток', () => {
  test('список меток отображается полностью и корректно', async ({ page }) => {
    const labelsPage = new LabelsPage(page)

    await labelsPage.goto()

    await expect(labelsPage.labelsTable).toBeVisible()
    const labelCount = await labelsPage.getLabelCount()
    await expect(labelCount).toBeGreaterThan(0)
  })

  test('отображается основная информация о каждой метке', async ({ page }) => {
    const labelsPage = new LabelsPage(page)

    await labelsPage.goto()

    const rows = await labelsPage.getAllLabelRows()
    await expect(rows.length).toBeGreaterThan(0)

    for (let i = 0; i < Math.min(rows.length, TEST_CONSTANTS.MAX_ROWS_TO_CHECK); i++) {
      const labelData = await labelsPage.getLabelRowData(rows[i])
      await expect.soft(labelData.name).toBeTruthy()
    }
  })
})

test.describe('Редактирование меток', () => {
  test('форма редактирования метки отображается правильно', async ({ page }) => {
    const labelsPage = new LabelsPage(page)

    await labelsPage.goto()
    const firstLabelName = await labelsPage.getFirstLabelName()
    await expect(firstLabelName).toBeTruthy()

    await labelsPage.clickEditLabel(firstLabelName)

    const form = await labelsPage.isEditFormVisible()
    await expect.soft(form.name).toBeVisible({ timeout: TIMEOUTS.SHORT })
  })

  test('изменение данных метки сохраняется корректно', async ({ page }) => {
    const labelsPage = new LabelsPage(page)
    const editedData = generateEditedLabelData()

    await labelsPage.goto()
    const firstLabelName = await labelsPage.getFirstLabelName()
    await expect(firstLabelName).toBeTruthy()

    await labelsPage.editLabel(firstLabelName, editedData)

    await expect.poll(() => labelsPage.isLabelVisible(editedData.name), { timeout: TIMEOUTS.MEDIUM }).toBe(true)

    const verification = await labelsPage.verifyLabelData(editedData.name, editedData)
    await expect.soft(verification.name).toBe(true)
  })
})

test.describe('Удаление меток', () => {
  test('удаление одной метки', async ({ page }) => {
    const labelsPage = new LabelsPage(page)

    const { initialCount, firstLabelName } = await labelsPage.deleteFirstLabel()

    await expect(initialCount).toBeGreaterThan(0)
    await expect.poll(() => labelsPage.getLabelCount()).toBeLessThan(initialCount)
    await expect.poll(() => labelsPage.isLabelVisible(firstLabelName)).toBe(false)
  })
})

test.describe('Массовое удаление меток', () => {
  test('выделение всех меток', async ({ page }) => {
    const labelsPage = new LabelsPage(page)

    await labelsPage.goto()
    await labelsPage.selectAllLabels()

    await expect.poll(() => labelsPage.areAllCheckboxesSelected()).toBe(true)
  })

  test('массовое удаление всех меток', async ({ page }) => {
    const labelsPage = new LabelsPage(page)

    await labelsPage.goto()
    const initialCount = await labelsPage.getLabelCount()
    await labelsPage.selectAllLabels()
    await labelsPage.deleteAllSelected()
    await expect.poll(() => labelsPage.getLabelCount()).toBeLessThan(initialCount)
  })
})
