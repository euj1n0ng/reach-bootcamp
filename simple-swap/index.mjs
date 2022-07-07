import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';

const stdlib = loadStdlib();

const time = stdlib.connector === 'CFX' ? 50 : 10;

const startingBalance = stdlib.parseCurrency(100);
const accAlice = await stdlib.newTestAccount(startingBalance);
const accBob = await stdlib.newTestAccount(startingBalance);

const fmt = (x) => stdlib.formatCurrency(x, 4);
const doSwap = async (amtA, amtB) => {

  const getBalance = async (who) =>
    stdlib.formatCurrency(await stdlib.balanceOf(who), 4);
  const beforeAlice = await getBalance(accAlice);
  const beforeBob = await getBalance(accBob);
  console.log(`Alice has ${beforeAlice}`);
  console.log(`Bob has ${beforeBob}`);

  console.log(`Alice will deploy the smart contract.`);
  const ctcAlice = accAlice.contract(backend);
  console.log(`Bob attaches to the smart contract.`);
  const ctcBob = accBob.contract(backend, ctcAlice.getInfo());

  const Common = (who) => ({
    seeTimeout: () => {
      console.log(`${who} saw a timeout`); },
    seeTransfer: () => {
      console.log(`${who} saw the transfer happened`); },
  });

  await Promise.all([
    backend.Alice(ctcAlice, {
      ...Common(`Alice`),
      getSwap: () => {
        console.log(`Alice proposes swap of Alice's ${fmt(amtA)} for Bob's ${fmt(amtB)}`);
        return [ [accBob], amtA, amtB, time ]; },
    }),
    backend.Bob(ctcBob, {
      ...Common(`Bob`),
      accSwap: (v) => {
        console.log(`Allowed addresses are `, v);
        const addrBob = accBob.networkAccount.address;
        console.log(`Bob's address is `, addrBob);
        if (v.includes(addrBob)) {
          return true;
        }
        return false; },
    }),
  ]);

  const afterAlice = await getBalance(accAlice);
  const afterBob = await getBalance(accBob);
  console.log(`Alice went from ${beforeAlice} to ${afterAlice}`);
  console.log(`Bob went from ${beforeBob} to ${afterBob}`);
};

const amtA = stdlib.parseCurrency(20);
const amtB = stdlib.parseCurrency(10);

doSwap(amtA, amtB);