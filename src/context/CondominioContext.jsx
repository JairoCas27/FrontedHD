import { createContext, useContext, useState } from 'react';

const CondominioContext = createContext();

export const CondominioProvider = ({ children }) => {
    const [idCondominio, setIdCondominio] = useState(1);

    return (
        <CondominioContext.Provider value={{ idCondominio, setIdCondominio }}>
            {children}
        </CondominioContext.Provider>
    );
};

export const useCondominio = () => useContext(CondominioContext);