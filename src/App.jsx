import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import Load from "./pages/Load";
import Loading from "./pages/Loading";
import Preload from "./pages/Preload";
import List from "./pages/List";

function App() {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  return (
    <>
      {currentPath !== "/" && <Header />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/load" element={<Load />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/preload" element={<Preload />} />
          <Route path="/list" element={<List />} />
        </Routes>
    </>
  );
}

export default App;