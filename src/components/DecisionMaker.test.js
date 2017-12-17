import DecisionMaker from './DecisionMaker';

describe('#findMostVoted', () => {
  it('if 1 option, it wins', () => {
    const option = {
      id: '1',
    };
    const options = [option];
    const votes = [];

    expect(DecisionMaker.findMostVoted(options, votes))
      .toEqual(option);
  });

  it('if multiple options and no votes, a random winner is picked', () => {
    const optionOne = {
      id: '1',
    };
    const optionTwo = {
      id: '2',
    };
    const options = [optionOne, optionTwo];
    const votes = [];

    const mostVoted = DecisionMaker.findMostVoted(options, votes);
    const matchesAnOption =
      (mostVoted.id === optionOne.id || mostVoted.id === optionTwo.id);
    expect(matchesAnOption).toBeTruthy();
  });

  it('if multiple options and 1 clear winner, its picked as the winner', () => {
    const optionOne = {
      id: '1',
    };
    const optionTwo = {
      id: '2',
    };
    const vote = {
      option: optionTwo.id,
    };
    const options = [optionOne, optionTwo];
    const votes = [vote];

    expect(DecisionMaker.findMostVoted(options, votes).id).toEqual(optionTwo.id);
  });

  it('if multiple options and n clear winner, a random winner is picked', () => {
    const optionOne = {
      id: '1',
    };
    const optionTwo = {
      id: '2',
    };
    const voteOne = {
      option: optionTwo.id,
    };
    const voteTwo = {
      option: optionOne.id,
    };
    const options = [optionOne, optionTwo];
    const votes = [voteOne, voteTwo];

    const mostVoted = DecisionMaker.findMostVoted(options, votes);
    const matchesAnOption =
      (mostVoted.id === optionOne.id || mostVoted.id === optionTwo.id);
    expect(matchesAnOption).toBeTruthy();
  });
});
