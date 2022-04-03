import {loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';

const role = 'seller';
console.log(`Your role is ${role}.`);

const stdlib = loadStdlib(process.env);
console.log(`The consensus network is ${stdlib.connector}.`);
console.log(`The standard unit is ${stdlib.standardUnit}`);
console.log(`The atomic unit is ${stdlib.atomicUnit}`);

(async () => {
  const commonInteract = {};

  // SELLER
  if (role === 'seller') {
    const sellerInteract = { ...commonInteract };

    const acc = await stdlib.newTestAccount(stdlib.parseCurrency(1000));
    const ctc = acc.contract(backend);
    await backend.Seller(ctc, sellerInteract);
  }

  // BUYER
  else {
    const buyerInteract = { ...commonInteract };
  }
})();
