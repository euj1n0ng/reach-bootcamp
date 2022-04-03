'reach 0.1';

const Player = {
  getHand: Fun([], UInt),
  getGuess: Fun([UInt], UInt),
  seeOutcome: Fun([UInt], Null),
};

export const main = Reach.App(() => {
  const Alice = Participant('Alice', {
    ...Player,
  });
  const Bob = Participant('Bob', {
    ...Player,
  });
  init();
  
  Alice.only(() => {
    const handAlice = declassify(interact.getHand());
    const guessAlice = declassify(interact.getGuess(handAlice));
  });
  Alice.publish(handAlice, guessAlice);
  commit();
  
  Bob.only(() => {
    const handBob = declassify(interact.getHand());
    const guessBob = declassify(interact.getGuess(handBob));
  });
  Bob.publish(handBob, guessBob);

  const handSum = handAlice + handBob;
  const outcome = guessAlice == guessBob // tie, both scores
    ? 1
    : guessAlice == handSum // Alice wins
    ? 2
    : guessBob == handSum // Bob wins
    ? 0
    : 1; // tie, both not scores
  commit();

  each([Alice, Bob], () => {
    interact.seeOutcome(outcome);
  });
});
