import { test, expect } from '@playwright/test'
import { LabelsPage } from './pages/LabelsPage.js'
import { generateLabelData, generateEditedLabelData } from './helpers/testData.js'
import { loginAsValidUser } from './helpers/authHelper.js'
import {
  verifyCreateFormVisible,
  verifyEntityCreated,
  verifyListDisplayed,
  verifyRowsData,
  verifyEntityEdited,
  verifyEntityDeleted,
  verifyBulkDelete,
  verifyEditFormVisible,
} from './helpers/testHelpers.js'

test.beforeEach(async ({ page }) => {
  await loginAsValidUser(page)
})

test.describe('Создание меток', () => {
  test('форма создания метки отображается корректно', async ({ page }) => {
    const labelsPage = new LabelsPage(page)

    await labelsPage.goto()
    await labelsPage.clickCreate()

    const form = await labelsPage.isCreateFormVisible()
    await verifyCreateFormVisible(form, ['name'])
  })

  test('создание новой метки с валидными данными', async ({ page }) => {
    const labelsPage = new LabelsPage(page)
    const labelData = generateLabelData()

    const { initialCount } = await labelsPage.createLabel(labelData)

    await verifyEntityCreated(
      labelsPage,
      initialCount,
      labelData.name,
      name => labelsPage.isLabelVisible(name),
    )

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
    await verifyListDisplayed(labelsPage)
  })

  test('отображается основная информация о каждой метке', async ({ page }) => {
    const labelsPage = new LabelsPage(page)

    await labelsPage.goto()
    const rows = await labelsPage.getAllLabelRows()

    await verifyRowsData(rows, row => labelsPage.getLabelRowData(row), ['name'])
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
    await verifyEditFormVisible(form, ['name'])
  })

  test('изменение данных метки сохраняется корректно', async ({ page }) => {
    const labelsPage = new LabelsPage(page)
    const editedData = generateEditedLabelData()

    await labelsPage.goto()
    const firstLabelName = await labelsPage.getFirstLabelName()
    await expect(firstLabelName).toBeTruthy()

    await labelsPage.editLabel(firstLabelName, editedData)
    await verifyEntityEdited(
      labelsPage,
      editedData.name,
      name => labelsPage.isLabelVisible(name),
      (name, data) => labelsPage.verifyLabelData(name, data),
      editedData,
    )
  })
})

test.describe('Удаление меток', () => {
  test('удаление одной метки', async ({ page }) => {
    const labelsPage = new LabelsPage(page)

    const { initialCount, firstLabelName } = await labelsPage.deleteFirstLabel()

    await verifyEntityDeleted(
      labelsPage,
      initialCount,
      firstLabelName,
      name => labelsPage.isLabelVisible(name),
    )
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
    await verifyBulkDelete(labelsPage, initialCount)
  })
})
