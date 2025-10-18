import { Homepage } from "@/pages/homepage";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
]);

export default router;
