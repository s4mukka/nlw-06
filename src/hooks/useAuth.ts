import { useContext } from "react";

import { AuthContext, AuthContextType } from "../contexts";

export const useAuth = (): AuthContextType => useContext(AuthContext);
