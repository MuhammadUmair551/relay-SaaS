import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import Sidebar from "./components/layout/Sidebar";

export default function App() {
  return <RouterProvider router={router} />
}

