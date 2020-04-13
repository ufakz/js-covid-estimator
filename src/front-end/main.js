const button = document.getElementById('data-go-estimate');

const region = {
    name: "Africa",
    avgAge: 19.7,
    avgDailyIncomeInUSD: 4,
    avgDailyIncomePopulation: 0.73
}

const handleForm = (event) => {
    event.preventDefault();

    const population = document.getElementById('data-population').value;
    const timeToElapse = document.getElementById('data-time-to-elapse').value;
    const reportedCases = document.getElementById('data-reported-cases').value;
    const totalHospitalBeds = document.getElementById('data-total-hospital-beds').value;
    const periodType = document.getElementById('data-period-type').value;

    const data = {
        region,
        population,
        timeToElapse,
        reportedCases,
        totalHospitalBeds,
        periodType
    }

    const result = covid19ImpactEstimator(data);
    const boxDemo = document.createElement('div');
    const para = document.createElement('p');
    para.innerText = JSON.stringify(result);
    para.classList.add('has-text-centered')
    boxDemo.classList.add('box');
    boxDemo.appendChild(para);
    document.body.appendChild(boxDemo);

}

button.addEventListener('click', handleForm);



