import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/LoginPage.js'
import { loginAsValidUser } from './helpers/authHelper.js'
import { TasksPage } from './pages/TasksPage.js'
import { URLS, TIMEOUTS, SELECTORS } from './helpers/constants.js'

test.describe('Tasks: чеклист-дополнения', () => {
  test('без авторизации переход на Tasks приводит к форме логина', async ({ page }) => {
    const loginPage = new LoginPage(page)

    await page.goto(URLS.TASKS)

    await expect.poll(() => loginPage.isLoginFormVisible(), { timeout: TIMEOUTS.MEDIUM }).toBe(true)
  })

  test('переход на Tasks через меню', async ({ page }) => {
    await loginAsValidUser(page)
    const tasksPage = new TasksPage(page)

    await page.goto(URLS.USERS)
    await expect(page.locator(SELECTORS.TABLE)).toBeVisible()

    await tasksPage.openFromMenu()
    await expect.poll(() => page.url().includes('/#/tasks'), { timeout: TIMEOUTS.MEDIUM }).toBe(true)
  })

  test('выбранные фильтры сохраняются после перезагрузки страницы', async ({ page }) => {
    await loginAsValidUser(page)
    const tasksPage = new TasksPage(page)

    await tasksPage.goto()
    await expect(tasksPage.getTaskCardContainerByTitle('Task 2')).toBeVisible()

    await tasksPage.setFilterStatus('To Be Fixed')
    await expect.poll(
      () => tasksPage.getTaskCardContainerByTitle('Task 2').isVisible().catch(() => false),
      { timeout: TIMEOUTS.MEDIUM },
    ).toBe(false)

    await page.reload()
    await tasksPage.goto()

    await expect(page.getByRole('combobox', { name: /Status To Be Fixed/i })).toBeVisible()
    await expect.poll(
      () => tasksPage.getTaskCardContainerByTitle('Task 2').isVisible().catch(() => false),
      { timeout: TIMEOUTS.MEDIUM },
    ).toBe(false)
    await expect.poll(
      () => tasksPage.getTaskCardContainerByTitle('Task 1').isVisible().catch(() => false),
      { timeout: TIMEOUTS.MEDIUM },
    ).toBe(true)
  })

  test('drag&drop внутри одной колонки меняет порядок карточек', async ({ page }) => {
    await loginAsValidUser(page)
    const tasksPage = new TasksPage(page)

    await tasksPage.goto()

    const before = await tasksPage.getTaskButtonNamesInColumn('Draft')
    const beforeTask11Index = before.findIndex(t => t.includes('Task 11'))
    const beforeTask5Index = before.findIndex(t => t.includes('Task 5'))
    await expect.soft(beforeTask11Index).toBeGreaterThanOrEqual(0)
    await expect.soft(beforeTask5Index).toBeGreaterThanOrEqual(0)
    await expect(beforeTask11Index).toBeLessThan(beforeTask5Index)

    await tasksPage.dragTaskToTask('Task 5', 'Task 11')

    await expect.poll(async () => {
      const after = await tasksPage.getTaskButtonNamesInColumn('Draft')
      const afterTask11Index = after.findIndex(t => t.includes('Task 11'))
      const afterTask5Index = after.findIndex(t => t.includes('Task 5'))
      return afterTask5Index !== -1 && afterTask11Index !== -1 && afterTask5Index < afterTask11Index
    }, { timeout: TIMEOUTS.MEDIUM }).toBe(true)
  })

  test('дроп вне колонок не меняет статус карточки', async ({ page }) => {
    await loginAsValidUser(page)
    const tasksPage = new TasksPage(page)

    await tasksPage.goto()
    await expect.poll(() => tasksPage.isTaskVisibleInStatusColumn('Draft', 'Task 5'), { timeout: TIMEOUTS.MEDIUM }).toBe(true)

    await tasksPage.dragTaskToCoordinates('Task 5', 5, 5)

    await expect.poll(() => tasksPage.isTaskVisibleInStatusColumn('Draft', 'Task 5'), { timeout: TIMEOUTS.MEDIUM }).toBe(true)
  })

  test('Create: обязательные поля Assignee/Status не дают сохранить (валидация при submit)', async ({ page }) => {
    await loginAsValidUser(page)
    const tasksPage = new TasksPage(page)

    await tasksPage.openCreateForm()

    await tasksPage.fillTaskForm({ title: 'Task validation check' })

    const saveButton = page.locator(SELECTORS.SAVE_BUTTON).first()
    await expect(saveButton).toBeEnabled()
    await saveButton.click()

    await expect.poll(() => page.url().includes('/#/tasks/create'), { timeout: TIMEOUTS.MEDIUM }).toBe(true)
    await expect(tasksPage.getTitleInput()).toHaveValue('Task validation check')
  })

  test('Edit: изменение assignee и labels отражается на странице Show', async ({ page }) => {
    await loginAsValidUser(page)
    const tasksPage = new TasksPage(page)

    await tasksPage.goto()
    await tasksPage.openTaskEditFromCard('Task 3')

    await tasksPage.setFormAssignee('john@google.com')
    await tasksPage.setFormLabels(['task'])
    await tasksPage.saveTask()

    await tasksPage.goto()
    await tasksPage.openTaskShowFromCard('Task 3')

    await expect(page.getByText('john@google.com', { exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'task' })).toBeVisible()
  })

  test('Show: отображаются id/createdAt/assignee/labels (на примере Task 7)', async ({ page }) => {
    await loginAsValidUser(page)
    const tasksPage = new TasksPage(page)

    await tasksPage.goto()
    await tasksPage.openTaskShowFromCard('Task 7')

    await expect.poll(() => page.url().includes('/#/tasks/7'), { timeout: TIMEOUTS.MEDIUM }).toBe(true)
    await expect(page.getByText('7', { exact: true })).toBeVisible()
    await expect(page.getByText('8/4/2023', { exact: true })).toBeVisible()
    await expect(page.getByText('jane@gmail.com', { exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'bug' })).toBeVisible()
  })

  test('Export: по кнопке Export начинается загрузка файла', async ({ page }) => {
    await loginAsValidUser(page)
    const tasksPage = new TasksPage(page)

    await tasksPage.goto()

    const downloadPromise = page.waitForEvent('download', { timeout: TIMEOUTS.MEDIUM })
    await page.locator(SELECTORS.EXPORT_BUTTON).first().click()
    const download = await downloadPromise

    await expect(download.suggestedFilename().length).toBeGreaterThan(0)
  })
})
