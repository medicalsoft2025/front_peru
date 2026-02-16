import React from "react";
import { PersistentQueryProvider } from "./PersistentQueryProvider";
import { PrimeReactProvider } from "primereact/api";

interface AppWrapperProps {
    children: React.ReactNode;
}

export const AppWrapper = ({ children }: AppWrapperProps) => {
    return (<>
        <PersistentQueryProvider>
            <PrimeReactProvider value={{
                ripple: true,
                pt: {
                    menu: {
                        menu: {
                            style: {
                                padding: 0
                            }
                        }
                    },
                    dropdown: {
                        list: {
                            style: {
                                padding: 0
                            }
                        }
                    }
                }
            }}>
                {children}
            </PrimeReactProvider>
        </PersistentQueryProvider>
    </>);
};