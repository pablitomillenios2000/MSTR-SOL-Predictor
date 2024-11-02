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

// Initial portfolio value for all portfolios
const initialPortfolioValue = 460000;

// Generate BTC, MSTR, SOL, and SOL bot prices and portfolio values
function generateData() {
    const btcPrices = [];
    const mstrPrices = [];
    const solPrices = [];
    const solBotPrices = [];
    const portfolioSolBot = [];
    const portfolioMstr = [];
    const portfolioSol = []; // New portfolio for SOL without bot

    // Initial scaling factors to start each portfolio at the same initialPortfolioValue
    const mstrScalingFactor = initialPortfolioValue / mstrStartPrice;
    const solScalingFactor = initialPortfolioValue / solStartPrice;

    // Calculate the end point for SOL bot to be 5x the regular SOL end price
    const solBotEndPrice = solEndPrice * 5;

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

        // Calculate SOL trading bot price with a custom growth factor to reach 5x of solEndPrice
        const solBotGrowthFactor = Math.pow(solBotEndPrice / solStartPrice, i / (months.length - 1));
        const solBotPrice = solStartPrice * solBotGrowthFactor;
        solBotPrices.push(solBotPrice);

        // Calculate portfolio values with scaling to start at initialPortfolioValue
        const solBotPortfolioValue = solScalingFactor * solBotPrice;
        const mstrPortfolioValue = mstrScalingFactor * mstrPrice;
        const solPortfolioValue = solScalingFactor * solPrice; // New SOL portfolio

        portfolioSolBot.push(solBotPortfolioValue);
        portfolioMstr.push(mstrPortfolioValue);
        portfolioSol.push(solPortfolioValue); // Add value for new SOL portfolio
    }

    return { months, btcPrices, mstrPrices, solPrices, solBotPrices, portfolioSolBot, portfolioMstr, portfolioSol };
}

// Plot the data with dynamic scale
function plotData(data, scaleType = 'linear') {
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
        line: { width: 3, color: '#7F00FF' }
    };

    const portfolioMstrTrace = {
        x: data.months,
        y: data.portfolioMstr,
        type: 'scatter',
        mode: 'lines',
        name: 'Portfolio with MSTR',
        line: { width: 3, color: 'red' }
    };

    const portfolioSolTrace = { // New trace for SOL portfolio without trading bot
        x: data.months,
        y: data.portfolioSol,
        type: 'scatter',
        mode: 'lines',
        name: 'Portfolio with SOL (No Trading Bot)',
        line: { width: 3, color: 'purple' }
    };

    const layout = {
        title: 'Projected Portfolio Values: SOL Trading Bot vs. MSTR vs. SOL (No Bot)',
        xaxis: { title: 'Date' },
        yaxis: { title: 'Value (USD)', type: scaleType }
    };

    Plotly.newPlot('chart', [
        btcTrace, mstrTrace, solTrace, solBotTrace,
        portfolioSolBotTrace, portfolioMstrTrace, portfolioSolTrace
    ], layout);
}

// Initialize the chart with default values
let data = generateData();
let scaleType = 'linear';
plotData(data, scaleType);

// Toggle scale button
document.getElementById('toggleScale').addEventListener('click', () => {
    scaleType = scaleType === 'linear' ? 'log' : 'linear';
    plotData(data, scaleType); // Update the chart with the new scale type
});

// Input listeners for dynamic updates
document.getElementById('mstrNavPremium').addEventListener('input', (event) => {
    mstrNavPremium = parseFloat(event.target.value);
    data = generateData();
    plotData(data, scaleType); // Update the chart with current scale
});

document.getElementById('solEndPrice').addEventListener('input', (event) => {
    solEndPrice = parseFloat(event.target.value);
    data = generateData();
    plotData(data, scaleType); // Update the chart with current scale
});
