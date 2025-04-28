// Marketing Effectiveness Analyzer
// This script creates interactive D3.js visualizations to analyze marketing effectiveness

// Function to process data for marketing analysis
function processMarketingData(data) {
    // Group data by discount status
    const discountGroups = {
        'Yes': { count: 0, totalAmount: 0, totalRating: 0 },
        'No': { count: 0, totalAmount: 0, totalRating: 0 }
    };
    
    // Group data by promo code usage
    const promoGroups = {
        'Yes': { count: 0, totalAmount: 0, totalRating: 0 },
        'No': { count: 0, totalAmount: 0, totalRating: 0 }
    };
    
    // Group data by shipping type
    const shippingGroups = {};
    
    // Process each data point
    data.forEach(d => {
        // Apply filters if needed
        if (categoryFilter !== 'all' && d.Category !== categoryFilter) return;
        if (seasonFilter !== 'all' && d.Season !== seasonFilter) return;
        
        // Process discount data
        const discountStatus = d["Discount Applied"];
        if (discountGroups[discountStatus]) {
            discountGroups[discountStatus].count++;
            discountGroups[discountStatus].totalAmount += parseFloat(d["Purchase Amount (USD)"]);
            discountGroups[discountStatus].totalRating += parseFloat(d["Review Rating"]);
        }
        
        // Process promo code data
        const promoStatus = d["Promo Code Used"];
        if (promoGroups[promoStatus]) {
            promoGroups[promoStatus].count++;
            promoGroups[promoStatus].totalAmount += parseFloat(d["Purchase Amount (USD)"]);
            promoGroups[promoStatus].totalRating += parseFloat(d["Review Rating"]);
        }
        
        // Process shipping data
        const shippingType = d["Shipping Type"];
        if (!shippingGroups[shippingType]) {
            shippingGroups[shippingType] = { count: 0, totalAmount: 0 };
        }
        shippingGroups[shippingType].count++;
        shippingGroups[shippingType].totalAmount += parseFloat(d["Purchase Amount (USD)"]);
    });
    
    // Calculate averages for discount groups
    Object.keys(discountGroups).forEach(key => {
        if (discountGroups[key].count > 0) {
            discountGroups[key].avgAmount = discountGroups[key].totalAmount / discountGroups[key].count;
            discountGroups[key].avgRating = discountGroups[key].totalRating / discountGroups[key].count;
        } else {
            discountGroups[key].avgAmount = 0;
            discountGroups[key].avgRating = 0;
        }
    });
    
    // Calculate averages for promo groups
    Object.keys(promoGroups).forEach(key => {
        if (promoGroups[key].count > 0) {
            promoGroups[key].avgAmount = promoGroups[key].totalAmount / promoGroups[key].count;
            promoGroups[key].avgRating = promoGroups[key].totalRating / promoGroups[key].count;
        } else {
            promoGroups[key].avgAmount = 0;
            promoGroups[key].avgRating = 0;
        }
    });
    
    // Calculate averages for shipping groups and convert to array
    const shippingData = Object.keys(shippingGroups).map(key => {
        const group = shippingGroups[key];
        return {
            type: key,
            count: group.count,
            avgAmount: group.count > 0 ? group.totalAmount / group.count : 0
        };
    }).sort((a, b) => b.avgAmount - a.avgAmount); // Sort by average amount
    
    // Format discount data for D3
    const discountData = [
        { status: 'With Discount', avgAmount: discountGroups['Yes'].avgAmount, avgRating: discountGroups['Yes'].avgRating },
        { status: 'Without Discount', avgAmount: discountGroups['No'].avgAmount, avgRating: discountGroups['No'].avgRating }
    ];
    
    // Format promo data for D3
    const promoData = [
        { status: 'With Promo', avgAmount: promoGroups['Yes'].avgAmount, avgRating: promoGroups['Yes'].avgRating },
        { status: 'Without Promo', avgAmount: promoGroups['No'].avgAmount, avgRating: promoGroups['No'].avgRating }
    ];
    
    // Calculate key metrics
    const metrics = {
        discountLift: ((discountGroups['Yes'].avgAmount - discountGroups['No'].avgAmount) / discountGroups['No'].avgAmount) * 100,
        promoLift: ((promoGroups['Yes'].avgAmount - promoGroups['No'].avgAmount) / promoGroups['No'].avgAmount) * 100,
        bestShippingMethod: shippingData.length > 0 ? shippingData[0].type : 'None',
        bestShippingAvg: shippingData.length > 0 ? shippingData[0].avgAmount : 0
    };
    
    return {
        discountData,
        promoData,
        shippingData,
        metrics
    };
}

