const logContainer = document.getElementById('terminal-output');
let myChart;
let peakValue = 0; 

const addLog = (msg, type = 'info') => {
    const div = document.createElement('div');
    div.className = type === 'error' ? 'text-red-500 mb-2' : (type === 'warning' ? 'text-yellow-400 mb-2 font-bold' : 'text-blue-400 mb-2');
    div.innerText = `> [${new Date().toLocaleTimeString()}] ${msg}`;
    logContainer.prepend(div);
};

const updateKPIs = (currentVal) => {
    document.getElementById('kpi-current').innerText = currentVal.toFixed(2);
    if(currentVal > peakValue) {
        peakValue = currentVal;
        document.getElementById('kpi-peak').innerText = peakValue.toFixed(2);
    }
};

const updateChart = (labels, values) => {
    const ctx = document.getElementById('coreChart').getContext('2d');
    if (myChart) {
        myChart.data.labels = labels;
        myChart.data.datasets[0].data = values;
        myChart.update();
    } else {
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels, 
                datasets: [{
                    label: 'Neural Load',
                    data: values,
                    borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.15)',
                    fill: true, tension: 0.4, borderWidth: 3, pointRadius: 5, pointBackgroundColor: '#fff'
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, max: 120, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#888' } },
                    x: { grid: { display: false }, ticks: { color: '#888', font: { family: 'monospace' } } }
                }
            }
        });
    }
};

let isPaused = false; 

// Logika Pause/Resume
function togglePause() {
    isPaused = !isPaused;
    const btn = document.getElementById('btn-pause');
    if(isPaused) {
        btn.innerHTML = "▶️ Resume";
        btn.classList.replace('bg-slate-800', 'bg-blue-600');
        addLog("SYSTEM PAUSED: Telemetry stream halted.", "warning");
    } else {
        btn.innerHTML = "⏸️ Pause";
        btn.classList.replace('bg-blue-600', 'bg-slate-800');
        addLog("SYSTEM RESUMED: Telemetry stream online.", "info");
    }
}

async function purgeSystem() {
    if(!confirm("Are you sure? This will wipe the entire SQLite database!")) return;
    
    addLog("INITIATING CORE PURGE...", "error");
    try {
        await fetch('http://localhost:9000/api/purge', { method: 'DELETE' });
        peakValue = 0; 
        document.getElementById('kpi-peak').innerText = "0.00";
        addLog("PURGE COMPLETE: Database wiped.", "warning");
        syncCore(); 
    } catch (err) {
        addLog("Purge sequence failed.", "error");
    }
}

async function syncCore() {

    if (isPaused) return;
    try {
        const res = await fetch('http://localhost:9000/api/core-stream');
        if (!res.ok) throw new Error();
        const data = await res.json();
        
        if(data && data.length > 0) {
            const labels = data.map(d => d.time);
            const values = data.map(d => d.value);
            
            updateChart(labels, values);
            updateKPIs(values[values.length - 1]); 
            addLog(`Telemetry received: ${values[values.length - 1].toFixed(2)}`);
        }
    } catch (err) {
        addLog("CRITICAL: Microservice unreachable!", "error");
    }
}

async function triggerSpike() {
    addLog("INITIATING MANUAL SPIKE...", "warning");
    try {
        
        await fetch('http://localhost:9000/api/spike', { method: 'POST' });
        syncCore(); 
    } catch (err) {
        addLog("Spike injection failed.", "error");
    }
}

setInterval(syncCore, 2500);
syncCore();