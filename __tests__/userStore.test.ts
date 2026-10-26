import { useUserStore } from '../src/store/userStore';

describe('BrewBox Local Authentication & Registration Tests', () => {
  beforeEach(() => {
    // Reset state before each test
    useUserStore.setState({
      registeredUsers: [],
      isAuthenticated: false,
      profile: null,
      orders: [],
    });
  });

  test('should start with unauthenticated state and no default account', () => {
    const store = useUserStore.getState();
    expect(store.isAuthenticated).toBe(false);
    expect(store.profile).toBeNull();
    expect(store.registeredUsers.length).toBe(0);
    expect(store.orders.length).toBe(0);
  });

  test('should allow user signup, store password locally, and log in user', () => {
    const store = useUserStore.getState();

    const signupResult = store.signup({
      name: 'Varad Mandhare',
      email: 'varad@brewbox.craft',
      phone: '+91 98765 43210',
      password: 'CoffeeSecret2026',
    });

    expect(signupResult.success).toBe(true);

    const updated = useUserStore.getState();
    expect(updated.isAuthenticated).toBe(true);
    expect(updated.profile).not.toBeNull();
    expect(updated.profile?.name).toBe('Varad Mandhare');
    expect(updated.profile?.email).toBe('varad@brewbox.craft');
    expect(updated.profile?.memberPoints).toBe(100); // 100 welcome bean rewards
    expect(updated.profile?.memberTier).toBe('Artisan Bronze');

    // Stored locally in registeredUsers
    expect(updated.registeredUsers.length).toBe(1);
    expect(updated.registeredUsers[0].password).toBe('CoffeeSecret2026');
  });

  test('should reject duplicate email during signup', () => {
    const store = useUserStore.getState();

    store.signup({
      name: 'Varad Mandhare',
      email: 'varad@brewbox.craft',
      phone: '+91 98765 43210',
      password: 'Password123',
    });

    const duplicateResult = store.signup({
      name: 'Another Connoisseur',
      email: 'varad@brewbox.craft',
      phone: '+91 99999 88888',
      password: 'AnotherPassword',
    });

    expect(duplicateResult.success).toBe(false);
    expect(duplicateResult.error).toContain('already exists');
  });

  test('should log out user and reset authentication state', () => {
    const store = useUserStore.getState();

    store.signup({
      name: 'Varad Mandhare',
      email: 'varad@brewbox.craft',
      phone: '+91 98765 43210',
      password: 'Password123',
    });

    expect(useUserStore.getState().isAuthenticated).toBe(true);

    // Perform logout
    useUserStore.getState().logout();

    const loggedOutState = useUserStore.getState();
    expect(loggedOutState.isAuthenticated).toBe(false);
    expect(loggedOutState.profile).toBeNull();
    // User record is still preserved in local registeredUsers for future signin
    expect(loggedOutState.registeredUsers.length).toBe(1);
  });

  test('should allow user to sign in with locally stored credentials', () => {
    const store = useUserStore.getState();

    // Register user first
    store.signup({
      name: 'Varad Mandhare',
      email: 'varad@brewbox.craft',
      phone: '+91 98765 43210',
      password: 'MySecretPassword',
    });

    // Log out
    store.logout();
    expect(useUserStore.getState().isAuthenticated).toBe(false);

    // Attempt sign in with wrong password
    const wrongPassResult = useUserStore.getState().login('varad@brewbox.craft', 'WrongPassword');
    expect(wrongPassResult.success).toBe(false);
    expect(wrongPassResult.error).toContain('Incorrect password');
    expect(useUserStore.getState().isAuthenticated).toBe(false);

    // Attempt sign in with unknown email
    const unknownEmailResult = useUserStore.getState().login('stranger@test.com', 'MySecretPassword');
    expect(unknownEmailResult.success).toBe(false);
    expect(unknownEmailResult.error).toContain('No account found');

    // Attempt sign in with correct credentials
    const correctResult = useUserStore.getState().login('varad@brewbox.craft', 'MySecretPassword');
    expect(correctResult.success).toBe(true);
    expect(useUserStore.getState().isAuthenticated).toBe(true);
    expect(useUserStore.getState().profile?.name).toBe('Varad Mandhare');
  });
});
