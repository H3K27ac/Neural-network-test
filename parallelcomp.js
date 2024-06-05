
// Still not working

const numWorkers = navigator.hardwareConcurrency || 4; // Number of logical processors
const workers = [];
var tasks = [];
for (let i = 0; i < numWorkers; i++) {
  workers.push(new Worker('worker.js'));
}

function ParallelBackprop() {
  if (lock) return;
  lock = true;
 // try {
    const t0 = performance.now();

    // Reset caches
    costcache = costcache.fill(0);
    activationcache = activationcache.fill(0);

    RandomizeInput();
    FeedForward();
    SetTarget()

    const outputs = neurons.slice(structure2[layers - 1]);
    for (let i = layers - 1; i > 0; i--) {
      ParallelLayer(i, outputs);
    }

    const t1 = performance.now();
    traincount += numWorkers;
    averageperformance = (t1 - t0) / numWorkers;
  //} finally {
    lock = false;
 // }
}

function ParallelLayer(i,outputs) {
  tasks = [];
  const chunkSize = Math.ceil(structure[i] / numWorkers);
  for (let j = 0; j < numWorkers; j++) {
    const start = j * chunkSize;
    const end = Math.min(start + chunkSize, structure[i]);

    const workerData = {
      i,
      start,
      end,
      structure,
      structure2,
      structure3,
      neurons2: neurons2.slice(structure2[i],structure2[i+1]),
      neurons: neurons.slice(structure2[i-1],structure2[i]),
      actcache: neurons.slice(structure2[i],structure2[i+1]),
      outputs,
      weights: weights.slice(structure3[i],structure3[i+1]),
      targets,
      costcache,
      activationcache,
      learnrate,
      layers
    };

    tasks.push(new Promise((resolve) => {
      workers[j].onmessage = (e) => {
        resolve(e.data);
      };
      workers[j].postMessage(workerData);
    }));
  }
  ProcessResults()
}

async function ProcessResults() {
  const results = await Promise.all(tasks);

  results.forEach((result) => {
    const { i, start, end, localCostCache, localActCache, localWeightErrors, localBiasErrors } = result;

    for (let j = structure[i]*start; j < structure[i]*end; j++) {
      weights[structure3[i-1]+j+1] = Math.min(weightrange, Math.max(-weightrange, weights[structure3[i-1]+j+1] - localWeightErrors[j]));
    }

    for (let j = start; j < end; j++) {
      biases[structure2[i]+j+1] = Math.min(biasrange, Math.max(-biasrange, biases[structure2[i]+j+1] - localBiasErrors[j]));
      costcache[structure2[i]+j+1] = localCostCache[j];
      activationcache[structure2[i]+j+1] = localActCache[j];
    }
  });
}
