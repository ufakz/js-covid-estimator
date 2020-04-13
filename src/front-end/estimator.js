/**
 * 
 * @param {} inputData
 * Returns the result of the estimation.  
 */
const covid19ImpactEstimator = (inputData) => {
    const result = {};
    result.data = inputData;
    result.estimate = {};
    result.estimate.impact = calculateImpact(inputData);
    result.estimate.severeImpact = calculateSevereImpact(inputData);

    return result;
}

/**
 * 
 * @param {} inputData
 * This method computes the estimation for the impact 
 */
const calculateImpact = (inputData) => {
    const currentlyInfected = parseInt(inputData.reportedCases * 10);
    inputData.currentlyInfected = currentlyInfected;
    const { infectionsByRequestedTime,
        severeCasesByRequestedTime,
        hospitalBedsByRequestedTime,
        casesForICUByRequestedTime,
        casesForVentilatorsByRequestedTime,
        dollarsInFlight } = computeData(inputData);

    const impact = {
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
/**
 * 
 * @param {*} inputData
 * This method computes the estimation for the severe impact
 */
const calculateSevereImpact = (inputData) => {
    const currentlyInfected = parseInt(inputData.reportedCases * 50);
    inputData.currentlyInfected = currentlyInfected;
    const { infectionsByRequestedTime,
        severeCasesByRequestedTime,
        hospitalBedsByRequestedTime,
        casesForICUByRequestedTime,
        casesForVentilatorsByRequestedTime,
        dollarsInFlight } = computeData(inputData);

    const severeImpact = {
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

/**
 * 
 * @param {*} inputData 
 * This method acts as a helper method that computes the estimation parameters 
 */
const computeData = (inputData) => {
    //Gets the required variables from the inputData object
    const { region, periodType, timeToElapse, population, currentlyInfected, totalHospitalBeds } = inputData;
    let infectionsByRequestedTime;
    let factor;
    let days;

    //Checks for the periodType to resolve computation
    if (periodType == "days") {
        days = timeToElapse;
        factor = parseInt(days / 3);
        infectionsByRequestedTime = parseInt(currentlyInfected * Math.pow(2, factor));
    } else if (periodType = "weeks") {
        days = timeToElapse * 7;
        factor = parseInt(days / 3);
        infectionsByRequestedTime = parseInt(currentlyInfected * Math.pow(2, factor));
    } else {
        days = timeToElapse * 30;
        factor = parseInt(days / 3);
        infectionsByRequestedTime = parseInt(currentlyInfected * Math.pow(2, factor));
    }

    //Gets 15% of the infectionsByRequestedTime
    const severeCasesByRequestedTime = parseInt(0.15 * infectionsByRequestedTime);

    //Gets 35% of beds as available beds
    const availBeds = parseInt(0.35 * totalHospitalBeds);

    //Gets the available hospital beds by requested time based on the available beds and severe cases
    const hospitalBedsByRequestedTime = parseInt(availBeds - severeCasesByRequestedTime);

    //Gets 5% of the infections
    const casesForICUByRequestedTime = parseInt(0.05 * infectionsByRequestedTime);

    //Gets 2% of the infections
    const casesForVentilatorsByRequestedTime = parseInt(0.02 * infectionsByRequestedTime);

    //Gets the amount of dollars lost
    const dollarsInFlight = parseInt((infectionsByRequestedTime * region.avgDailyIncomePopulation * region.avgDailyIncomeInUSD) / days);

    return {
        infectionsByRequestedTime,
        severeCasesByRequestedTime,
        hospitalBedsByRequestedTime,
        casesForICUByRequestedTime,
        casesForVentilatorsByRequestedTime,
        dollarsInFlight
    }

}
