import { Toaster } from "react-hot-toast";

import { AuthContextProvider } from "./contexts";
import { Routes } from "./Routes";

function App() {
  return (
    <AuthContextProvider>
      <Toaster />
      <Routes />
    </AuthContextProvider>
  );
}

export default App;
