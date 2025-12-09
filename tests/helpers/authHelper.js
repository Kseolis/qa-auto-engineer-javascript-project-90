import { LoginPage } from '../pages/LoginPage.js'
import { testUsers } from './testData.js'

export async function loginUser(page, user = testUsers.valid) {
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  await loginPage.login(user.login, user.password)
  return loginPage
}

export async function loginAsValidUser(page) {
  return await loginUser(page, testUsers.valid)
}
