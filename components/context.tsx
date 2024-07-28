"use client";
import { createContext, useState } from "react";

export const StatusChangesContext = createContext<any[]>([])

export default function ContexProvider({children,}: Readonly<{children: React.ReactNode;}>) {

  const [statusChanges, setStatusChanges] = useState<any>([]);

  return (
    
        <StatusChangesContext.Provider value={{statusChanges,setStatusChanges}}>

            {children}

        </StatusChangesContext.Provider>
    
  );
}
