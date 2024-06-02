
importScripts('shared.js');



self.onmessage = function(e) {
  const { i, start, end, structure, structure2, structure3, neurons2, neurons, actcache, outputs, weights, targets, costcache, activationcache, neuroncount, weightcount, learnrate } = e.data;

  const localWeightErrors = new Float32Array(weightcount+1).fill(0);
  const localBiasErrors = new Float32Array(neuroncount+1).fill(0);
  const j2 = structure[i];
  const k2 = structure[i - 1];

  for (let j = start; j < end; j++) {
    const neuronIndex = structure2[i] + j;

    costcache2 = ParallelNeuronCost(i, j);
    actcache2 = DerivativeActivation(neurons2[j], i, actcache[j]);
    tempcache = actcache2 * costcache2;

    costcache[neuronIndex] = costcache2;
    activationcache[neuronIndex] = actcache2;

    // Update biases with clamping
    localBiasErrors[neuronIndex + 1] += learnrate * tempcache;

    const weightStartIndex = structure3[i - 1] + k2 * j + 1;

    for (let k = 0; k < k2; k++) {
      const weightIndex = weightStartIndex + k;
      error = neurons[k] * tempcache;

      localWeightErrors[weightIndex] += learnrate * error;
    }
  }

  self.postMessage({ costcache, activationcache, localWeightErrors, localBiasErrors });
};

