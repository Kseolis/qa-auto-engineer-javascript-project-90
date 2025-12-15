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
  return {
    email: `test${Date.now()}@example.com`,
    firstName: 'Test',
    lastName: 'User',
  }
}

export function generateEditedUserData() {
  return {
    email: `edited${Date.now()}@example.com`,
    firstName: 'Edited',
    lastName: 'Name',
  }
}

export function generateStatusData() {
  return {
    name: `Test Status ${Date.now()}`,
    slug: `test-status-${Date.now()}`,
  }
}

export function generateEditedStatusData() {
  return {
    name: `Edited Status ${Date.now()}`,
    slug: `edited-status-${Date.now()}`,
  }
}

export function generateLabelData() {
  return {
    name: `Test Label ${Date.now()}`,
  }
}

export function generateEditedLabelData() {
  return {
    name: `Edited Label ${Date.now()}`,
  }
}
