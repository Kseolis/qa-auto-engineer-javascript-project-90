import { BasePage } from './BasePage.js'
import { URLS, SELECTORS, COLUMN_INDEXES, TIMEOUTS } from '../helpers/constants.js'

export class UsersPage extends BasePage {
  constructor(page) {
    const usersTable = page.locator(SELECTORS.TABLE)
    super(page, {
      url: URLS.USERS,
      tableLocator: usersTable,
      createButtonLocator: page.locator(SELECTORS.USERS_CREATE_BUTTON),
      firstInputLocator: page.locator(SELECTORS.USER_EMAIL_INPUT),
      selectAllCheckboxLocator: page.locator(SELECTORS.SELECT_ALL_CHECKBOX).first(),
      deleteButtonLocator: page.locator(SELECTORS.DELETE_BUTTON),
    })
    this.page = page
    this.usersTable = usersTable
  }

  async fillUserForm(userData) {
    const emailInput = this.page.locator(SELECTORS.USER_EMAIL_INPUT)
    const firstNameInput = this.page.locator(SELECTORS.USER_FIRST_NAME_INPUT)
    const lastNameInput = this.page.locator(SELECTORS.USER_LAST_NAME_INPUT)

    if (userData.email) {
      await emailInput.fill(userData.email)
    }
    if (userData.firstName) {
      await firstNameInput.fill(userData.firstName)
    }
    if (userData.lastName) {
      await lastNameInput.fill(userData.lastName)
    }
  }

  async saveUser() {
    await super.saveForm()
  }

  async getUserRowByEmail(email) {
    return await super.getRowLocatorByCellText(email, COLUMN_INDEXES.EMAIL)
  }

  async getUserCheckboxByEmail(email) {
    return await super.getCheckboxByCellText(email, COLUMN_INDEXES.EMAIL)
  }

  async clickEditUser(email) {
    const row = await this.getUserRowByEmail(email)
    const userId = await super.getIdFromRow(row)
    await super.gotoEditPage(userId)
  }

  async deleteUser(email) {
    await super.deleteByCellText(email, COLUMN_INDEXES.EMAIL)
  }

  async getUserCount() {
    return await super.getCount()
  }

  async getUserData(email) {
    const row = await this.getUserRowByEmail(email)
    return await super.getRowDataByColumns(row, {
      id: COLUMN_INDEXES.ID,
      email: COLUMN_INDEXES.EMAIL,
      firstName: COLUMN_INDEXES.FIRST_NAME,
      lastName: COLUMN_INDEXES.LAST_NAME,
    })
  }

  async isUserVisible(email) {
    return await super.isEntityVisibleByColumn(email, COLUMN_INDEXES.EMAIL)
  }

  async getFirstUserEmail() {
    return await super.getFirstCellValue(COLUMN_INDEXES.EMAIL)
  }

  async isCreateFormVisible() {
    await Promise.all([
      this.page.locator(SELECTORS.USER_EMAIL_INPUT).waitFor({ state: 'visible' }),
      this.page.locator(SELECTORS.USER_FIRST_NAME_INPUT).waitFor({ state: 'visible' }),
      this.page.locator(SELECTORS.USER_LAST_NAME_INPUT).waitFor({ state: 'visible' }),
    ])
    return {
      email: this.page.locator(SELECTORS.USER_EMAIL_INPUT),
      firstName: this.page.locator(SELECTORS.USER_FIRST_NAME_INPUT),
      lastName: this.page.locator(SELECTORS.USER_LAST_NAME_INPUT),
      saveButton: this.getSaveButton(),
    }
  }

  async isEditFormVisible() {
    return await this.isCreateFormVisible()
  }

  async createUser(userData) {
    await this.goto()
    const initialCount = await this.getUserCount()
    await this.clickCreate()
    await this.fillUserForm(userData)
    await this.saveUser()
    await this.goto()
    return { initialCount, userData }
  }

  async editUser(email, editedData) {
    await this.goto()
    await this.clickEditUser(email)
    await this.fillUserForm(editedData)
    await this.saveUser()
    await this.goto()
    return editedData
  }

  async verifyUserData(email, expectedData) {
    const savedUser = await this.getUserData(email)
    return {
      email: savedUser.email?.includes(expectedData.email),
      firstName: savedUser.firstName?.includes(expectedData.firstName),
      lastName: savedUser.lastName?.includes(expectedData.lastName),
    }
  }

  async fillInvalidEmail(email) {
    const emailInput = this.page.locator(SELECTORS.USER_EMAIL_INPUT)
    await emailInput.fill(email)
    await this.page.locator(SELECTORS.SAVE_BUTTON).click()
    await this.page.locator(SELECTORS.USER_EMAIL_INPUT).waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM })
    return {
      emailInput,
      getInputValue: () => emailInput.inputValue(),
    }
  }

  async isEditPage() {
    const currentUrl = this.page.url()
    return currentUrl.includes(URLS.EDIT_SUFFIX)
  }

  async getAllUserRows() {
    return await super.getAllRows()
  }

  async getUserRowData(row) {
    const data = await super.getRowDataByColumns(row, {
      email: COLUMN_INDEXES.EMAIL,
      firstName: COLUMN_INDEXES.FIRST_NAME,
      lastName: COLUMN_INDEXES.LAST_NAME,
    })
    return { email: data.email, firstName: data.firstName, lastName: data.lastName }
  }

  async selectAllUsers() {
    await super.selectAll()
  }

  async deleteFirstUser() {
    const result = await super.deleteFirstEntity(COLUMN_INDEXES.EMAIL, email => this.deleteUser(email))
    return { initialCount: result.initialCount, firstUserEmail: result.firstIdentifier }
  }
}
