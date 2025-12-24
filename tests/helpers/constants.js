export const COLUMN_INDEXES = {
  CHECKBOX: 0,
  ID: 1,
  EMAIL: 2,
  FIRST_NAME: 3,
  LAST_NAME: 4,
  NAME: 2,
  SLUG: 3,
}

export const URLS = {
  HOME: '/',
  TASKS: '/#/tasks',
  TASKS_CREATE: '/#/tasks/create',
  USERS: '/#/users',
  USERS_CREATE: '/#/users/create',
  STATUSES: '/#/task_statuses',
  STATUSES_CREATE: '/#/task_statuses/create',
  LABELS: '/#/labels',
  LABELS_CREATE: '/#/labels/create',
  EDIT_SUFFIX: '/edit',
}

export const SELECTORS = {
  TABLE: 'table',
  TABLE_BODY_ROW: 'tbody tr',
  TABLE_BODY_CHECKBOX: 'tbody input[type="checkbox"]',
  TABLE_CELL: 'td',
  TABLE_CELL_CHECKBOX: 'input[type="checkbox"]',
  SELECT_ALL_CHECKBOX: 'input[type="checkbox"]',
  DELETE_BUTTON: 'button[aria-label="Delete"]',
  EXPORT_BUTTON: 'button[aria-label="Export"]',
  SAVE_BUTTON: 'button[type="submit"], button[aria-label="Save"]',
  USER_EMAIL_INPUT: 'input[name="email"]',
  USER_FIRST_NAME_INPUT: 'input[name="firstName"]',
  USER_LAST_NAME_INPUT: 'input[name="lastName"]',
  STATUS_NAME_INPUT: 'input[name="name"]',
  STATUS_SLUG_INPUT: 'input[name="slug"]',
  LABEL_NAME_INPUT: 'input[name="name"]',
  TASK_TITLE_INPUT: 'input[name="title"]',
  TASK_CONTENT_INPUT: 'textarea[name="content"], input[name="content"]',
  TASK_FILTER_ASSIGNEE_INPUT: 'input[name="assignee_id"]',
  TASK_FILTER_STATUS_INPUT: 'input[name="status_id"]',
  TASK_FILTER_LABEL_INPUT: 'input[name="label_id"]',
  LOGIN_USERNAME_INPUT: 'input[name="username"]',
  LOGIN_PASSWORD_INPUT: 'input[type="password"]',
  LOGIN_SUBMIT_BUTTON: 'button[type="submit"]:has-text("Sign in")',
  LOGOUT_BUTTON: 'button:has-text("Logout"), a:has-text("Logout")',
  PROFILE_BUTTON: 'button[aria-label="Profile"]',
  LOGOUT_MENU_ITEM: '[role="menuitem"]:has-text("Logout")',
  STATUSES_CREATE_BUTTON: 'a[href="#/task_statuses/create"]',
  USERS_CREATE_BUTTON: 'a[href="#/users/create"]',
  LABELS_CREATE_BUTTON: 'a[href="#/labels/create"]',
  TASKS_CREATE_BUTTON: 'a[href="#/tasks/create"]',
}

export const TIMEOUTS = {
  SHORT: 5000,
  MEDIUM: 10000,
  LONG: 30000,
}

export const TEST_CONSTANTS = {
  MAX_ROWS_TO_CHECK: 3,
}
