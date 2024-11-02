// Date range: Nov 2024 to Oct 2025, approximately 12 months
const months = [
    '2024-11', '2024-12', '2025-01', '2025-02', '2025-03',
    '2025-04', '2025-05', '2025-06', '2025-07', '2025-08',
    '2025-09', '2025-10'
];

// Initial and final BTC prices
const btcStartPrice = 69000;
const btcEndPrice = 400000;
const solStartPrice = 166;
let initialNAVFactor = 0.001231;
let navStartPerShare = initialNAVFactor * btcStartPrice;
let mstrNavPremiumStart = 2.668; // Initial NAV premium for MSTR
let mstrNavPremium = mstrNavPremiumStart;
let mstrStartPrice = navStartPerShare * mstrNavPremiumStart;
let solEndPrice = 1800; // Initial SOL end price

// Initial portfolio value for both portfolios
const initialPortfolioValue = 460000;

// Generate BTC, MSTR, SOL, and SOL bot prices and portfolio values
function generateData() {
    const btcPrices = [];
    const mstrPrices = [];
    const solPrices = [];
    const solBotPrices = [];
    const portfolioSolBot = [];
    const portfolioMstr = [];

    for (let i = 0; i < months.length; i++) {
        // Calculate BTC price with exponential growth
        const btcGrowthFactor = Math.pow(btcEndPrice / btcStartPrice, i / (months.length - 1));
        const btcPrice = btcStartPrice * btcGrowthFactor;
        btcPrices.push(btcPrice);

        // Calculate MSTR price with exponential growth
        let mstrEndPrice = initialNAVFactor * btcPrice * mstrNavPremium;

        const mstrGrowthFactor = Math.pow(mstrEndPrice / mstrStartPrice, i / (months.length - 1));
        const mstrPrice = mstrStartPrice * mstrGrowthFactor;
        mstrPrices.push(mstrPrice);

        // Calculate SOL price with exponential growth
        const solGrowthFactor = Math.pow(solEndPrice / solStartPrice, i / (months.length - 1));
        const solPrice = solStartPrice * solGrowthFactor;
        solPrices.push(solPrice);

        // Calculate SOL trading bot price (5x SOL growth)
        const solBotPrice = solPrice * 5;
        solBotPrices.push(solBotPrice);

        // Calculate portfolio values
        const solBotPortfolioValue = initialPortfolioValue * (solBotPrice / (solStartPrice * 5));
        const mstrPortfolioValue = initialPortfolioValue * (mstrPrice / mstrStartPrice);

        portfolioSolBot.push(solBotPortfolioValue);
        portfolioMstr.push(mstrPortfolioValue);
    }

    return { months, btcPrices, mstrPrices, solPrices, solBotPrices, portfolioSolBot, portfolioMstr };
}

// Plot the data
function plotData(data) {
    const btcTrace = {
        x: data.months,
        y: data.btcPrices,
        type: 'scatter',
        mode: 'lines',
        name: 'BTC Price',
        line: { width: 2, color: 'orange' }
    };

    const mstrTrace = {
        x: data.months,
        y: data.mstrPrices,
        type: 'scatter',
        mode: 'lines',
        name: 'MSTR Price (Exponential Growth)',
        line: { width: 2, dash: 'dash', color: 'red' }
    };

    const solTrace = {
        x: data.months,
        y: data.solPrices,
        type: 'scatter',
        mode: 'lines',
        name: 'SOL Price (Exponential Growth)',
        line: { width: 2, dash: 'dot' }
    };

    const solBotTrace = {
        x: data.months,
        y: data.solBotPrices,
        type: 'scatter',
        mode: 'lines',
        name: 'SOL Trading Bot (5x Projected)',
        line: { width: 2, dash: 'dot' }
    };

    const portfolioSolBotTrace = {
        x: data.months,
        y: data.portfolioSolBot,
        type: 'scatter',
        mode: 'lines',
        name: 'Portfolio with SOL Trading Bot',
        line: { width: 3, color: 'purple' }
    };

    const portfolioMstrTrace = {
        x: data.months,
        y: data.portfolioMstr,
        type: 'scatter',
        mode: 'lines',
        name: 'Portfolio with MSTR',
        line: { width: 3, color: 'red' }
    };

    const layout = {
        title: 'Projected Portfolio Values: SOL Trading Bot vs. MSTR',
        xaxis: { title: 'Date' },
        yaxis: { title: 'Value (USD)' }
    };

    Plotly.newPlot('chart', [btcTrace, mstrTrace, solTrace, solBotTrace, portfolioSolBotTrace, portfolioMstrTrace], layout);
}

// Initialize the chart with default values
let data = generateData();
plotData(data);

// Listen for input changes
document.getElementById('mstrNavPremium').addEventListener('input', (event) => {
    mstrNavPremium = parseFloat(event.target.value);
    data = generateData(); // Regenerate data with the new NAV premium
    plotData(data); // Update the chart
});

document.getElementById('solEndPrice').addEventListener('input', (event) => {
    solEndPrice = parseFloat(event.target.value);
    data = generateData(); // Regenerate data with the new SOL end price
    plotData(data); // Update the chart
});
