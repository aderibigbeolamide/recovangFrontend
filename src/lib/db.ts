import Dexie, { Table } from 'dexie';

export interface OfflineSubmission {
  id?: number;
  userId: string;
  category: string;
  estimatedWeight: number;
  photo?: Blob;
  status: 'pending' | 'synced' | 'failed';
  createdAt: number;
}

export class RecovangDB extends Dexie {
  submissions!: Table<OfflineSubmission>;

  constructor() {
    super('RecovangDB');
    this.version(1).stores({
      submissions: '++id, userId, status, createdAt'
    });
  }
}

export const db = new RecovangDB();
