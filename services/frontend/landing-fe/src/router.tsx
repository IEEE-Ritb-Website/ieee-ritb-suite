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

import { createBrowserRouter, type LoaderFunctionArgs } from "react-router-dom";
import { lazy } from "react";
import MainLayout from "./layouts/MainLayout";
import { Chapters, type IChapter } from "@astranova/catalogues";
import { getEventById, type IEventDetails } from "./data/mockData";
import { fetchSBOfficers, fetchChapterTeam } from "./data/teamData";
import type { ITeamMember } from "./types/team";

// Lazy load pages for code splitting
const Home = lazy(() => import("./pages/Home"));
const ChapterDetails = lazy(() => import("./pages/ChapterDetails"));
const EventDetails = lazy(() => import("./pages/EventDetails"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Team = lazy(() => import("./pages/Team"));
const ChapterTeam = lazy(() => import("./pages/ChapterTeam"));

// ==================== LOADERS ====================

export async function chapterLoader({
  params,
}: LoaderFunctionArgs): Promise<{ chapter: IChapter; members: ITeamMember[] }> {
  const { chapterId } = params;

  if (!chapterId) {
    throw new Response("Chapter ID required", { status: 400 });
  }

  const chapter = Chapters.find(
    (ch) => ch.acronym.toLowerCase() === chapterId.toLowerCase(),
  );

  if (!chapter) {
    throw new Response(`Chapter "${chapterId}" not found`, { status: 404 });
  }

  const members = await fetchChapterTeam(chapterId);

  return { chapter, members };
}

/**
 * Event loader - fetches event data by ID
 * @throws Response with 404 if event not found
 */
export async function eventLoader({
  params,
}: LoaderFunctionArgs): Promise<IEventDetails> {
  const { eventId } = params;

  if (!eventId) {
    throw new Response("Event ID required", { status: 400 });
  }

  const event = getEventById(eventId);

  if (!event) {
    throw new Response(`Event "${eventId}" not found`, { status: 404 });
  }

  return event;
}

/**
 * Team loader — fetches Student Branch officers for the /team page
 */
export async function teamLoader(): Promise<ITeamMember[]> {
  return fetchSBOfficers();
}

/**
 * Chapter team loader — fetches chapter + all members for /team/:chapterId
 * @throws Response with 404 if chapter acronym is not in @astranova/catalogues
 */
export async function chapterTeamLoader({
  params,
}: LoaderFunctionArgs): Promise<{ chapter: IChapter; members: ITeamMember[] }> {
  const { chapterId } = params;

  if (!chapterId) {
    throw new Response("Chapter ID required", { status: 400 });
  }

  const chapter = Chapters.find(
    (ch) => ch.acronym.toLowerCase() === chapterId.toLowerCase(),
  );

  if (!chapter) {
    throw new Response(`Chapter "${chapterId}" not found`, { status: 404 });
  }

  const members = await fetchChapterTeam(chapterId);
  return { chapter, members };
}

// ==================== ROUTER ====================

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "chapters/:chapterId",
        element: <ChapterDetails />,
        loader: chapterLoader,
        errorElement: <NotFound />,
      },
      {
        path: "events/:eventId",
        element: <EventDetails />,
        loader: eventLoader,
        errorElement: <NotFound />,
      },
      {
        path: "team",
        element: <Team />,
        loader: teamLoader,
        errorElement: <NotFound />,
      },
      {
        path: "team/:chapterId",
        element: <ChapterTeam />,
        loader: chapterTeamLoader,
        errorElement: <NotFound />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
