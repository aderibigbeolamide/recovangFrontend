import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';
import api from '../services/api';

export const useOfflineSync = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const pendingSubmissions = useLiveQuery(
    () => db.submissions.where('status').equals('pending').toArray()
  );

  const syncSubmissions = async () => {
    if (!pendingSubmissions || pendingSubmissions.length === 0 || isSyncing) return;

    setIsSyncing(true);
    console.log(`Attempting to sync ${pendingSubmissions.length} submissions...`);

    for (const submission of pendingSubmissions) {
      try {
        const formData = new FormData();
        formData.append('category', submission.category);
        formData.append('estimatedWeight', submission.estimatedWeight.toString());
        if (submission.photo) {
          formData.append('photo', submission.photo);
        }

        await api.post('/submissions/sync', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        await db.submissions.update(submission.id!, { status: 'synced' });
        console.log(`Synced submission ${submission.id}`);
      } catch (error) {
        console.error(`Failed to sync submission ${submission.id}`, error);
        // We'll retry later
      }
    }
    setIsSyncing(false);
  };

  useEffect(() => {
    const handleOnline = () => {
      console.log('Back online, initiating sync...');
      syncSubmissions();
    };

    window.addEventListener('online', handleOnline);
    
    // Also try syncing on mount if online
    if (navigator.onLine) {
      syncSubmissions();
    }

    return () => window.removeEventListener('online', handleOnline);
  }, [pendingSubmissions]);

  return {
    pendingCount: pendingSubmissions?.length || 0,
    isSyncing
  };
};
