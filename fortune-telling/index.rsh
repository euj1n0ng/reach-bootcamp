'reach 0.1';

export const main = Reach.App(() => {
  const Alice = Participant('Alice', {
    decideFortuneTruthy: Fun([], Bool),
    payment: UInt, // atomic units of currency
  });
  const Bob   = Participant('Bob', {
    readFortune: Fun([], UInt),
  });
  init();

  Alice.only(() => {
    const payment = declassify(interact.payment);
  });
  Alice.publish(payment)
    .pay(payment);
  commit();

  Bob.publish();

  var isFortuneTrue = false;
  invariant( balance() == payment );
  while ( !isFortuneTrue ) {
    commit();

    Bob.only(() => {
      const fortune = declassify(interact.readFortune());
    });
    Bob.publish(fortune)
    commit();
    
    Alice.only(() => {
      const fortuneTruthy = declassify(interact.decideFortuneTruthy());
    });
    Alice.publish(fortuneTruthy)

    isFortuneTrue = fortuneTruthy;
    continue;
  }

  assert(isFortuneTrue);
  transfer(payment).to(Bob);
  commit();
});