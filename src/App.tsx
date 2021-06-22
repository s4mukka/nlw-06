import { AuthContextProvider } from "./contexts";
import { Routes } from "./Routes";

function App() {
  return (
    <AuthContextProvider>
      <Routes />
    </AuthContextProvider>
  );
}

export default App;
