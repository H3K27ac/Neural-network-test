
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

function RandomizeInput() {
  let j2 = structure[0];
  for (let j=0; j<j2; j++) {
      neurons[j] = Math.random();
  }
}

function FeedForward() {
  let sum;
  for (let i=0; i<layers-1; i++) {
    let j2 = structure[i+1];
    for (let j=0; j<j2; j++) {
      sum = 0;
      let index = structure3[i]+structure[i]*j+1;
      let k2 = structure[i];
      for (let k=0; k<k2; k++) {
        sum += weights[index+k] * neurons[structure2[i]+k];
      }
      sum += biases[structure2[i]+j+1];
      let result = Activation(sum,i);
   //   activationcache2[index2] = result
      neurons2[structure2[i+1]+j] = sum;
      neurons[structure2[i+1]+j] = result;
    }
  }
}

function SetTarget() {
  let j2 = structure[0];
  let sum = 0;
  for (let j=0; j<j2; j++) {
    sum += neurons[j];
  }
  let target = sum / j2;
  let i2 = structure[layers-1];
  for (let i=0; i<i2; i++) {
      targets[i] = target;
  }
}