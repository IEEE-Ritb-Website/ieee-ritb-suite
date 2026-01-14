import { useState, useEffect } from 'react';
import { Chapters, type IChapter } from '@astranova/catalogues';
import { getEventById, type IEventDetails } from '../data/mockData';

interface UseEntityDataResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

/**
 * useEntityData Hook
 * 
 * Retrieves entity data by ID for chapters and events.
 * Handles loading states and graceful error handling.
 * 
 * @param id - Entity ID (chapter acronym or event ID)
 * @param type - Entity type ('chapter' or 'event')
 */
export function useEntityData<T extends IChapter | IEventDetails>(
    id: string | undefined,
    type: 'chapter' | 'event'
): UseEntityDataResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            setError('No ID provided');
            return;
        }

        setLoading(true);
        setError(null);

        // Simulate async data fetching (in production, this could be an API call)
        const fetchData = () => {
            try {
                if (type === 'chapter') {
                    // Find chapter by acronym (case-insensitive)
                    const chapter = Chapters.find(
                        ch => ch.acronym.toLowerCase() === id.toLowerCase()
                    );

                    if (chapter) {
                        setData(chapter as T);
                    } else {
                        setError(`Chapter "${id}" not found`);
                    }
                } else if (type === 'event') {
                    const event = getEventById(id);

                    if (event) {
                        setData(event as T);
                    } else {
                        setError(`Event "${id}" not found`);
                    }
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        // Small delay to simulate network request
        const timer = setTimeout(fetchData, 100);
        return () => clearTimeout(timer);
    }, [id, type]);

    return { data, loading, error };
}

/**
 * useChapter Hook
 * Convenience wrapper for fetching chapter data
 */
export function useChapter(acronym: string | undefined) {
    return useEntityData<IChapter>(acronym, 'chapter');
}

/**
 * useEvent Hook
 * Convenience wrapper for fetching event data
 */
export function useEvent(eventId: string | undefined) {
    return useEntityData<IEventDetails>(eventId, 'event');
}
