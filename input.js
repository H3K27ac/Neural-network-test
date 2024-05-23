var mode = "edit";
var createready = false;
var parametersready = false;
var structureready = false;
var showstatus = true;
var previousstructure = [];
var currenthelpdiv;
var currenttab;

function Confirm(id,func,text,para) {
  let button = document.getElementById(id);
  if (button.classList.contains("clicked")) {
    button.innerHTML = text;
    func(para);
  } else {
    button.innerHTML = "Confirm?";
    button.classList.add("clicked");
    setTimeout(function() {
      button.innerHTML = text;
      button.classList.remove("clicked");
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
      DeleteGraph();
      structure = [12,10,8,11,9];
      layers = 5;
      document.getElementById("structurecount").innerHTML = "Structure: [12,10,8,11,9]";
      structure.push(0);
      InitializeValues();
      CreateGraph();
      learnrate = 0.1;
      weightrange = 1;
      biasrange = 1;
      document.getElementById("learnratedisplay").innerHTML = "Learning rate: 0.1";
      document.getElementById("weightrangedisplay").innerHTML = "Weight range: 1";
      document.getElementById("biasrangedisplay").innerHTML = "Bias range: 1";
      createready = true;
    } else {
      SetInputs();
    }
    if (createready) {
      if (currenttab !== undefined) {
        document.getElementById(currenttab).style.display = "none";
        currenttab = undefined;
      }
      FillColor("White");
      createbutton.innerHTML = "Edit";
      createbutton.style.borderColor = "White";
      createbutton.style.color = "White";
      editbuttons.style.display = "none";
      createdbuttons.style.display = "inline";
      editdisplay.style.display = "none";
      if (showstatus) createddisplay.style.display = "flex";
      mode = "created";
    } else {
      Warn("createbutton","Create","Not Ready",false);
    }
  } else {
    Confirm("createbutton",ToggleEdit,"Edit");
  }
}

function ToggleEdit() {
  let createbutton = document.getElementById("createbutton");
  let editbuttons = document.getElementById("editbuttons");
  let createdbuttons = document.getElementById("createdbuttons");
  let editdisplay = document.getElementById("editdisplay");
  let createddisplay = document.getElementById("createddisplay");
  let trainbutton = document.getElementById("training");
  createbutton.innerHTML = "Create";
  createbutton.style.borderColor = "White";
  createbutton.style.color = "White";
  editbuttons.style.display = "inline";
  createdbuttons.style.display = "none";
  if (showstatus) editdisplay.style.display = "flex";
  createddisplay.style.display = "none";
  trainbutton.innerHTML = "Start Train";
  trainbutton.style.borderColor = "White";
  trainbutton.style.color = "White";
  SetInputs();
  mode = "edit";
}

function SetInputs() {
  if (istraining) {
    training.stop();
    clearInterval(updategraph);
    updategraph = undefined;
    istraining = false;
  }
  traincount = 0;
  createready = false;
  parametersready = false;
  structureready = false;
  ChangeStructure();
  InitializeValues();
  if (structureready) {
    structure.push(0);
    if (structure != previousstructure) {
      DeleteGraph();
      CreateGraph();
      previousstructure = structure;
    }
  }
  let container = document.getElementById("container");
  let createbutton = document.getElementById("createbutton");
  let display = document.getElementById("parameterstatus");
  let display2 = document.getElementById("structurestatus");
  let display3 = document.getElementById("readystatus");
  let lr = document.getElementById("learnrate").value;
  let wr = document.getElementById("weightrange").value;
  let br = document.getElementById("biasrange").value;
  let learnratedisplay = document.getElementById("learnratedisplay");
  let weightdisplay = document.getElementById("weightrangedisplay");
  let biasdisplay = document.getElementById("biasrangedisplay");
  let complete = 0;
  let error = false;
  
  if (lr !== undefined && lr.trim() !== "") {
    learnratedisplay.innerHTML = "Learning rate: " + lr;
    if (lr > 0) {
      complete++;
      learnrate = Number(lr);
      learnratedisplay.style.color = "White";
    } else {
      learnratedisplay.style.color = "Red";
      error = true;
    }
  }
  if (wr !== undefined && wr.trim() !== "") {
    weightdisplay.innerHTML = "Weight range: " + wr;
    if (wr > 0) {
      complete++;
      weightrange = wr;
      weightdisplay.style.color = "White";
    } else {
      weightdisplay.style.color = "Red";
      error = true;
    }
  }
  if (br !== undefined && br.trim() !== "") {
    biasdisplay.innerHTML = "Bias range: " + br;
    if (br > 0) {
      complete++;
      biasrange = br;
      biasdisplay.style.color = "White";
    } else {
      biasdisplay.style.color = "Red";
      error = true;
    }
  }
  if (error) {
    display.innerHTML = "ERROR: Invalid Parameters";
    display.style.color = "Red";
  } else {
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
  }
  display3.innerHTML = "";
  createbutton.style.borderColor = "White";
  createbutton.style.color = "White";
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
  hideneurons = [];
  
  for (let i=0; i<layers; i++) {
    neuroncount += structure[i];
    structure2.push(neuroncount);
    if (structure[i]>12) {
      hideneurons.push(true);
    } else {
      hideneurons.push(false);
    }
    if (i>0) { 
      weightcount += structure[i] * structure[i-1];
      structure3.push(weightcount);
    }
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

function Toggle(id,c="Tab",type="inline",input=true) {
  if (input) SetInputs();
  if (currenttab !== id) {
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
    currenttab = id;
  } else {
    document.getElementById(id).style.display = "none";
    currenttab = undefined;
  }
}

function Toggle2(id,buttonid,text) {
  let button = document.getElementById(buttonid);
  if (id == "MainDisplay") {
    if (mode == "edit") {
      id = "editdisplay";
    } else {
      id = "createddisplay";
    }
    let maindisp = document.getElementById(id);
    if (showstatus) {
      maindisp.style.display = "none";
      button.innerHTML = "Show " + text;
      button.style.borderColor = "Red";
      button.style.color = "Red";
      showstatus = false;
    } else {
      maindisp.style.display = "flex";
      button.innerHTML = "Hide " + text;
      button.style.borderColor = "Lime";
      button.style.color = "Lime";
      showstatus = true;
    }
  } else {
    let element = document.getElementById(id);
    if (element.style.display == "none") {
      element.style.display = "flex";
      button.innerHTML = "Hide " + text;
      button.style.borderColor = "Lime";
      button.style.color = "Lime";
    } else {
      element.style.display = "none";
      button.innerHTML = "Show " + text;
      button.style.borderColor = "Red";
      button.style.color = "Red";
    }
  }
}

function ChangeStructure() {
  let structureinput = document.getElementById("structureinput").value;
  let display = document.getElementById("structurestatus");
  let display2 = document.getElementById("structurecount");
  display2.style.color = "White";
  if (structureinput === undefined || structureinput.trim() === "") {
    display.innerHTML = "Missing Structure";
    display.style.color = "Red";
  } else {
    structure = structureinput.replace(/[{}]/g, '').split(',').map(item => parseInt(item));
    layers = structure.length;
    document.getElementById("structurecount").innerHTML = "Structure: " + JSON.stringify(structure);
    if (layers > 1) {
      display.innerHTML = "Structure OK";
      display.style.color = "Lime";
      structureready = true;
    } else {
      display.innerHTML = "ERROR: Malformed Structure";
      display.style.color = "Red";
      display2.style.color = "Red";
    }
  }
}

function Warn(id,text,text2,bypassmode=true) {
  let element = document.getElementById(id);
  element.innerHTML = text2;
  element.style.borderColor = "Red";
  element.style.color = "Red";
  setTimeout(() => {
    if (mode == "edit" || bypassmode) {
      element.innerHTML = text;
      element.style.borderColor = "White";
      element.style.color = "White";
    }
  },800)
}

function SubmitInputData() {
  if (!istraining) {
    let inputdata = document.getElementById("inputdata").value.replace(/[{}]/g, '').split(',').map(item => parseFloat(item));
    if (inputdata.length == structure[0]) {
      for (let i=0; i<structure[0]; i++) {
        neurons[i] = inputdata[i];
      }
      FeedForward();
      UpdateColor();
    } else {
      Warn("submitinputdata","Input","ERROR");
    }
  } else {
    Warn("submitinputdata","Input","TRAIN");
  }
}

function ToggleHelp(id) {
  if (currenthelpdiv !== id && currenthelpdiv === undefined) {
    let helpdiv = document.getElementById(id);
    currenthelpdiv = id;
    helpdiv.style.display = "flex";
    setTimeout(() => document.addEventListener("click", HideHelp), 1)
  }
}

function HideHelp(event) {
  let helpdiv = document.getElementById(currenthelpdiv);
  if (!helpdiv.contains(event.target)) {
    helpdiv.style.display = "none";
    document.removeEventListener("click", HideHelp);
    currenthelpdiv = undefined;
  }
}
