var mode = "edit";
var createready = false;
var parametersready = false;
var structureready = false;
var currenthelpdiv;

function Quickset() {
  let quicksetbutton = document.getElementById("quickset");
  if (quicksetbutton.classList.contains("clicked")) {
    quicksetbutton.innerHTML = "Quickset";
    Create(true);
  } else {
    quicksetbutton.innerHTML = "Comfirm?";
    quicksetbutton.classList.add("clicked");
    setTimeout(function() {
      quicksetbutton.classList.remove("clicked");
    }, 1000);
  }
}

function Create(quickset=false) {
  let createbutton = document.getElementById("createbutton");
  let editbuttons = document.getElementById("editbuttons");
  let createdbuttons = document.getElementById("createdbuttons");
  let editdisplay = document.getElementById("editdisplay");
  let createddisplay = document.getElementById("createddisplay");
  let trainbutton = document.getElementById("training");
  if (mode == "edit") {
    if (quickset) {
      structure = [12,10,8,11,9];
      layers = 5;
      document.getElementById("structuredisplay").innerHTML = "Structure: " + JSON.stringify(structure);
      InitializeValues();
      CreateGraph();
      learnrate = 0.1;
      weightrange = 1;
      biasrange = 1;
      createready = true;
    } else {
      SetInputs();
    }
    if (createready) {
      Toggle("closeall","Tab");
      FillColor("White");
      createbutton.innerHTML = "Edit";
      createbutton.style.borderColor = "White";
      createbutton.style.color = "White";
      editbuttons.style.display = "none";
      createdbuttons.style.display = "inline";
      editdisplay.style.display = "none";
      createddisplay.style.display = "flex";
      mode = "created";
    } else {
      createbutton.innerHTML = "Not Ready";
      createbutton.style.borderColor = "Red";
      createbutton.style.color = "Red";
      setTimeout(() => {
        createbutton.innerHTML = "Create";
        createbutton.style.borderColor = "White";
        createbutton.style.color = "White";
      },800)
    }
  } else {
    createbutton.innerHTML = "Create";
    createbutton.style.borderColor = "White";
    createbutton.style.color = "White";
    editbuttons.style.display = "inline";
    createdbuttons.style.display = "none";
    editdisplay.style.display = "flex";
    createddisplay.style.display = "none";
    trainbutton.innerHTML = "Start Train";
    trainbutton.style.borderColor = "White";
    trainbutton.style.color = "White";
    SetInputs();
    mode = "edit";
  }
}

function SetInputs() {
  createready = false;
  parametersready = false;
  structureready = false;
  ChangeStructure();
  InitializeValues();
  if (structureready) {
    structure.push(0);
    CreateGraph();
  }
  let container = document.getElementById("container");
  let createbutton = document.getElementById("createbutton");
  let display = document.getElementById("parameterstatus");
  let display2 = document.getElementById("structurestatus");
  let display3 = document.getElementById("readystatus");
  let lr = document.getElementById("learnrate").value;
  let wr = document.getElementById("weightrange").value;
  let br = document.getElementById("biasrange").value;
  let complete = 0;
  
  if (lr !== undefined && lr.trim() !== "") {
    complete++;
    learnrate = Number(lr);
  }
  if (wr !== undefined && wr.trim() !== "") {
    complete++;
    weightrange = wr;
  }
  if (br !== undefined && br.trim() !== "") {
    complete++;
    biasrange = br;
  }

  if (complete == 0) {
    display.innerHTML = "Missing Parameters";
    display.style.color = "Red";
  } else if (complete == 3) {
    display.innerHTML = "Parameters OK";
    display.style.color = "Lime";
    parametersready = true;
  } else {
    display.innerHTML = "Incomplete Parameters (" + complete + "/3)";
    display.style.color = "Yellow";
  }
  display3.innerHTML = "";
  if (structureready) {
    if (parametersready) {
      createready = true;
      FillColor("Lime");
      display3.innerHTML = "Ready for Creation";
      display3.style.color = "Lime";
      createbutton.style.borderColor = "Lime";
      createbutton.style.color = "Lime";
    } else {
      FillColor("Red");
    }
  }
  
//  l1strength = document.getElementById("L1strength").value;
//  l2strength = document.getElementById("L2strength").value;

}

function InitializeValues() {
  neuroncount = 0;
  weightcount = 0;
  structure2 = [0];
  structure3 = [0];
  
  for (let i=0; i<layers; i++) {
    neuroncount += structure[i];
    structure2.push(neuroncount);
    if (i>0) { 
      weightcount += structure[i] * structure[i-1];
      structure3.push(weightcount);
    }
  }

  if (neuroncount < 100) {
    showweights = true;
    showbiases = true;
    showneurons = "all";
  } else {
    showweights = false;
    showbiases = false;
    showneurons = "output";
  }

  neurons = new Float32Array(neuroncount).fill(0);
  neurons2 = new Float32Array(neuroncount+1).fill(0);
  weights = new Float32Array(weightcount+1).fill(0);
  biases = new Float32Array(neuroncount+1).fill(0);
  targets = new Float32Array(structure[layers-1]).fill(0);
  
  document.getElementById("neuroncount").innerHTML = "Neurons: " + neuroncount;
  document.getElementById("weightcount").innerHTML = "Weights: " + weightcount;
  document.getElementById("layercount").innerHTML = "Layers: " + layers;
}

function Toggle(id,c="Tab",type="inline") {
  SetInputs();
  let tabs = document.getElementsByClassName(c);
  let i2 = tabs.length;
  for (let i = 0; i < i2; i++) {
    let tab = tabs[i];
    if (tab.id === id) {
      tab.style.display = type;
    } else {
      tab.style.display = "none";
    }
  }
}

function ChangeStructure() {
  let structureinput = document.getElementById("structureinput").value;
  let display = document.getElementById("structurestatus");
  if (structureinput === undefined || structureinput.trim() === "") {
    display.innerHTML = "Missing Structure";
    display.style.color = "Red";
  } else {
    structure = structureinput.replace(/[{}]/g, '').split(',').map(item => parseInt(item));
    layers = structure.length;
    document.getElementById("structuredisplay").innerHTML = "Structure: " + JSON.stringify(structure);
    if (layers > 1) {
      display.innerHTML = "Structure OK";
      display.style.color = "Lime";
      structureready = true;
    } else {
      display.innerHTML = "ERROR: Malformed Structure";
      display.style.color = "Red";
    }
  }
}

function ToggleHelp(id) {
  if (currenthelpdiv !== undefined && currenthelpdiv !== id) {
    let previoushelpdiv = document.getElementById(currenthelpdiv);
    if (previoushelpdiv) previoushelpdiv.style.display = "none";
    document.removeEventListener("click", HideHelp);
  }
  let helpdiv = document.getElementById(id);
  if (helpdiv.style.display === "none") {
    currenthelpdiv = id;
    helpdiv.style.display = "flex";
    setTimeout(() => document.addEventListener("click", HideHelp), 1);
  } else {
    currenthelpdiv = undefined;
    helpdiv.style.display = "none";
    document.removeEventListener("click", HideHelp);
  }
}

function HideHelp(event) {
  let helpdiv = document.getElementById(currenthelpdiv);
  if (!helpdiv.contains(event.target)) {
    helpdiv.style.display = "none";
    document.removeEventListener("click", HideHelp);
  }
}
