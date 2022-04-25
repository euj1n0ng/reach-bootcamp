import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib(process.env);

const startingBalance = stdlib.parseCurrency(100);
const accAlice = await stdlib.newTestAccount(startingBalance);
const accBob = await stdlib.newTestAccount(startingBalance);

const fmt = (x) => stdlib.formatCurrency(x, 4);
const getBalance = async (who) => fmt(await stdlib.balanceOf(who));
const beforeAlice = await getBalance(accAlice);
const beforeBob = await getBalance(accBob);

const ctcAlice = accAlice.contract(backend);
const ctcBob = accBob.contract(backend, ctcAlice.getInfo());

const FORTUNE = ['Millionaire', 'Billionaire', 'Trillionaire'];
const TRUTHY = [false, true];
await Promise.all([
  ctcAlice.p.Alice({
    decideFortuneTruthy: () => {
      const decision = Math.floor(Math.random() * 2);
      TRUTHY[decision] ? console.log('Alice says yes'): console.log('Alice says no');
      return TRUTHY[decision];
    },
    payment: stdlib.parseCurrency(5),
  }),
  ctcBob.p.Bob({
    readFortune: () => {
      const fortune = Math.floor(Math.random() * 3);
      console.log(`Bob says Alice's fortune is ${FORTUNE[fortune]}.`);
      return fortune;
    },
  }),
]);

const afterAlice = await getBalance(accAlice);
const afterBob = await getBalance(accBob);

console.log(`Alice went from ${beforeAlice} to ${afterAlice}.`);
console.log(`Bob went from ${beforeBob} to ${afterBob}.`);