// Variables to store filter values
let categoryFilter = 'all';
let seasonFilter = 'all';

// Function to create the discount impact chart
function createDiscountChart(data) {
    const margin = {top: 10, right: 30, bottom: 30, left: 50};
    const width = document.getElementById('discount-chart').clientWidth - margin.left - margin.right;
    const height = document.getElementById('discount-chart').clientHeight - margin.top - margin.bottom;
    
    // Clear previous chart
    d3.select('#discount-chart').html('');
    
    // Create SVG
    const svg = d3.select('#discount-chart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // X scale
    const x = d3.scaleBand()
        .domain(data.map(d => d.status))
        .range([0, width])
        .padding(0.3);
    
    // Y scale
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.avgAmount) * 1.1])
        .range([height, 0]);
    
    // Add X axis
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));
    
    // Add Y axis
    svg.append('g')
        .call(d3.axisLeft(y).ticks(5).tickFormat(d => `$${d}`));
    
    // Y axis label
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -margin.left + 10)
        .attr('x', -height / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '9px')
        .text('Avg Purchase ($)');
    
    // Add bars
    svg.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.status))
        .attr('y', d => y(d.avgAmount))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.avgAmount))
        .attr('fill', (d, i) => i === 0 ? '#4285F4' : '#34A853')
        .on('mouseover', function(event, d) {
            d3.select(this).attr('opacity', 0.8);
            tooltip.transition()
                .duration(200)
                .style('opacity', 0.9);
            tooltip.html(`<strong>${d.status}</strong><br>Avg. Purchase: $${d.avgAmount.toFixed(2)}<br>Avg. Rating: ${d.avgRating.toFixed(1)}`)
                .style('left', (event.pageX) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
            d3.select(this).attr('opacity', 1);
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        });
    
    // Add value labels on top of bars
    svg.selectAll('.label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', d => x(d.status) + x.bandwidth() / 2)
        .attr('y', d => y(d.avgAmount) - 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '9px')
        .text(d => `$${d.avgAmount.toFixed(0)}`);
    
    // Add tooltip
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .style('position', 'absolute')
        .style('background', 'rgba(255, 255, 255, 0.9)')
        .style('padding', '10px')
        .style('border-radius', '5px')
        .style('pointer-events', 'none')
        .style('box-shadow', '0 2px 4px rgba(0,0,0,0.2)')
        .style('font-size', '12px');
}

