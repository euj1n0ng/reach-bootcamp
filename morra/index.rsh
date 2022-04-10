'reach 0.1';

const [ isFingers, ZERO, ONE, TWO, THREE, FOUR, FIVE ] = makeEnum(6);
const [ isGuess, ZEROG, ONEG, TWOG, THREEG, FOURG, FIVEG, SIXG, SEVENG, EIGHTG, NINEG, TENG ] = makeEnum(11);
const [ isOutcome, B_WINS, DRAW, A_WINS ] = makeEnum(3);

const winner = (fingersA, fingersB, guessA, guessB) => { 
  if ( guessA == guessB ) 
   {
    const outcome = DRAW; // tie
    return outcome;
} else {
  if ( ((fingersA + fingersB) == guessA ) ) {
    const outcome = A_WINS;
    return outcome; // player A wins
  } 
    else {
      if (  ((fingersA + fingersB) == guessB)) {
        const outcome = B_WINS;
        return outcome; // player B wins
    } 
      else {
        const outcome = DRAW; // tie
        return outcome;
      }
    
    }
  }
};

// assertion that when 
// Alice throws a 0, AND Bob throws a 2, 
// and Alice guesses 0 and Bob guesses 2
// then Bob wins as the total thrown is 2
assert(winner(ZERO,TWO,ZEROG,TWOG)== B_WINS);
assert(winner(TWO,ZERO,TWOG,ZEROG)== A_WINS);
assert(winner(ZERO,ONE,ZEROG,TWOG)== DRAW);
assert(winner(ONE,ONE,ONEG,ONEG)== DRAW);

// asserts for all combinations
forall(UInt, fingersA =>
  forall(UInt, fingersB =>
    forall(UInt, guessA =>
      forall(UInt, guessB =>
        assert(isOutcome(winner(fingersA, fingersB, guessA, guessB)))))));

// asserts for a draw - each guesses the same
forall(UInt, (fingerA) =>
  forall(UInt, (fingerB) =>       
    forall(UInt, (guess) =>
      assert(winner(fingerA, fingerB, guess, guess) == DRAW))));

const Player = {
  ...hasRandom,
  getFingers: Fun([], UInt),
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
    const _fingersAlice = interact.getFingers();
    const _guessAlice = interact.getGuess(_fingersAlice);
                      
    const [_commitAlice, _saltAlice] = makeCommitment(interact, _fingersAlice);
    const commitAlice = declassify(_commitAlice);        
    const [_guessCommitAlice, _guessSaltAlice] = makeCommitment(interact, _guessAlice);
    const guessCommitAlice = declassify(_guessCommitAlice);   
  });
  Alice.publish(commitAlice, guessCommitAlice);
  commit();
  
  unknowable(Bob, Alice(_fingersAlice, _saltAlice));
  unknowable(Bob, Alice(_guessAlice, _guessSaltAlice));
  Bob.only(() => {
    const fingersBob = declassify(interact.getFingers());
    const guessBob = declassify(interact.getGuess(fingersBob));
  });
  Bob.publish(fingersBob, guessBob);
  commit();

  Alice.only(() => {
    const [saltAlice, fingersAlice] = declassify([_saltAlice, _fingersAlice]); 
    const [guessSaltAlice, guessAlice] = declassify([_guessSaltAlice, _guessAlice]);
  });
  Alice.publish(saltAlice, fingersAlice);
  checkCommitment(commitAlice, saltAlice, fingersAlice);
  commit();
  
  Alice.publish(guessSaltAlice, guessAlice);
  checkCommitment(guessCommitAlice, guessSaltAlice, guessAlice);
  commit();

  const outcome = winner(fingersAlice, fingersBob, guessAlice, guessBob);

  each([Alice, Bob], () => {
    interact.seeOutcome(outcome);
  });
});
