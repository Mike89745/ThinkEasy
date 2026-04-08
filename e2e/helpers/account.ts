//Melo by byt v .env, ale pro jednoduchost je to tady
export const TEST_ACCOUNT = {
  email: 'nbvcx@nbvcx.xz',
  password: 'test123A',
};

export function generateRandomAccount() {
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  return {
    firstName: `Test${id}`,
    lastName: `User${id}`,
    email: `e2e-${id}@test.cz`,
    password: 'Test1234!',
  };
}
