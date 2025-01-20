import { createContext } from "react";

export const AppContext = createContext()

const AppContextProvider = (prop) =>
{
    const value = {
        
    }
    return (
        <AppContext.Provider value={value}>
            {prop.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider