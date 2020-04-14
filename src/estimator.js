const covid19ImpactEstimator = (inputData) => {
  const input = inputData;
  const currentlyInfected = Math.trunc(inputData.reportedCases * 10);
  const severeCurrentlyInfected = Math.trunc(inputData.reportedCases * 50);
  let days;
  let factor;

  if (input.periodType === 'days') {
    days = input.timeToElapse;
    factor = Math.trunc(days / 3);
  } else if (input.periodType === 'weeks') {
    days = input.timeToElapse * 7;
    factor = Math.trunc(days / 3);
  } else {
    days = input.timeToElapse * 30;
    factor = Math.trunc(days / 3);
  }

  const rfactor = Math.trunc(2 ** factor);

  return {
    data: input,
    estimate: {
      impact: {
        currentlyInfected,
        infectionsByRequestedTime:
          (Math.trunc(currentlyInfected * rfactor)),
        severeCasesByRequestedTime:
          (Math.trunc(0.15 * Math.trunc(currentlyInfected * rfactor))),
        hospitalBedsByRequestedTime:
          (Math.trunc((0.35 * input.totalHospitalBeds)
            - Math.trunc(0.15 * Math.trunc(currentlyInfected * rfactor)))),
        casesForICUByRequestedTime:
          (Math.trunc(0.05 * currentlyInfected * rfactor)),
        casesForVentilatorsByRequestedTime:
          (Math.trunc(0.02 * currentlyInfected * rfactor)),
        dollarsInFlight:
          Math.trunc((currentlyInfected * rfactor
            * input.region.avgDailyIncomePopulation * input.region.avgDailyIncomeInUSD)
            / days)
      },
      severeImpact: {
        currentlyInfected: severeCurrentlyInfected,
        infectionsByRequestedTime:
          (Math.trunc(severeCurrentlyInfected * rfactor)),
        severeCasesByRequestedTime:
          (Math.trunc(0.15 * Math.trunc(severeCurrentlyInfected * rfactor))),
        hospitalBedsByRequestedTime:
          (Math.trunc(0.35 * input.totalHospitalBeds)
            - Math.trunc(0.15 * severeCurrentlyInfected * rfactor)),
        casesForICUByRequestedTime:
          (Math.trunc(0.05 * severeCurrentlyInfected * rfactor)),
        casesForVentilatorsByRequestedTime:
          (Math.trunc(0.02 * severeCurrentlyInfected * rfactor)),
        dollarsInFlight: Math.trunc((severeCurrentlyInfected * rfactor
          * input.region.avgDailyIncomePopulation * input.region.avgDailyIncomeInUSD)
          / days)
      }
    }
  };
};

export default covid19ImpactEstimator;
