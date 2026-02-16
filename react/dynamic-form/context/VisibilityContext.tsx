import React, { createContext, useContext } from "react";

interface VisibilityContextValue {
    isVisible: boolean;
}

const VisibilityContext = createContext<VisibilityContextValue>({
    isVisible: true,
});

export const useVisibility = () => useContext(VisibilityContext);

export const VisibilityProvider: React.FC<{ isVisible: boolean; children: React.ReactNode }> = ({
    isVisible,
    children,
}) => {
    const parentVisibility = useVisibility();
    // A component is visible only if it is visible AND its parent is visible
    const actualVisibility = isVisible && parentVisibility.isVisible;

    return (
        <VisibilityContext.Provider value={{ isVisible: actualVisibility }}>
            {children}
        </VisibilityContext.Provider>
    );
};
