import { AdminGuard } from './auth.guard';

describe('AuthGuard', () => {
  it('should be defined', () => {
    expect(new AdminGuard()).toBeDefined();
  });
});
