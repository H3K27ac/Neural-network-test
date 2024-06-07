var showtargets = false;
var userdata;

function SettingsToggle(id,text,func) {
  func();
  let button = document.getElementById(id);
  if (button.classList.contains("on")) {
    button.innerHTML = "S " + text;
    button.classList.remove("on");
    button.classList.add("off");
  } else {
    button.innerHTML = "H " + text;
    button.classList.remove("off");
    button.classList.add("on");
  }
}

function ToggleTargets() {
  let targetcolumn = document.getElementById("targetcolumn");
  if (showtargets) {
    if (mode=="created") {
      targetcolumn.style.display = "none";
      DeleteElements("Weight");
      CreateWeights();
      UpdateColor();
    }
    showtargets = false;
  } else {
    if (mode=="created") {
      targetcolumn.style.display = "flex";
      DeleteElements("Weight");
      CreateWeights();
      UpdateColor();
    }
    showtargets = true;
  }
}

function ConvertToFloat(uint8Array,range) {
    var floatArray = new Float32Array(uint8Array.length);
    var scaleFactor = 2 * range / 255; 
    for (var i = 0; i < uint8Array.length; i++) {
        var unscaledValue = uint8Array[i] * scaleFactor - range;
        floatArray[i] = unscaledValue;
    }
    return floatArray;
}

function ConvertToUInt8(floatArray,range) {
  var uint8Array = new Uint8Array(floatArray.length);
  var scaleFactor = 255 / (2 * range); 
  for (var i = 0; i < floatArray.length; i++) {
    var scaledValue = (floatArray[i] + range) * scaleFactor;
    uint8Array[i] = Math.round(scaledValue);
  }
  return uint8Array;
}

function UpdateUserData() {
  userdata = {
    version: "0.2",
    dataset,
    traincount,
    structure,
    learnrate,
    neuronrange,
    weightrange,
    biasrange,
    cost,
    hiddenactivation,
    outputactivation,
    weights: ConvertToUInt8(weights,weightrange),
    biases: ConvertToUInt8(biases,biasrange)
  }
}

function UpdateFromData() {
  const version = userdata.version;
  dataset = userdata.dataset;
  traincount = userdata.traincount;
  structure = userdata.structure;
  layers = structure.length;
  learnrate = userdata.learnrate;
  weightrange = userdata.weightrange;
  biasrange = userdata.biasrange;
  if (version=="0.2") {
    cost = userdata.cost;
    neuronrange = userdata.neuronrange;
  } else {
    cost = "MSE";
    neuronrange = 1;
  }
  hiddenactivation = userdata.hiddenactivation;
  outputactivation = userdata.outputactivation;
  weights = ConvertToFloat(userdata.weights,weightrange);
  biases = ConvertToFloat(userdata.biases,biasrange);
  currentlayer = "hidden";
  ImportActivation(hiddenactivation);
  currentlayer = "output";
  ImportActivation(outputactivation);
  Create(false,true);
}


function Export() {
  if (mode == "edit") {
    Warn("exportbutton", "Export", "Editing");
    return;
  }
  UpdateUserData();
  try {
    const json = JSON.stringify(userdata, (key, value) => {
      if (ArrayBuffer.isView(value)) {
        return Array.from(value);
      }
      return value;
    });
    const base64 = btoa(json);

    const blob = new Blob([base64], { type: 'text/plain' });

    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'NeuralNetwork.txt';

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  } catch (error) {
    Warn("exportbutton", "Export", "Error");
    console.error(error);
  }
}


function Import() {
  const fileInput = document.getElementById('importfile');
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = function(event) {
    const base64 = event.target.result.split(',')[1];
    try {
      const json = atob(base64);
      userdata = JSON.parse(json);
      UpdateFromData();
    } catch (error) {
      console.error(error);
    }
  };
  reader.readAsDataURL(file);
}


