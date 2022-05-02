import React from 'react';
import PlayerViews from './PlayerViews';

const exports = {...PlayerViews};

exports.Wrapper = class extends React.Component {
  render() {
    const {content} = this.props;
    return (
      <div className="Attacher">
        <h2>Attacher (Bob)</h2>
        {content}
      </div>
    );
  }
}

exports.Attach = class extends React.Component {
  render() {
    const {parent} = this.props;
    const {ctcInfoStr} = this.state || {};
    return (
      <div>
        Please paste the contract info to attach to:
        <br />
        <textarea spellCheck="false"
          className='ContractInfo'
          onChange={(e) => this.setState({ctcInfoStr: e.currentTarget.value})}
          placeholder='{}'
        />
        <br />
        <button
          disabled={!ctcInfoStr}
          onClick={() => parent.attach(ctcInfoStr)}
        >Attach</button>
      </div>
    );
  }
}

exports.Attaching = class extends React.Component {
  render() {
    return (
      <div>
        Attaching, please wait...
      </div>
    );
  }
}

exports.ReadFortune = class extends React.Component {
  render() {
    const {parent, playable, fortune} = this.props;
    return (
      <div>
        {fortune ? 'It was denied. Pick again.' : ''}
        <br />
        {!playable ? 'Please wait...' : ''}
        <br />
        <button
          disabled={!playable}
          onClick={() => parent.chooseFortune('Millionaire')}
        >Millionaire</button>
        <button
          disabled={!playable}
          onClick={() => parent.chooseFortune('Billionaire')}
        >Billionaire</button>
        <button
          disabled={!playable}
          onClick={() => parent.chooseFortune('Trillionaire')}
        >Trillionaire</button>
      </div>
    );
  }
}

exports.WaitingForDecision = class extends React.Component {
  render() {
    return (
      <div>
        Waiting for the decision...
        <br />Think about which fortune you want to read next.
      </div>
    );
  }
}

export default exports;