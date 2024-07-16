var showtargets = false;
var userdata;
var saveprecision = 8;

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

function SetSavePrecision() {
  let input = document.getElementById("saveprecision").value
  saveprecision = input;
}

function ConvertToFloat(compressedArray,range) {
    var floatArray = new Float32Array(compressedArray.length);
    var scaleFactor = 2 * range / (2**saveprecision-1); 
    for (var i = 0; i < compressedArray.length; i++) {
        var unscaledValue = compressedArray[i] * scaleFactor - range;
        floatArray[i] = unscaledValue;
    }
    return floatArray;
}

function CompressArray(floatArray,range) {
  var compressedArray = new Array(floatArray.length);
  var scaleFactor = (2**saveprecision-1) / (2 * range); 
  for (var i = 0; i < floatArray.length; i++) {
    var scaledValue = (floatArray[i] + range) * scaleFactor;
    compressedArray[i] = Math.round(scaledValue);
  }
  return compressedArray;
}

function UpdateUserData() {
  userdata = {
    version: 0.2,
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
    weights: CompressArray(weights,weightrange),
    biases: CompressArray(biases,biasrange)
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
  cost = userdata.cost;
  neuronrange = userdata.neuronrange;
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
  if (!file) {
    console.error("No file selected.");
    return;
  }
  const reader = new FileReader();

  reader.onload = function(event) {
    try {
      const base64 = event.target.result; //.split(',')[1];
      const json = atob(base64);
      userdata = JSON.parse(json);
      UpdateFromData();
    } catch (error) {
      console.error(error);
    }
  };

  reader.readAsText(file);
}


