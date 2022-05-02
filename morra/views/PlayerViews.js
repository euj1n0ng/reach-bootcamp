import React from 'react';

const exports = {};

// Player views must be extended.
// It does not have its own Wrapper view.

exports.GetFingers = class extends React.Component {
  render() {
    const {parent, playable, fingers} = this.props;
    const FINGERS = ['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE'];
    return (
      <div>
        {fingers ? 'It was a draw! Pick again.' : ''}
        <br />
        {!playable ? 'Please wait...' : ''}
        <br />
        {FINGERS.map((fingers, index) => (
        <button
          key={index}
          disabled={!playable}
          onClick={() => parent.playFingers(fingers)}
        >{fingers}</button>
        ))}
      </div>
    );
  }
}

exports.GetGuess = class extends React.Component {
  render() {
    const {parent, playable, guess, fingers} = this.props;
    const GUESS = ['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN'];
    return (
      <div>
        {guess ? 'It was a draw! Pick again.' : ''}
        <br />
        {!playable ? 'Please wait...' : ''}
        <br />
        {GUESS.slice(fingers).map((guess, index) => (
        <button
          key={index}
          disabled={!playable}
          onClick={() => parent.playGuess(guess)}
        >{guess}</button>
        ))}
      </div>
    );
  }
}

exports.WaitingForResults = class extends React.Component {
  render() {
    return (
      <div>
        Waiting for results...
      </div>
    );
  }
}

exports.WinningNumber = class extends React.Component {
  render() {
    const {totalFingers} = this.props;
    return (
      <div>
        Actual total fingers thrown:
        <br />{totalFingers || 'Unknown'}
      </div>
    );
  }
}

exports.Done = class extends React.Component {
  render() {
    const {outcome} = this.props;
    return (
      <div>
        Thank you for playing. The outcome of this game was:
        <br />{outcome || 'Unknown'}
      </div>
    );
  }
}

exports.Timeout = class extends React.Component {
  render() {
    return (
      <div>
        There's been a timeout. (Someone took too long.)
      </div>
    );
  }
}

export default exports;