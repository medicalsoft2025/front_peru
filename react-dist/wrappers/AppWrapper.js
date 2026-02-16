import React from "react";
import { PersistentQueryProvider } from "./PersistentQueryProvider.js";
import { PrimeReactProvider } from "primereact/api";
export const AppWrapper = ({
  children
}) => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PersistentQueryProvider, null, /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
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
    }
  }, children)));
};