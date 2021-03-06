import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import { DownloadLetters } from '../../../src/js/letters/containers/DownloadLetters';

const defaultProps = {
  location: {
    pathname: '/confirm-address'
  },
  router: {
    push: sinon.spy()
  }
};

describe('<DownloadLetters>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<DownloadLetters {...defaultProps}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.exist;
  });

  it('should render button when at /confirm-address', () => {
    const tree = SkinDeep.shallowRender(<DownloadLetters {...defaultProps}/>);
    const stepHeader = tree.dive(['StepHeader']);
    const button = stepHeader.subTree('button');
    expect(button).to.exist;
  });

  it('should navigate to /letter-list when button is clicked', () => {
    const component = ReactTestUtils.renderIntoDocument(<DownloadLetters {...defaultProps}/>);
    const button = ReactTestUtils.findRenderedDOMComponentWithClass(component, 'view-letters-button');
    ReactTestUtils.Simulate.click(button);

    expect(defaultProps.router.push.calledWith('/letter-list')).to.be.true;
  });
});

