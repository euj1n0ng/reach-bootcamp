'reach 0.1';
'use strict';

const Common = {
  seeTimeout: Fun([], Null),
  seeTransfer: Fun([], Null),
};

export const main = Reach.App(() => {
  const A = Participant('Alice', {
    ...Common,
    getSwap: Fun([], Tuple(Array(Address, 1), UInt, UInt, UInt)),
  });
  const B = Participant('Bob', {
    ...Common,
    accSwap: Fun([Array(Address, 1)], Bool),
  });
  init();

  A.only(() => {
    const [ addrsForB, amtA, amtB, time ] = declassify(interact.getSwap()); });
  A.publish(addrsForB, amtA, amtB, time)
    .pay(amtA);
  commit();

  B.only(() => {
    const matched = declassify(interact.accSwap(addrsForB));
    assume(matched, 'Invalid address') });
  B.pay(amtB)
    .timeout(relativeTime(time), () => {
      A.publish();
      transfer(amtA).to(A);
      each([A, B], () => interact.seeTimeout());
      commit();
      exit();
    });
    
  transfer(amtB).to(A);
  transfer(amtA).to(B);
  each([A, B], () => interact.seeTransfer());
  commit();

  exit();
});