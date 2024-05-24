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
  if (showtargets) {
    showtargets = false;
  } else {
    showtargets = true;
  }
}