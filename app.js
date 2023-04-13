document.getElementById("generate-chart").addEventListener("click", function () {
    const csvInput = document.getElementById("csv-input").value;
    const savingsData = parseBankStatementCSV(csvInput);
    const chartData = aggregateSavingsData(savingsData);
    generateSavingsChart(chartData);
});

function parseBankStatementCSV(csvString) {
    const rows = csvString.trim().split("\n");
    const data = rows.map(row => {
        const [date, amount] = row.split(",");
        return { date: new Date(date), amount: parseFloat(amount) };
    });

    return data;
}

function aggregateSavingsData(data) {
    const aggregatedData = new Map();

    data.forEach(({ date, amount }) => {
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        const currentAmount = aggregatedData.get(monthYear) || 0;
        aggregatedData.set(monthYear, currentAmount + amount);
    });

    return Array.from(aggregatedData.entries());
}

function generateSavingsChart(chartData) {
    const ctx = document.getElementById("savings-chart").getContext("2d");
    const chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: chartData.map(([monthYear]) => monthYear),
            datasets: [{
                label: "Savings",
                data: chartData.map(([, amount]) => amount),
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
