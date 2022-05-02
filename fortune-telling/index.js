import React from 'react';
import AppViews from './views/AppViews';
import DeployerViews from './views/DeployerViews';
import AttacherViews from './views/AttacherViews';
import {renderDOM, renderView} from './views/render';
import './index.css';
import * as backend from './build/index.main.mjs';
import { loadStdlib } from '@reach-sh/stdlib';
const reach = loadStdlib(process.env);

const fortuneToInt = {'Millionaire': 0, 'Billionaire': 1, 'Trillionaire': 2};
const {standardUnit} = reach;
const defaults = {defaultFundAmt: '10', defaultPayment: '3', standardUnit};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {view: 'ConnectAccount', ...defaults};
  }
  async componentDidMount() {
    const acc = await reach.getDefaultAccount();
    const balAtomic = await reach.balanceOf(acc);
    const bal = reach.formatCurrency(balAtomic, 4);
    this.setState({acc, bal});
    if (await reach.canFundFromFaucet()) {
      this.setState({view: 'FundAccount'});
    } else {
      this.setState({view: 'DeployerOrAttacher'});
    }
  }
  async fundAccount(fundAmount) {
    await reach.fundFromFaucet(this.state.acc, reach.parseCurrency(fundAmount));
    this.setState({view: 'DeployerOrAttacher'});
  }
  async skipFundAccount() { this.setState({view: 'DeployerOrAttacher'}); }
  selectAttacher() { this.setState({view: 'Wrapper', ContentView: Attacher}); }
  selectDeployer() { this.setState({view: 'Wrapper', ContentView: Deployer}); }
  render() { return renderView(this, AppViews); }
}

class Deployer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {view: 'SetPayment'};
  }
  setPayment(payment) { this.setState({view: 'Deploy', payment}); }
  async deploy() {
    const ctc = this.props.acc.contract(backend);
    this.setState({view: 'Deploying', ctc});
    this.payment = reach.parseCurrency(this.state.payment); // UInt
    backend.Alice(ctc, this);
    const ctcInfoStr = JSON.stringify(await ctc.getInfo(), null, 2);
    this.setState({view: 'WaitingForAttacher', ctcInfoStr});
  }
  async decideFortuneTruthy() { // Fun([], Bool)
    const decision = await new Promise(resolveDecisionP => {
      this.setState({view: 'DecideFortuneTruthy', playable: true, resolveDecisionP});
    });
    if (decision) {
      this.setState({view: 'Done'});
    } else {
      this.setState({view: 'WaitingForFortune'});
    }
    return decision;
  }
  makeDecision(decision) { this.state.resolveDecisionP(decision); }
  render() { return renderView(this, DeployerViews); }
}
class Attacher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {view: 'Attach'};
  }
  attach(ctcInfoStr) {
    const ctc = this.props.acc.contract(backend, JSON.parse(ctcInfoStr));
    this.setState({view: 'Attaching'});
    backend.Bob(ctc, this);
  }
  async readFortune() { // Fun([], UInt)
    const fortune = await new Promise(resolveFortuneP => {
      this.setState({view: 'ReadFortune', playable: true, resolveFortuneP});
    });
    this.setState({view: 'WaitingForDecision', fortune});
    return fortuneToInt[fortune];
  }
  chooseFortune(fortune) { this.state.resolveFortuneP(fortune); }
  render() { return renderView(this, AttacherViews); }
}

renderDOM(<App />);