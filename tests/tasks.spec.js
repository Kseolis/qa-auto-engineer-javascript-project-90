import { test, expect } from '@playwright/test'
import { loginAsValidUser } from './helpers/authHelper.js'
import { TasksPage } from './pages/TasksPage.js'
import { TIMEOUTS, URLS, SELECTORS } from './helpers/constants.js'
import { generateTaskData, generateEditedTaskData } from './helpers/testData.js'

test.beforeEach(async ({ page }) => {
  await loginAsValidUser(page)
})

test.describe('Tasks: канбан-доска', () => {
  test.describe('Просмотр канбан-доски', () => {
    test('доска отображается и содержит колонки со статусами', async ({ page }) => {
      const tasksPage = new TasksPage(page)
      await tasksPage.goto()

      await expect(page.getByText('Draft', { exact: true })).toBeVisible()
      await expect(page.getByText('To Review', { exact: true })).toBeVisible()
      await expect(page.getByText('To Be Fixed', { exact: true })).toBeVisible()
      await expect(page.getByText('To Publish', { exact: true })).toBeVisible()
      await expect(page.getByText('Published', { exact: true })).toBeVisible()
    })

    test('карточка задачи содержит title и content', async ({ page }) => {
      const tasksPage = new TasksPage(page)
      await tasksPage.goto()

      const card = tasksPage.getTaskCardContainerByTitle('Task 1')
      await expect(card).toBeVisible()
      await expect(card.getByText('Description of task 1', { exact: true })).toBeVisible()
    })
  })

  test.describe('Фильтрация задач', () => {
    test('фильтрация по исполнителю (assignee)', async ({ page }) => {
      const tasksPage = new TasksPage(page)
      await tasksPage.goto()

      await tasksPage.setFilterAssignee('john@google.com')

      await expect.poll(
        () => tasksPage.getTaskCardContainerByTitle('Task 1').isVisible().catch(() => false),
        { timeout: TIMEOUTS.MEDIUM },
      ).toBe(true)

      await expect.poll(
        () => tasksPage.getTaskCardContainerByTitle('Task 3').isVisible().catch(() => false),
        { timeout: TIMEOUTS.MEDIUM },
      ).toBe(false)
    })

    test('фильтрация по статусу (колонке)', async ({ page }) => {
      const tasksPage = new TasksPage(page)
      await tasksPage.goto()

      await tasksPage.setFilterStatus('To Be Fixed')

      await expect.poll(
        () => tasksPage.isTaskVisibleInStatusColumn('To Be Fixed', 'Task 1'),
        { timeout: TIMEOUTS.MEDIUM },
      ).toBe(true)

      await expect.poll(
        () => tasksPage.getTaskCardContainerByTitle('Task 2').isVisible().catch(() => false),
        { timeout: TIMEOUTS.MEDIUM },
      ).toBe(false)
    })

    test('фильтрация по метке (label)', async ({ page }) => {
      const tasksPage = new TasksPage(page)
      await tasksPage.goto()

      await tasksPage.setFilterLabel('bug')

      await expect.poll(
        () => tasksPage.getTaskCardContainerByTitle('Task 7').isVisible().catch(() => false),
        { timeout: TIMEOUTS.MEDIUM },
      ).toBe(true)

      await expect.poll(
        () => tasksPage.getTaskCardContainerByTitle('Task 2').isVisible().catch(() => false),
        { timeout: TIMEOUTS.MEDIUM },
      ).toBe(false)
    })

    test('комбинация фильтров (assignee + status)', async ({ page }) => {
      const tasksPage = new TasksPage(page)
      await tasksPage.goto()

      await tasksPage.setFilterAssignee('john@google.com')
      await tasksPage.setFilterStatus('Draft')

      await expect.poll(
        () => tasksPage.getTaskCardContainerByTitle('Task 5').isVisible().catch(() => false),
        { timeout: TIMEOUTS.MEDIUM },
      ).toBe(true)

      await expect.poll(
        () => tasksPage.getTaskCardContainerByTitle('Task 7').isVisible().catch(() => false),
        { timeout: TIMEOUTS.MEDIUM },
      ).toBe(false)
    })
  })

  test.describe('Перемещение задач (drag&drop)', () => {
    test('перемещение карточки между колонками и сохранение в рамках SPA', async ({ page }) => {
      const tasksPage = new TasksPage(page)
      await tasksPage.goto()

      await expect.poll(
        () => tasksPage.isTaskVisibleInStatusColumn('Draft', 'Task 5'),
        { timeout: TIMEOUTS.MEDIUM },
      ).toBe(true)

      await tasksPage.dragTaskToStatus('Task 5', 'To Review')

      await expect.poll(
        () => tasksPage.isTaskVisibleInStatusColumn('To Review', 'Task 5'),
        { timeout: TIMEOUTS.MEDIUM },
      ).toBe(true)

      await expect.poll(
        () => tasksPage.isTaskVisibleInStatusColumn('Draft', 'Task 5'),
        { timeout: TIMEOUTS.MEDIUM },
      ).toBe(false)

      await page.goto(URLS.USERS)
      await expect(page.locator(SELECTORS.TABLE)).toBeVisible()

      await tasksPage.goto()

      await expect.poll(
        () => tasksPage.isTaskVisibleInStatusColumn('To Review', 'Task 5'),
        { timeout: TIMEOUTS.MEDIUM },
      ).toBe(true)
    })
  })

  test.describe('Создание задач', () => {
    test('форма создания задачи отображается корректно и валидирует обязательные поля', async ({ page }) => {
      const tasksPage = new TasksPage(page)
      await tasksPage.openCreateForm()

      await expect(tasksPage.getTitleInput()).toBeVisible()
      await expect(tasksPage.getContentInput()).toBeVisible()

      const saveButton = page.locator(SELECTORS.SAVE_BUTTON).first()
      await expect(saveButton).toBeVisible()
      await expect(saveButton).toBeDisabled()

      const taskData = generateTaskData()
      await tasksPage.fillTaskForm({ title: taskData.title })
      await expect(saveButton).toBeEnabled()
    })

    test('создание задачи с валидными данными', async ({ page }) => {
      const tasksPage = new TasksPage(page)
      const taskData = generateTaskData()

      await tasksPage.openCreateForm()
      await tasksPage.setFormAssignee('john@google.com')
      await tasksPage.setFormStatus('Draft')
      await tasksPage.setFormLabels(['bug'])
      await tasksPage.fillTaskForm(taskData)
      await tasksPage.saveTask()

      await tasksPage.goto()

      await expect.poll(
        () => tasksPage.isTaskVisibleInStatusColumn('Draft', taskData.title),
        { timeout: TIMEOUTS.LONG },
      ).toBe(true)
    })
  })

  test.describe('Редактирование задач', () => {
    test('изменение данных задачи сохраняется корректно', async ({ page }) => {
      const tasksPage = new TasksPage(page)
      const edited = generateEditedTaskData()

      await tasksPage.goto()
      await tasksPage.openTaskEditFromCard('Task 2')
      await tasksPage.fillTaskForm(edited)
      await tasksPage.setFormStatus('To Publish')
      await tasksPage.saveTask()

      await tasksPage.goto()

      await expect.poll(
        () => tasksPage.isTaskVisibleInStatusColumn('To Publish', edited.title),
        { timeout: TIMEOUTS.LONG },
      ).toBe(true)
    })
  })

  test.describe('Просмотр карточки задачи', () => {
    test('страница Show открывается из карточки', async ({ page }) => {
      const tasksPage = new TasksPage(page)
      await tasksPage.goto()
      await tasksPage.openTaskShowFromCard('Task 1')

      await expect.poll(() => page.url().includes('/#/tasks/1'), { timeout: TIMEOUTS.MEDIUM }).toBe(true)
      await expect(page.getByText('Task 1', { exact: true })).toBeVisible()
      await expect(page.getByText('Description of task 1', { exact: true })).toBeVisible()
    })
  })
})
