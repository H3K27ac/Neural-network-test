var showtargets = false;

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
    }
    showtargets = false;
  } else {
    if (mode=="created") {
      targetcolumn.style.display = "flex";
    }
    showtargets = true;
    DeleteElements("Weight");
    CreateWeights();
  }
}