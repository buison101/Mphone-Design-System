import { Component } from 'react';
import PropTypes from 'prop-types';

// project imports
import Maintenance from 'pages/maintenance/Maintenance';

// ==============================|| ERROR BOUNDARY ||============================== //
//
// Until this existed, a component that threw took the whole portal down to a
// white page — no message, no way back, and nothing in the interface to say
// whether the fault was the app or the network.
//
// It is a class because React offers no hook equivalent of componentDidCatch.
//
// It deliberately does not try to recover in place. A boundary that re-renders
// its children after a throw usually throws again on the next frame, and the
// reader watches the page flicker. Reload is offered instead, which is also the
// only thing that helps the most likely cause in a single-page application: a
// lazy chunk that no longer exists because the build behind it was replaced.
//
// The error is logged rather than shown. What a stack trace tells a customer is
// that something is broken in a way they cannot act on.

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error, info) {
    console.error('Portal render error', error, info?.componentStack);
  }

  render() {
    if (this.state.failed) return <Maintenance variant="serverError" />;
    return this.props.children;
  }
}

ErrorBoundary.propTypes = { children: PropTypes.node };
