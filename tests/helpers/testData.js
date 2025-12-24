export const testUsers = {
  valid: {
    login: 'testuser',
    password: 'testpassword',
  },
  admin: {
    login: 'admin',
    password: '12345',
  },
  user1: {
    login: 'user1',
    password: 'pass1',
  },
  user2: {
    login: 'user2',
    password: 'pass2',
  },
}

export function generateUserData() {
  const ts = Date.now()
  return {
    email: `test${ts}@example.com`,
    firstName: 'Test',
    lastName: 'User',
  }
}

export function generateEditedUserData() {
  const ts = Date.now()
  return {
    email: `edited${ts}@example.com`,
    firstName: 'Edited',
    lastName: 'Name',
  }
}

export function generateStatusData() {
  const ts = Date.now()
  return {
    name: `Test Status ${ts}`,
    slug: `test-status-${ts}`,
  }
}

export function generateEditedStatusData() {
  const ts = Date.now()
  return {
    name: `Edited Status ${ts}`,
    slug: `edited-status-${ts}`,
  }
}

export function generateLabelData() {
  const ts = Date.now()
  return {
    name: `Test Label ${ts}`,
  }
}

export function generateEditedLabelData() {
  const ts = Date.now()
  return {
    name: `Edited Label ${ts}`,
  }
}

export function generateTaskData() {
  const ts = Date.now()
  return {
    title: `Test Task ${ts}`,
    content: `Description ${ts}`,
  }
}

export function generateEditedTaskData() {
  const ts = Date.now()
  return {
    title: `Edited Task ${ts}`,
    content: `Edited description ${ts}`,
  }
}
