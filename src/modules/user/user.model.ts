import { InMemoryDB } from '../../provider/InMemoryDB.js';
import { User } from './dto/schema.js';

// In-memory database instance for storing User objects
export const UserModel = new InMemoryDB<User>();
