import { generateUUid } from '../../helper/index.js';
import { User } from './dto/schema.js';
import { UserModel } from './user.model.js';

// Creates a new user with a generated ID and saves it to the UserModel
export function createUser(user: Omit<User, 'id'>): User {
  const userData : User = {
    id: generateUUid(),
    ...user,
  };
  UserModel.set(userData);
  return userData;
}