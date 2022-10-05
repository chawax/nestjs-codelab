import { BearerGuard } from './bearer.guard';

describe('BearerGuard', () => {
  it('should be defined', () => {
    expect(new BearerGuard()).toBeDefined();
  });
});
