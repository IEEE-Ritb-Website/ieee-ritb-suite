import { createBrowserRouter, Outlet, type RouteObject } from "react-router";
import { HomePage } from "@/pages/home-page";
import { RootLayout } from "@/layouts/root-layout";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { URLShortenerPage } from "@/pages/url-shortener-page";
import { ShowcasePage } from "@/pages/showcase-page";
import { ScrollHandler } from "@/handlers/scroll-handler";
import { Toaster } from "@/components/ui/sonner";

const routes: RouteObject[] = [
    {
        path: "/",
        element:
            <ThemeProvider>
                <RootLayout><Outlet /></RootLayout>
                <Toaster />
                <ScrollHandler />
            </ThemeProvider>,
        children: [
            {
                path: "/",
                element: <HomePage />,
            },
            {
                path: "/shortener",
                element: <URLShortenerPage />,
            },
            {
                path: "/showcase",
                element: <ShowcasePage />,
            },
        ]
    }
]

export const router = createBrowserRouter(routes);