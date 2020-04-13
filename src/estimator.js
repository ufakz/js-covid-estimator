let computeData = (inputData) => {
    //Gets the required variables from the inputData object
    let { region, periodType, timeToElapse, population, currentlyInfected, totalHospitalBeds } = inputData;
    let infectionsByRequestedTime;
    let factor;
    let days;

    //Checks for the periodType to resolve computation
    if (periodType == "days") {
        days = timeToElapse;
        factor = parseInt(days / 3);
        infectionsByRequestedTime = parseInt(currentlyInfected * (2 ** factor));
    } else if (periodType = "weeks") {
        days = timeToElapse * 7;
        factor = parseInt(days / 3);
        infectionsByRequestedTime = parseInt(currentlyInfected * (2 ** factor));
    } else {
        days = timeToElapse * 30;
        factor = parseInt(days / 3);
        infectionsByRequestedTime = parseInt(currentlyInfected * (2 ** factor));
    }

    //Gets 15% of the infectionsByRequestedTime
    let severeCasesByRequestedTime = parseInt(0.15 * infectionsByRequestedTime);

    //Gets 35% of beds as available beds
    let availBeds = parseInt(0.35 * totalHospitalBeds);

    //Gets the available hospital beds by requested time based on the available beds and severe cases
    let hospitalBedsByRequestedTime = parseInt(availBeds - severeCasesByRequestedTime);

    //Gets 5% of the infections
    let casesForICUByRequestedTime = parseInt(0.05 * infectionsByRequestedTime);

    //Gets 2% of the infections
    let casesForVentilatorsByRequestedTime = parseInt(0.02 * infectionsByRequestedTime);

    //Gets the amount of dollars lost
    let dollarsInFlight = parseInt((infectionsByRequestedTime * region.avgDailyIncomePopulation * region.avgDailyIncomeInUSD) / days);

    return {
        infectionsByRequestedTime,
        severeCasesByRequestedTime,
        hospitalBedsByRequestedTime,
        casesForICUByRequestedTime,
        casesForVentilatorsByRequestedTime,
        dollarsInFlight
    }
}

let calculateImpact = (inputData) => {
    let currentlyInfected = parseInt(inputData.reportedCases * 10);
    inputData.currentlyInfected = currentlyInfected;
    let { infectionsByRequestedTime,
        severeCasesByRequestedTime,
        hospitalBedsByRequestedTime,
        casesForICUByRequestedTime,
        casesForVentilatorsByRequestedTime,
        dollarsInFlight } = computeData(inputData);

    let impact = {
        currentlyInfected,
        infectionsByRequestedTime,
        severeCasesByRequestedTime,
        hospitalBedsByRequestedTime,
        casesForICUByRequestedTime,
        casesForVentilatorsByRequestedTime,
        dollarsInFlight
    }
    return impact;
    
}

let calculateSevereImpact = (inputData) => {
    let currentlyInfected = parseInt(inputData.reportedCases * 50);
    inputData.currentlyInfected = currentlyInfected;
    let { infectionsByRequestedTime,
        severeCasesByRequestedTime,
        hospitalBedsByRequestedTime,
        casesForICUByRequestedTime,
        casesForVentilatorsByRequestedTime,
        dollarsInFlight } = computeData(inputData);

    let severeImpact = {
        currentlyInfected,
        infectionsByRequestedTime,
        severeCasesByRequestedTime,
        hospitalBedsByRequestedTime,
        casesForICUByRequestedTime,
        casesForVentilatorsByRequestedTime,
        dollarsInFlight
    }
    return severeImpact;
}

let covid19ImpactEstimator = (inputData) => {
    let result = {};
    result.data = inputData;
    result.estimate = {};
    result.estimate.impact = calculateImpact(inputData);
    result.estimate.severeImpact = calculateSevereImpact(inputData);
    return result;
}

module.exports = covid19ImpactEstimator;
