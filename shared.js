
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

function NeuronCost(i,j) {
  if (i == layers-1) {
    return 2 * (neurons[structure2[i]+j] - targets[j])
  } else {
    let sum = 0;
    let k2 = structure[i+1];
    for (let k=0; k<k2; k++) {
      sum += weights[structure3[i]+structure[i]*k+j+1] * activationcache[structure2[i+1]+k] * costcache[structure2[i+1]+k]; // NeuronCost(i+1,k)
    }
    return sum
  }
}



function DerivativeActivation(input,i,actcache) {
  let activation;
  activation = "Sigmoid";
  if (i == layers-1) {
   // activation = outputactivation;
  } else {
   // activation = hiddenactivation;
  }
  switch (activation) {
    case "Sigmoid":
      // let result = Activation(input)
      return actcache * (1 - actcache)
    case "ReLU": 
      if (input > 0) {
        return 1
      } else {
        return 0 // Derivative is undefined at 0
      }
      case "Leaky ReLU":
      if (input > 0) {
        return 1
      } else {
        return gradient
      }
    default:
      break;
  }
}


