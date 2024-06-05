var showtargets = false;
var userdata;

function SettingsToggle(id,text,func) {
  func();
  let button = document.getElementById(id);
  if (button.classList.contains("on")) {
    button.innerHTML = "Show " + text;
    button.classList.remove("on");
    button.classList.add("off");
  } else {
    button.innerHTML = "Hide " + text;
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

function UpdateUserData() {
  userdata = {
    structure,
    learnrate,
    weightrange,
    biasrange,
    weights,
    biases
  }
}

function UpdateFromData() {
  structure = userdata.structure;
  layers = structure.length-1;
  learnrate = userdata.learnrate;
  weightrange = userdata.weightrange;
  biasrange = userdata.biasrange;
  weights = userdata.weights;
  biases = userdata.biases;
  Create(false,true);
}

function Export() {
  let button = document.getElementById("exportbutton");
  UpdateUserData();
  console.log(userdata);
  try {
    const json = JSON.stringify(userdata);
    const base64 = btoa(json);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(base64)
        .then(() => {
          button.style.color = "Lime";
          button.style.borderColor = "Lime";
          button.innerHTML = "Exported";
          setTimeout(function() {
            button.style.color = "White";
            button.style.borderColor = "White";
            button.innerHTML = "Export";
          }, 1000);
        })
        .catch((error) => {
          //
        });
    }
  } catch (error) {
    Warn("exportbutton","Export","Error");
    return null;
  }
}

function Import() {
  let base64 = document.getElementById("importdata").value;
  try {
    const json = atob(base64);
    userdata = JSON.parse(json);
    UpdateFromData();
  } catch (error) {
    Warn("importbutton","Import","Error");
    return null;
  }
}



