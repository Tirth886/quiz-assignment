import { expect } from 'chai';
import { describe, it } from 'mocha';
import { createUser } from './user.service.js';

describe('User session integration test', () => {
  it('→ should create a new user with a generated ID', () => {
    const userInput = { name: 'Alice' };
    const newUser = createUser(userInput);
    expect(newUser).to.have.property('id').that.is.a('string');
    expect(newUser).to.have.property('name', 'Alice');
  });
});
