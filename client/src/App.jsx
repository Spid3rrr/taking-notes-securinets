import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Notes from "./components/Notes";
import AddNote from "./components/AddNote";
import NoteDetails from "./components/NoteDetails";
import Admin from "./components/Admin";
import "./App.css";

function App() {
  const unloggedRoutes = [
    {
      path: "/",
      name: "Home",
      element: <Home />,
    },
    {
      path: "/login",
      name: "Login",
      element: <Login />,
    },
    {
      path: "/signup",
      name: "Register",
      element: <Register />,
    },
  ];
  const loggedRoutes = [
    {
      path: "/",
      name: "My notes",
      element: <Notes />,
    },
    {
      path: "/add_note",
      name: "Add note",
      element: <AddNote />,
    },
    {
      path: "/note/:id",
      element: <NoteDetails />,
    },
    {
      path: "/admin",
      name: "Admin",
      element: <Admin />,
    },
  ];
  // check if local storage has token
  const token = localStorage.getItem("token");
  const [logged, setLogged] = useState(token ? true : false);
  const [user, setUser] = useState(token ? localStorage.getItem("user") : null);
  const [notes, setNotes] = useState([]);
  const [routes, setRoutes] = useState(logged ? loggedRoutes : unloggedRoutes);
  const router = createBrowserRouter(routes);

  return (
    <div data-theme="light" className="bg-transparent text-white">
      <div className="text-3xl mb-12">
        Welcome to our amazing Note Taking app !
      </div>
      <nav>
        <ul className="w-full flex flex-row space-x-8 justify-center mb-20">
          {routes.map(
            (route) =>
              route.name && (
                <li
                  key={route.path}
                  className="px-4 py-1 center text-xl font-medium rounded-xl border-2 border-white transition hover:bg-white hover:text-blue-500 ease-in-out duration-300"
                >
                  <a key={route.path} href={route.path}>
                    {route.name}
                  </a>
                </li>
              )
          )}
          {logged && (
            <li
              key="logout"
              className="px-4 py-1 center text-xl font-medium rounded-xl border-2 border-white transition hover:bg-white hover:text-blue-500 ease-in-out duration-300"
            >
              <a
                key="logout"
                href="/login"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  setLogged(false);
                  setUser(null);
                }}
              >
                Logout
              </a>
            </li>
          )}
        </ul>
      </nav>
      <div>
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