// Function to create the promo code effectiveness chart
function createPromoChart(data) {
    const margin = {top: 10, right: 50, bottom: 30, left: 50};
    const width = document.getElementById('promo-chart').clientWidth - margin.left - margin.right;
    const height = document.getElementById('promo-chart').clientHeight - margin.top - margin.bottom;
    
    // Clear previous chart
    d3.select('#promo-chart').html('');
    
    // Create SVG
    const svg = d3.select('#promo-chart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // X scale
    const x = d3.scaleBand()
        .domain(data.map(d => d.status))
        .range([0, width])
        .padding(0.3);
    
    // Y scale for purchase amount
    const yAmount = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.avgAmount) * 1.1])
        .range([height, 0]);
    
    // Y scale for rating
    const yRating = d3.scaleLinear()
        .domain([0, 5]) // Rating scale 0-5
        .range([height, 0]);
    
    // Add X axis
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));
    
    // Add Y axis for amount
    svg.append('g')
        .call(d3.axisLeft(yAmount).ticks(5).tickFormat(d => `$${d}`));
    
    // Add Y axis for rating
    svg.append('g')
        .attr('transform', `translate(${width}, 0)`)
        .call(d3.axisRight(yRating).ticks(5));
    
    // Y axis label - left
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -margin.left + 10)
        .attr('x', -height / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '9px')
        .text('Avg Purchase ($)');
    
    // Y axis label - right
    svg.append('text')
        .attr('transform', 'rotate(90)')
        .attr('y', -width - margin.right + 10)
        .attr('x', height / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '9px')
        .text('Rating (0-5)');
    
    // Add bars for purchase amount
    svg.selectAll('.bar-amount')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar-amount')
        .attr('x', d => x(d.status))
        .attr('y', d => yAmount(d.avgAmount))
        .attr('width', x.bandwidth() / 2)
        .attr('height', d => height - yAmount(d.avgAmount))
        .attr('fill', '#4285F4')
        .on('mouseover', function(event, d) {
            d3.select(this).attr('opacity', 0.8);
            tooltip.transition()
                .duration(200)
                .style('opacity', 0.9);
            tooltip.html(`<strong>${d.status}</strong><br>Avg. Purchase: $${d.avgAmount.toFixed(2)}`)
                .style('left', (event.pageX) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
            d3.select(this).attr('opacity', 1);
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        });
    
    // Add bars for rating
    svg.selectAll('.bar-rating')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar-rating')
        .attr('x', d => x(d.status) + x.bandwidth() / 2)
        .attr('y', d => yRating(d.avgRating))
        .attr('width', x.bandwidth() / 2)
        .attr('height', d => height - yRating(d.avgRating))
        .attr('fill', '#FBBC05')
        .on('mouseover', function(event, d) {
            d3.select(this).attr('opacity', 0.8);
            tooltip.transition()
                .duration(200)
                .style('opacity', 0.9);
            tooltip.html(`<strong>${d.status}</strong><br>Avg. Rating: ${d.avgRating.toFixed(1)}`)
                .style('left', (event.pageX) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
            d3.select(this).attr('opacity', 1);
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        });
    
    // Add legend
    const legend = svg.append('g')
        .attr('transform', `translate(${width / 2 - 80}, ${-margin.top + 5})`);
    
    // Amount legend
    legend.append('rect')
        .attr('x', 0)
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', '#4285F4');
    
    legend.append('text')
        .attr('x', 20)
        .attr('y', 12)
        .text('Purchase Amt')
        .style('font-size', '10px');
    
    // Rating legend
    legend.append('rect')
        .attr('x', 160)
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', '#FBBC05');
    
    legend.append('text')
        .attr('x', 140)
        .attr('y', 12)
        .text('Rating')
        .style('font-size', '10px');
    
    // Add tooltip
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .style('position', 'absolute')
        .style('background', 'rgba(255, 255, 255, 0.9)')
        .style('padding', '10px')
        .style('border-radius', '5px')
        .style('pointer-events', 'none')
        .style('box-shadow', '0 2px 4px rgba(0,0,0,0.2)')
        .style('font-size', '12px');
}

// Function to create the shipping method comparison chart
function createShippingChart(data) {
    const margin = {top: 10, right: 30, bottom: 70, left: 50};
    const width = document.getElementById('shipping-chart').clientWidth - margin.left - margin.right;
    const height = document.getElementById('shipping-chart').clientHeight - margin.top - margin.bottom;
    
    // Clear previous chart
    d3.select('#shipping-chart').html('');
    
    // Create SVG
    const svg = d3.select('#shipping-chart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Sort data by average amount
    data.sort((a, b) => b.avgAmount - a.avgAmount);
    
    // X scale
    const x = d3.scaleBand()
        .domain(data.map(d => d.type))
        .range([0, width])
        .padding(0.2);
    
    // Y scale
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.avgAmount) * 1.1])
        .range([height, 0]);
    
    // Add X axis
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em');
    
    // Add Y axis
    svg.append('g')
        .call(d3.axisLeft(y).ticks(5).tickFormat(d => `$${d}`));
    
    // Y axis label
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -margin.left + 10)
        .attr('x', -height / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '9px')
        .text('Avg Purchase ($)');
    
    // Add bars
    svg.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.type))
        .attr('y', d => y(d.avgAmount))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.avgAmount))
        .attr('fill', '#34A853')
        .on('mouseover', function(event, d) {
            d3.select(this).attr('opacity', 0.8);
            tooltip.transition()
                .duration(200)
                .style('opacity', 0.9);
            tooltip.html(`<strong>${d.type}</strong><br>Avg. Purchase: $${d.avgAmount.toFixed(2)}<br>Count: ${d.count}`)
                .style('left', (event.pageX) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
            d3.select(this).attr('opacity', 1);
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        });
    
    // Add value labels on top of bars
    svg.selectAll('.label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', d => x(d.type) + x.bandwidth() / 2)
        .attr('y', d => y(d.avgAmount) - 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '8px')
        .text(d => `$${d.avgAmount.toFixed(0)}`);
    
    // Add tooltip
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .style('position', 'absolute')
        .style('background', 'rgba(255, 255, 255, 0.9)')
        .style('padding', '10px')
        .style('border-radius', '5px')
        .style('pointer-events', 'none')
        .style('box-shadow', '0 2px 4px rgba(0,0,0,0.2)')
        .style('font-size', '12px');
}

