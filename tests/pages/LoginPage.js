import { URLS, SELECTORS } from '../helpers/constants.js'

export class LoginPage {
  constructor(page) {
    this.page = page
    this.loginInput = page.locator(SELECTORS.LOGIN_USERNAME_INPUT).first()
    this.passwordInput = page.locator(SELECTORS.LOGIN_PASSWORD_INPUT).first()
    this.submitButton = page.locator(SELECTORS.LOGIN_SUBMIT_BUTTON).first()
    this.logoutButton = page.locator(SELECTORS.LOGOUT_BUTTON).first()
  }

  async goto() {
    await this.page.goto(URLS.HOME)
  }

  async login(login, password) {
    await this.loginInput.fill(login)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
  }

  async isLoginFormVisible() {
    await this.passwordInput.waitFor({ state: 'visible' })
    return (await this.loginInput.isVisible()) && (await this.passwordInput.isVisible())
  }

  async logout() {
    await this.page.locator(SELECTORS.PROFILE_BUTTON).click()
    await this.page.locator(SELECTORS.LOGOUT_MENU_ITEM).waitFor({ state: 'visible' })
    await this.page.locator(SELECTORS.LOGOUT_MENU_ITEM).click()
  }

  async isLoggedIn() {
    const isFormVisible = await this.loginInput.isVisible().catch(() => false)
    return !isFormVisible
  }

  async isLoggedOut() {
    return this.isLoginFormVisible()
  }
}
