"use client"; // must be first

import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Landing from "./Landing/page";
import CreatePoll from "./CreatePoll/page";
import Vote from "./Vote/page";
import Results from "./Results/page";

// define routes inside client component
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRouteLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: "create", element: <CreatePoll /> },
      { path: "vote/:pollId", element: <Vote /> },
      { path: "results/:pollId", element: <Results /> },
    ],
  },
]);

function RootRouteLayout() {
  return (
    <>
      <Toaster />
      <Outlet /> {/* renders current route */}
    </>
  );
}

export default function ClientRouter() {
  return <RouterProvider router={router} />;
}
