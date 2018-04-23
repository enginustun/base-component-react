# base-component-react

Base React component that provides built-in &amp; lite state management and handler binding functionality.

## Installing

```
npm i base-component-react
```

**base-component-react** needs `react v >= 16` to work. Install it if you don't do it already.

```
npm i react --save
```

## Getting Started

You will be able to store your state via only one method call and this base component will make everything for you.
Also you can bind your handlers easily through a function.

## Available Methods

```es6
// bind function to classes which will be extended from this base class
// use this function to bind functions to be able to access 'this' parameter in them
bindHandlers(...funcs){}

// if you want to activate Redux-like state transfer between components
// you can create state object globally
// with this function in components which are inherited from this class
loadState(initialState, enableLocalStorage, desiredProperties){}

// generel refresh function
// use this function rather than React's "setState" function
// it doesn't support functional parameter yet
refresh(options){}
```

## Usage

There are three easy function to use this library:

* You should use `loadState` function to initialize state.
* You should use `refresh` function to set state instead of `setState`.
* You can use `bindHandlers` function to bind handlers.

If you want to transfer state between components, you should use first 2 functions(`loadState` and `refresh`) together. These are very useful to combine with [ReactRouter](https://github.com/ReactTraining/react-router)(I mean if you are developing SPA these functions are life-saver).

Third function is not related them, it is only helper function to bind event handlers.

```es6
import React from 'react';
import { Base as BaseComponent } from 'base-component-react';

export default class TestComponent extends BaseComponent {
  constructor(props) {
    super(props);

    // this method will initialize the state and watch it
    // (first parameter): initialState
    // if it is changed, state will be saved localStorage based on second parameter
    // (second parameter): enableLocalStorage -> do you want to save state to localStorage?
    // can be an integer as milliseconds to specify saving period of state to localStorage
    // (third parameter): desiredProperties -> which properties of state do you want to store?
    // this kind of usage only stores and loads 'users' property
    // counter property only will be stored until browser refresh
    this.loadState({ users: [], counter: 0 }, true, ['users']);

    // bind event handlers to be able to access "this" parameter as this component
    this.bindHandlers('increase', 'decrease');
  }

  increase() {
    // use refresh function instead of setState
    // it has same usage as setState
    this.refresh({ counter: this.state.counter + 1 });
  }

  decrease() {
    this.refresh({ counter: this.state.counter - 1 });
  }

  render() {
    return (
      <div>
        <hr />
        <div>
          <strong>{this.state.counter}</strong>
          <br />
          <button onClick={this.increase}>Increase</button>
          <button onClick={this.decrease}>Decrease</button>
          <hr />
          <div>
            {this.state.users.map((user, i) => {
              return <div key={i}>{user.name}</div>;
            })}
            <div>
              <button
                onClick={() => {
                  const newUsers = Object.assign([], this.state.users);
                  newUsers.push({ name: 'Engin' });
                  this.refresh({ users: newUsers });
                }}
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
```

---

## Contributing

Any contributions are welcome, feel free to submit a pull request for review.

## Running the tests

Test scripts are under the `test/` folder. There is a file in it named `index.spec.js` as an example. To run tests:

```
npm run test
```

## Built With

* [webpack-library-starter](https://github.com/krasimir/webpack-library-starter) - Webpack based boilerplate for producing libraries (Input: ES6, Output: universal library)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Purpose

I started to develop this library to get rid of workload of [Redux](https://github.com/reactjs/redux) implementation to our already-developed projects.

For projects which will be started over I strongly encourage you to use Redux.