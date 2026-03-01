import Landing from "./Landing/page";
import CreatePoll from "./CreatePoll/page";
import Vote from "./Vote/page";
import Results from "./Results/page";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />, // ✅ use element, not Component
  },
  {
    path: "/create",
    element: <CreatePoll />,
  },
  {
    path: "/vote/:pollId",
    element: <Vote />,
  },
  {
    path: "/results/:pollId",
    element: <Results />,
  },
]);
