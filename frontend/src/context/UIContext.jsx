import { createContext, useContext, useState } from 'react'

const UIContext = createContext(null)

export function UIProvider({ children }) {
  const [pesoModal, setPesoModal] = useState(false)

  return (
    <UIContext.Provider value={{ pesoModal, setPesoModal }}>
      {children}
    </UIContext.Provider>
  )
}

export const useUI = () => useContext(UIContext)