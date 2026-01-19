/**
 * Purpose: Router configuration using createBrowserRouter data API.
 * Exports: router (BrowserRouter instance)
 * Side effects: None
 *
 * Uses React Router v6.4+ data loading features:
 * - Route-level loaders for data fetching
 * - Error boundaries per route
 * - Lazy loading with React.lazy
 */

import { createBrowserRouter, type LoaderFunctionArgs } from 'react-router-dom';
import { lazy } from 'react';
import MainLayout from './layouts/MainLayout';
import { Chapters, type IChapter } from '@astranova/catalogues';
import { getEventById, type IEventDetails } from './data/mockData';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const ChapterDetails = lazy(() => import('./pages/ChapterDetails'));
const EventDetails = lazy(() => import('./pages/EventDetails'));
const NotFound = lazy(() => import('./pages/NotFound'));

// ==================== LOADERS ====================

/**
 * Chapter loader - fetches chapter data by acronym
 * @throws Response with 404 if chapter not found
 */
export async function chapterLoader({ params }: LoaderFunctionArgs): Promise<IChapter> {
    const { chapterId } = params;

    if (!chapterId) {
        throw new Response('Chapter ID required', { status: 400 });
    }

    const chapter = Chapters.find(
        ch => ch.acronym.toLowerCase() === chapterId.toLowerCase()
    );

    if (!chapter) {
        throw new Response(`Chapter "${chapterId}" not found`, { status: 404 });
    }

    return chapter;
}

/**
 * Event loader - fetches event data by ID
 * @throws Response with 404 if event not found
 */
export async function eventLoader({ params }: LoaderFunctionArgs): Promise<IEventDetails> {
    const { eventId } = params;

    if (!eventId) {
        throw new Response('Event ID required', { status: 400 });
    }

    const event = getEventById(eventId);

    if (!event) {
        throw new Response(`Event "${eventId}" not found`, { status: 404 });
    }

    return event;
}

// ==================== ROUTER ====================

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: 'chapters/:chapterId',
                element: <ChapterDetails />,
                loader: chapterLoader,
                errorElement: <NotFound />,
            },
            {
                path: 'events/:eventId',
                element: <EventDetails />,
                loader: eventLoader,
                errorElement: <NotFound />,
            },
            {
                path: '*',
                element: <NotFound />,
            },
        ],
    },
]);
