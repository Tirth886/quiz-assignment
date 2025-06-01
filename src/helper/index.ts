import { v4 as uuidv4 } from 'uuid';

// Generates a unique UUID string
export const generateUUid = () => uuidv4();

// Generates a unique mapping ID by concatenating userId and questionId
export const generateUserQusestionMappingId = (userId: string, questionId: string) => userId + '_' + questionId;