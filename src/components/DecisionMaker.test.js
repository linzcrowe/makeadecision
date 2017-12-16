import DecisionMaker from './DecisionMaker';

test('#canDecisionBeMade', () => {
  it('returns false if no options given', () => {
    expect(DecisionMaker.canDecisionBeMade()).toBeFalsy();
  })
})