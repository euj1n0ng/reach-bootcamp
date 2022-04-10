import {loadStdlib} from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib(process.env);

const startingBalance = stdlib.parseCurrency(100);

const [ accAlice, accBob ] = 
  await stdlib.newTestAccounts(2, startingBalance);

const ctcAlice = accAlice.contract(backend);
const ctcBob = accBob.contract(backend, ctcAlice.getInfo());

const FINGERS = [0, 1, 2, 3, 4, 5];
const GUESS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const OUTCOME = ['Bob wins', 'Draw', 'Alice wins'];

const Player = (Who) => ({
  ...stdlib.hasRandom,
  getFingers: () => {
    const fingers = Math.floor(Math.random() * 6);
    console.log(`${Who} played ${FINGERS[fingers]}`);
    return fingers; 
  },
  getGuess: (fingers) => {
    const guess = Math.floor(Math.random() * 6) + FINGERS[fingers];
    console.log(`${Who} guessed ${GUESS[guess]}`);
    return guess;
  },
  seeOutcome: (outcome) => {
    console.log(`${Who} saw outcome ${OUTCOME[outcome]}`);
  },
});

await Promise.all([
  backend.Alice(ctcAlice, {
    ...Player('Alice'),
  }),
  backend.Bob(ctcBob, {
    ...Player('Bob'),
  }),
]);
