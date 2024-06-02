
importScripts('shared.js');

self.onmessage = function(e) {
  const { data, start, end } = e.data;
  const { structure, structure2, structure3, neurons2, neurons, biases, weights, biasrange, weightrange, learnrate, layers } = data;

  const localWeightErrors = new Float32Array(weights.length).fill(0);
  const localBiasErrors = new Float32Array(biases.length).fill(0);

  for (let i = start; i < end; i++) {
    const j2 = structure[i];
    const k2 = structure[i - 1];

    for (let j = 0; j < j2; j++) {
      const neuronIndex = structure2[i] + j;

      const costcache2 = NeuronCost(i, j);
      const actcache2 = DerivativeActivation(neurons2[neuronIndex], i, neurons[neuronIndex]);
      const tempcache = actcache2 * costcache2;

      const biasIndex = neuronIndex + 1;
      localBiasErrors[biasIndex] += learnrate * tempcache;

      const weightStartIndex = structure3[i - 1] + k2 * j + 1;

      for (let k = 0; k < k2; k++) {
        const weightIndex = weightStartIndex + k;
        const error = neurons[structure2[i - 1] + k] * tempcache;
        localWeightErrors[weightIndex] += learnrate * error;
      }
    }
  }

  self.postMessage({ localWeightErrors, localBiasErrors });
};