// Function to create the key metrics dashboard
function createMetricsDashboard(metrics) {
    // Clear previous dashboard
    d3.select('#metrics-dashboard').html('');
    
    // Create metrics container with a more compact layout
    const container = d3.select('#metrics-dashboard')
        .append('div')
        .style('display', 'flex')
        .style('flex-wrap', 'wrap')
        .style('justify-content', 'space-between')
        .style('height', 'auto')
        .style('width', '100%');
    
    // Discount lift metric
    const discountMetric = container.append('div')
        .style('background', '#f8f9fa')
        .style('border-radius', '5px')
        .style('padding', '8px')
        .style('text-align', 'center')
        .style('width', '48%')
        .style('margin-bottom', '8px');
    
    discountMetric.append('h4')
        .style('margin', '0 0 3px 0')
        .style('font-size', '14px')
        .text('Discount Impact');
    
    discountMetric.append('div')
        .style('font-size', '20px')
        .style('font-weight', 'bold')
        .style('color', metrics.discountLift >= 0 ? '#34A853' : '#EA4335')
        .text(metrics.discountLift >= 0 ? `+${metrics.discountLift.toFixed(1)}%` : `${metrics.discountLift.toFixed(1)}%`);
    
    discountMetric.append('div')
        .style('font-size', '10px')
        .text('Purchase amount lift with discounts');
    
    // Promo code lift metric
    const promoMetric = container.append('div')
        .style('background', '#f8f9fa')
        .style('border-radius', '5px')
        .style('padding', '8px')
        .style('text-align', 'center')
        .style('width', '48%')
        .style('margin-bottom', '8px');
    
    promoMetric.append('h4')
        .style('margin', '0 0 3px 0')
        .style('font-size', '14px')
        .text('Promo Code Impact');
    
    promoMetric.append('div')
        .style('font-size', '20px')
        .style('font-weight', 'bold')
        .style('color', metrics.promoLift >= 0 ? '#34A853' : '#EA4335')
        .text(metrics.promoLift >= 0 ? `+${metrics.promoLift.toFixed(1)}%` : `${metrics.promoLift.toFixed(1)}%`);
    
    promoMetric.append('div')
        .style('font-size', '10px')
        .text('Purchase amount lift with promo codes');
    
    // Best shipping method metric
    const shippingMetric = container.append('div')
        .style('background', '#f8f9fa')
        .style('border-radius', '5px')
        .style('padding', '8px')
        .style('text-align', 'center')
        .style('width', '100%');
    
    shippingMetric.append('h4')
        .style('margin', '0 0 3px 0')
        .style('font-size', '14px')
        .text('Best Shipping Method');
    
    shippingMetric.append('div')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .text(metrics.bestShippingMethod);
    
    shippingMetric.append('div')
        .style('font-size', '12px')
        .text(`$${metrics.bestShippingAvg.toFixed(2)} avg purchase`);
}

// Function to initialize the marketing dashboard
function initMarketingDashboard(shoppingData) {
    // Set up event listeners for filters
    document.getElementById('category-filter').addEventListener('change', function() {
        categoryFilter = this.value;
        updateDashboard(shoppingData);
    });
    
    document.getElementById('season-filter').addEventListener('change', function() {
        seasonFilter = this.value;
        updateDashboard(shoppingData);
    });
    
    // Initial dashboard update
    updateDashboard(shoppingData);
}

// Function to update all charts
function updateDashboard(shoppingData) {
    // Process data
    const marketingData = processMarketingData(shoppingData);
    
    // Create/update charts
    createDiscountChart(marketingData.discountData);
    createPromoChart(marketingData.promoData);
    createShippingChart(marketingData.shippingData);
    createMetricsDashboard(marketingData.metrics);
}

// Initialize dashboard when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if the marketing dashboard elements exist
    if (document.getElementById('discount-chart') && 
        document.getElementById('promo-chart') && 
        document.getElementById('shipping-chart') && 
        document.getElementById('metrics-dashboard')) {
        
        // Initialize with the shopping data
        initMarketingDashboard(shoppingData);
    }
});
