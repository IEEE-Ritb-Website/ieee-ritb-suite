import { createBrowserRouter, Outlet, type RouteObject } from "react-router";
import { HomePage } from "@/pages/home-page";
import { RootLayout } from "@/layouts/root-layout";
import { ThemeProvider } from "@/components/providers/theme-provider";

const routes: RouteObject[] = [
    {
        path: "/",
        element:
            <ThemeProvider>
                <RootLayout><Outlet /></RootLayout>
            </ThemeProvider>,
        children: [
            {
                path: "/",
                element: <HomePage />,
            },
        ]
    }
]

export const router = createBrowserRouter(routes);