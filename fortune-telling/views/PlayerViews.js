import React from 'react';

const exports = {};

// Player views must be extended.
// It does not have its own Wrapper view.

exports.Done = class extends React.Component {
  render() {
    return (
      <div>
        Thank you for playing.
      </div>
    );
  }
}

export default exports;