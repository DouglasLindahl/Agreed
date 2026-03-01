import { createBrowserRouter } from "react-router";
import Landing from "./pages/Landing";
import CreatePoll from "./pages/CreatePoll";
import Vote from "./pages/Vote";
import Results from "./pages/Results";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/create",
    Component: CreatePoll,
  },
  {
    path: "/vote/:pollId",
    Component: Vote,
  },
  {
    path: "/results/:pollId",
    Component: Results,
  },
]);
