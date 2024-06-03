
function ParallelNeuronCost(i,j) {
  if (i == layers-1) {
    return 2 * (outputs[j] - targets[j])
  } else {
    let sum = 0;
    let k2 = structure[i+1];
    for (let k=0; k<k2; k++) {
      sum += weights[structure[i]*k+j+1] * activationcache[structure2[i+1]+k] * costcache[structure2[i+1]+k]; 
    }
    return sum
  }
}


function DerivativeActivation(actcache) {
  return actcache * (1 - actcache)
}





self.onmessage = function(e) {
  const { i, start, end, structure, structure2, structure3, neurons2, neurons, actcache, outputs, weights, targets, costcache, activationcache, learnrate, layers } = e.data;

  const localWeightErrors = new Float32Array(structure[i]*structure[i-1]).fill(0);
  const localBiasErrors = new Float32Array(structure[i]).fill(0);
  const localcostcache = new Float32Array(structure[i]).fill(0);
  const localactivationcache = new Float32Array(structure[i]).fill(0);
  const j2 = structure[i];
  const k2 = structure[i - 1];
  
  let tempcache, actcache2, costcache2, error;
  
  for (let j = start; j < end; j++) {

    if (i == layers-1) {
      costcache2 = 2 * (outputs[j] - targets[j]);
    } else {
      let sum = 0;
      let k2 = structure[i+1];
      for (let k=0; k<k2; k++) {
        sum += weights[structure[i]*k+j] * activationcache[structure2[i+1]+k] * costcache[structure2[i+1]+k]; 
      }
      costcache2 = sum;
    }
    
    actcache2 = actcache[j] * (1 - actcache[j]);
    
    tempcache = actcache2 * costcache2;

    localcostcache[j] = costcache2;
    localactivationcache[j] = actcache2;

    // Update biases with clamping
    localBiasErrors[j] += learnrate * tempcache;

    const weightStartIndex = k2 * j;

    for (let k = 0; k < k2; k++) {
      const weightIndex = weightStartIndex + k;
      error = neurons[k] * tempcache;

      localWeightErrors[weightIndex] += learnrate * error;
    }
  }
  
  self.postMessage({ i, start, end, localcostcache, localactivationcache, localWeightErrors, localBiasErrors });
};

