document.getElementById("generate-chart").addEventListener("click", function () {
    const csvInput = document.getElementById("csv-input").value;
    const filterList = document.getElementById("filter-list").value.split("\n");
    const savingsData = parseBankStatementCSV(csvInput, filterList);
    const chartData = aggregateSavingsData(savingsData);
    generateSavingsChart(chartData);
});

function parseBankStatementCSV(csvString, filterList) {
    const rows = csvString.trim().split("\n");
    const data = rows.map(row => {
        const [date, amount, description] = row.split(",").filter((_, index) => index === 0 || index === 1 || index === 2);
        return { date: new Date(date.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1")), amount: parseFloat(amount.replace(/["+]/g, '')), description: description.replace(/["+]/g, '') };
    }).filter(({description}) => !filterList.includes(description.trim()));

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

let chart;

function generateSavingsChart(chartData) {
    const ctx = document.getElementById("savings-chart").getContext("2d");
    
    // Destroy the previous chart if it exists
    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
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
