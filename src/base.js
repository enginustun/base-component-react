import React from 'react';
const globalState = {};

// returns desired object with specified properties
const getDesiredObject = (state, desiredProperties) => {
  const desiredObject = {};

  if (Array.isArray(desiredProperties) && desiredProperties.length > 0) {
    desiredProperties.forEach(key => {
      desiredObject[key] = state[key];
    });
  } else {
    return state;
  }
  return desiredObject;
};

export default class BaseComponent extends React.Component {
  // bind function to classes which will be extended from this base class
  // use this function to bind functions to be able to access 'this' parameter in them
  bindHandlers(...funcs) {
    funcs.forEach(func => {
      if (this[func] && this[func].bind) {
        this[func] = this[func].bind(this);
      }
    });
  }

  // if you want to activate Redux-like state transfer between components
  // you can create state object globally
  // with this function in components which are inherited from this class
  loadState(initialState, enableLocalStorage, desiredProperties) {
    if (enableLocalStorage) {
      globalState[`enable-local-storage-${this.constructor.name}`] = enableLocalStorage;
      globalState[`desired-properties-${this.constructor.name}`] = desiredProperties;
      globalState[`save-delay-${this.constructor.name}`] = parseInt(enableLocalStorage, 10) || 1000;
      try {
        globalState[this.constructor.name] = Object.assign(
          {},
          globalState[this.constructor.name],
          JSON.parse(localStorage.getItem(`state-${this.constructor.name}`))
        );
      } catch (error) {
        // ignore
      }
    }

    globalState[this.constructor.name] = globalState[this.constructor.name] || {};
    this.state = globalState[this.constructor.name];

    Object.keys(initialState).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(globalState[this.constructor.name], key)) {
        globalState[this.constructor.name][key] = initialState[key];
      }
    });
  }

  // generel refresh function
  // use this function rather than React's "setState" function
  // it doesn't support functional parameter yet
  refresh(options) {
    const freshState = {};
    const opt = options || {};
    let changed = false;

    Object.keys(this.state).forEach(key => {
      if (Object.prototype.hasOwnProperty.call(opt, key)) {
        freshState[key] = opt[key];
        globalState[this.constructor.name][key] = freshState[key];
        changed = true;
      }
    });

    // check if there are any changes
    if (changed) {
      if (globalState[`enable-local-storage-${this.constructor.name}`]) {
        try {
          // if localStorage is enabled by user, save state object to localStorage
          if (globalState[`save-timeout-${this.constructor.name}`]) {
            clearTimeout(globalState[`save-timeout-${this.constructor.name}`]);
          }
          globalState[`save-timeout-${this.constructor.name}`] = setTimeout(() => {
            localStorage.setItem(
              `state-${this.constructor.name}`,
              JSON.stringify(
                getDesiredObject(
                  globalState[this.constructor.name],
                  globalState[`desired-properties-${this.constructor.name}`]
                )
              )
            );
          }, globalState[`save-delay-${this.constructor.name}`]);
        } catch (error) {
          // ignore
        }
      }
      this.setState(state => {
        return freshState;
      });
    }
  }
}
