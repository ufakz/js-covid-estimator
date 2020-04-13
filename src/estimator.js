const computeData = (inputData) => {
    // Gets the required variables from the inputData object
    const {
        region, periodType, timeToElapse, currentlyInfected, totalHospitalBeds,
    } = inputData;
    let infectionsByRequestedTime;
    let factor;
    let days;

    // Checks for the periodType to resolve computation
    if (periodType === 'days') {
        days = timeToElapse;
        factor = Math.trunc(days / 3);
        infectionsByRequestedTime = Math.trunc(currentlyInfected * (2 ** factor));
    } else if (periodType === 'weeks') {
        days = timeToElapse * 7;
        factor = Math.trunc(days / 3);
        infectionsByRequestedTime = Math.trunc(currentlyInfected * (2 ** factor));
    } else {
        days = timeToElapse * 30;
        factor = Math.trunc(days / 3);
        infectionsByRequestedTime = Math.trunc(currentlyInfected * (2 ** factor));
    }

    // Gets 15% of the infectionsByRequestedTime
    const severeCasesByRequestedTime = Math.trunc(0.15 * infectionsByRequestedTime);

    // Gets 35% of beds as available beds
    const availBeds = Math.trunc(0.35 * totalHospitalBeds);

    // Gets the available hospital beds by requested time based on the available beds and severe cases
    const hospitalBedsByRequestedTime = Math.trunc(availBeds - severeCasesByRequestedTime);

    // Gets 5% of the infections
    const casesForICUByRequestedTime = Math.trunc(0.05 * infectionsByRequestedTime);

    // Gets 2% of the infections
    const casesForVentilatorsByRequestedTime = Math.trunc(0.02 * infectionsByRequestedTime);

    // Gets the amount of dollars lost
    const dollarsInFlight = Math.trunc((infectionsByRequestedTime * region.avgDailyIncomePopulation * region.avgDailyIncomeInUSD) / days);

    return {
        infectionsByRequestedTime,
        severeCasesByRequestedTime,
        hospitalBedsByRequestedTime,
        casesForICUByRequestedTime,
        casesForVentilatorsByRequestedTime,
        dollarsInFlight,
    };
};

const calculateImpact = (inputData) => {
    const currentlyInfected = Math.trunc(inputData.reportedCases * 10);
    inputData.currentlyInfected = currentlyInfected;
    const {
        infectionsByRequestedTime,
        severeCasesByRequestedTime,
        hospitalBedsByRequestedTime,
        casesForICUByRequestedTime,
        casesForVentilatorsByRequestedTime,
        dollarsInFlight,
    } = computeData(inputData);

    const impact = {
        currentlyInfected,
        infectionsByRequestedTime,
        severeCasesByRequestedTime,
        hospitalBedsByRequestedTime,
        casesForICUByRequestedTime,
        casesForVentilatorsByRequestedTime,
        dollarsInFlight,
    };

    return impact;
};

const calculateSevereImpact = (inputData) => {
    const currentlyInfected = Math.trunc(inputData.reportedCases * 50);
    inputData.currentlyInfected = currentlyInfected;
    const {
        infectionsByRequestedTime,
        severeCasesByRequestedTime,
        hospitalBedsByRequestedTime,
        casesForICUByRequestedTime,
        casesForVentilatorsByRequestedTime,
        dollarsInFlight,
    } = computeData(inputData);

    const severeImpact = {
        currentlyInfected,
        infectionsByRequestedTime,
        severeCasesByRequestedTime,
        hospitalBedsByRequestedTime,
        casesForICUByRequestedTime,
        casesForVentilatorsByRequestedTime,
        dollarsInFlight,
    };

    return severeImpact;
};

const covid19ImpactEstimator = (inputData) => {
    const result = {};
    result.data = inputData;
    result.estimate = {};
    result.estimate.impact = calculateImpact(inputData);
    result.estimate.severeImpact = calculateSevereImpact(inputData);

    return result;
};

module.exports = covid19ImpactEstimator;
