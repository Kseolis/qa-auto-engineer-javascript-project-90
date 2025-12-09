import { SELECTORS, COLUMN_INDEXES, TIMEOUTS, URLS } from '../helpers/constants.js'

export class BasePage {
  constructor(page, config) {
    this.page = page
    this.config = config
  }

  async goto() {
    await this.page.goto(this.config.url)
    await this.config.tableLocator.waitFor({ state: 'visible' })
  }

  async clickCreate() {
    await this.config.createButtonLocator.click()
    await this.config.firstInputLocator.waitFor({ state: 'visible' })
  }

  async selectAll() {
    await this.config.selectAllCheckboxLocator.check()
  }

  async deleteAllSelected() {
    const initialRows = await this.getAllRows()
    await this.config.deleteButtonLocator.click()
    await this.page.waitForFunction(
      (expectedCount, selector) => {
        const rows = document.querySelectorAll(selector)
        return rows.length < expectedCount
      },
      initialRows.length,
      SELECTORS.TABLE_BODY_ROW,
      { timeout: TIMEOUTS.MEDIUM },
    )
  }

  async getCount() {
    const rows = await this.page.locator(SELECTORS.TABLE_BODY_ROW).all()
    return rows.length
  }

  async getAllRows() {
    return await this.page.locator(SELECTORS.TABLE_BODY_ROW).all()
  }

  async getRowByText(text) {
    return this.page.locator(`tr:has-text("${text}")`)
  }

  async getCheckboxByText(text) {
    const row = await this.getRowByText(text)
    return row.locator(SELECTORS.TABLE_CELL).nth(COLUMN_INDEXES.CHECKBOX).locator(SELECTORS.TABLE_CELL_CHECKBOX)
  }

  async deleteByText(text) {
    const initialCount = await this.getCount()
    const checkbox = await this.getCheckboxByText(text)
    await checkbox.check()
    await this.config.deleteButtonLocator.click()
    await this.page.waitForFunction(
      (expectedCount, selector) => {
        const rows = document.querySelectorAll(selector)
        return rows.length < expectedCount
      },
      initialCount,
      SELECTORS.TABLE_BODY_ROW,
      { timeout: TIMEOUTS.MEDIUM },
    )
  }

  async areAllCheckboxesSelected() {
    const checkboxes = await this.page.locator(SELECTORS.TABLE_BODY_CHECKBOX).all()
    const checkedStates = await Promise.all(checkboxes.map(cb => cb.isChecked()))
    return checkboxes.length > 0 && checkedStates.every(state => state === true)
  }

  async saveForm() {
    await this.page.locator(SELECTORS.SAVE_BUTTON).click()
    await Promise.race([
      this.config.tableLocator.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM }).catch(() => {}),
      this.config.firstInputLocator.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM }).catch(() => {}),
    ])
  }

  async getIdFromRow(row) {
    return await row.locator(SELECTORS.TABLE_CELL).nth(COLUMN_INDEXES.ID).textContent()
  }

  async gotoEditPage(id) {
    await this.page.goto(`${this.config.url}/${id}${URLS.EDIT_SUFFIX}`)
    await this.config.firstInputLocator.waitFor({ state: 'visible' })
  }
}
