import React from 'react';
import { expect } from 'chai';
import Enzyme, { shallow } from 'enzyme';
import { Base } from '../lib/base-component-react.js';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

class TestComp extends Base {
  constructor(props) {
    super(props);

    this.loadState({ name: 'My test component' });
  }

  render() {
    return <div>{this.state.name}</div>;
  }
}

describe('<TestComp />', () => {
  it('contains "<div>My test component</div>"', () => {
    const wrapper = shallow(<TestComp />);

    expect(wrapper.contains(<div>My test component</div>)).to.equal(true);
  });

  it('state.name should be equal to Hello', () => {
    const wrapper = shallow(<TestComp />);

    wrapper.instance().setState({ name: 'Hello' });
    expect(wrapper.instance().state.name).to.equal('Hello');
  });

  it('state.name shouldn\'t be equal to Hello', () => {
    const wrapper = shallow(<TestComp />);

    wrapper.instance().setState({ name: 'name' });
    expect(wrapper.instance().state.name).to.not.equal('Hello');
  });
});
