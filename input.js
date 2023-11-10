let layertypes = ["activationlayer","batchnormlayer"];
let layernames = ["Activation layer", "Batch normalisation"];
let layercolor = ["lightgray","lightblue"];
let layerid = [];
let layerorder = [];


function ReplenishLayers() {
  for (let i=0; i<layertypes.length; i++) {
    if (document.getElementById(layertypes[i] + "incontainer") == null) {
      let container = document.getElementById("layercontainer");
      let layer = document.createElement("div");
      let layertext = document.createElement("span");
      layer.className = "layerincontainer"
      layer.id = layertypes[i] + "incontainer"
      layer.style.backgroundColor = layercolor[i]
      layertext.className = "layertext"
      layertext.innerHTML = layernames[i]
      layer.appendChild(layertext)
      container.appendChild(layer);
      MakeDraggable(i)
    }
  }
  UpdateContainerWidth();
}

function UpdateContainerWidth() {
  let container = document.getElementById("layercontainer");
  let children = container.children;
  let width = 0;
  for (let i=0; i<children.length; i++) {
    width += children[i].offsetWidth;
  }
  width += 10
  container.style.width = width + 'px'
}

function CreateLayers() {
  let container = document.getElementById("inputcontainer");
  let neuron = document.createElement("div")
  let neuron2 = document.createElement("div")
  let weight = document.createElement("div")
  neuron.className = "neuron"
  neuron.id = "neuron"
  neuron2.className = "neuron"
  neuron2.id = "neuron2"
  weight.className = "weight"
  weight.id = "weight"
  container.appendChild(neuron)
  container.appendChild(neuron2)
  const x1 = neuron.offsetLeft + neuron.offsetWidth / 2;
  const x2 = neuron2.offsetLeft + neuron2.offsetWidth / 2;
  const length = x2 - x1;
  const centerX = (x1 + x2) / 2;
  weight.style.width = length + "px";
  weight.style.left = centerX - (length / 2) + "px";
  container.appendChild(weight)
}

function GenerateLayerId() {
  let random = Math.random()
  for (let m=0; m<layerid.length; m++) {
    if (random == layerid[m]) {
      GenerateLayerId() // absolutely unnecessary
    } else {
      return random
    }
  }
}

function DeleteLayer(i) {
  document.getElementById("layer " + i).remove()
//  layerorder.splice(i,1)
}

function MakeDraggable(i) {
    let object = document.getElementById(layertypes[i] + "incontainer")
    let isDragging = false;
    let isSnapped = false;
    let originalPosition = { x: 0, y: 0 };
    let closestObject;

    object.addEventListener('mousedown', handleMouseDown);
    object.addEventListener('touchstart', handleTouchStart);

    function handleMouseDown(event) {
      isDragging = true;
      originalPosition.x = event.clientX - object.offsetLeft;
      originalPosition.y = event.clientY - object.offsetTop;

      let layer = document.createElement("div");
      let layertext = document.createElement("span");
      layer.className = "layerghost"
      layer.id = layertypes[i] + "ghost"
      layertext.className = "layertext"
      layertext.innerHTML = layernames[i]
      layer.appendChild(layertext)
      document.getElementById("layercontainer").appendChild(layer)

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    function handleTouchStart(event) {
      event.preventDefault()
      isDragging = true;
      originalPosition.x = event.touches[0].clientX - object.offsetLeft;
      originalPosition.y = event.touches[0].clientY - object.offsetTop;

      let layer = document.createElement("div");
      let layertext = document.createElement("span");
      layer.className = "layerghost"
      layer.id = layertypes[i] + "ghost"
      layer.style.backgroundColor = layercolor[i]
      layertext.className = "layertext"
      layertext.innerHTML = layernames[i]
      layer.appendChild(layertext)
      document.getElementById("layercontainer").appendChild(layer)
      document.getElementById("layers").innerHTML = "start"
      
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }

    function handleMouseMove(event) {
        if (isDragging == true) {
          let ghost = document.getElementById(layertypes[i] + "ghost")
          ghost.style.left = (event.clientX - originalPosition.x) + 'px';
          ghost.style.top = (event.clientY - originalPosition.y) + 'px';

          isSnapped = false;

          handleSnap();
        }
    }

    function handleTouchMove(event) {
        event.preventDefault()
        if (isDragging == true) {
          document.getElementById("layers").innerHTML = "moving, but broken" + "," + event.touches[0].clientX + "," + event.touches[0].clientY + "," + originalPosition.x + "," +  originalPosition.y
          let ghost = document.getElementById(layertypes[i] + "ghost")
          document.getElementById("layers").innerHTML = "moving, but broken2"
          ghost.style.left = (event.touches[0].clientX - originalPosition.x) + 'px';
          ghost.style.top = (event.touches[0].clientY - originalPosition.y) + 'px';
          document.getElementById("layers").innerHTML = "moving"

          isSnapped = false;
          handleSnap();
        }
    }

    function handleMouseUp() {
      isDragging = false;
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      let ghost = document.getElementById(layertypes[i] + "ghost");
      
        if (isSnapped) {
            // Object is snapped, remove the ghost and add the object
            if (ghost) {
                ghost.remove();
            }
        } else {
            // Object is not snapped, remove the ghost

            if (ghost) {
                ghost.remove();
            }
        }
    }

    function handleTouchEnd() {
      isDragging = false;
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      let ghost = document.getElementById(layertypes[i] + "ghost");
      let container = document.getElementById("inputcontainer");
      document.getElementById("layers").innerHTML = "end"
        if (isSnapped) {
            // Object is snapped, remove the ghost and add the object
          let newobject = document.createElement("div");
          let layertext = document.createElement("span");
          let deletelayer = document.createElement("button");
          let random = GenerateLayerId()
          layerid.push(random)
          newobject.className = "layerincontainer"
          newobject.id = "layer " + String(random)
          newobject.style.backgroundColor = layercolor[i]
          layertext.className = "layertext"
          layertext.innerHTML = layernames[i]
          deletelayer.className = "deletelayer"
          deletelayer.onclick = function() {
            DeleteLayer(random);
          };
          newobject.appendChild(layertext)
          newobject.appendChild(deletelayer)
          if (layerorder.length == 0) {
            document.getElementById("layers").innerHTML = "insert"
            container.insertBefore(newobject,container.children[layerorder.length+2])
            layerorder.push(layertypes[i])
          } else {
            newobject.id = "layer " + closestObject
            document.getElementById("layers").innerHTML = "insert" + closestObject
            container.insertBefore(newobject,container.children[closestObject+2]);
            layerorder.splice(closestObject,0,layertypes[i])
          }
          if (ghost) {
                ghost.remove();
            }
          isSnapped = false;
          document.getElementById("layers").innerHTML = JSON.stringify(layerorder)
        } else {
            // Object is not snapped, remove the ghost
            if (ghost) {
                ghost.remove();
            }
        }
    }

    function handleSnap() {
      let container = document.getElementById("inputcontainer");
      let ghost = document.getElementById(layertypes[i] + "ghost");
      let neuron = document.getElementById("neuron")
      let neuron2 = document.getElementById("neuron2")
      const x1 = neuron.offsetLeft + neuron.offsetWidth / 2;
      const x2 = neuron2.offsetLeft + neuron2.offsetWidth / 2;
      const height = -((2 * neuron.offsetTop) + (3 * neuron.offsetHeight)) / 4
      const x3 = (x1 + x2)/(layerorder.length+2) - (x1 * (layerorder.length+2));
      document.getElementById("layers").innerHTML = "snap" + "," + ghost.offsetLeft + "," + height + "," + x3 + "," + x1 + "," + x2
      if (Math.abs(ghost.offsetTop-height) < 50) {
        if (layerorder.length == 0) {
          document.getElementById("layers").innerHTML = "snapping"
          isSnapped = true
          document.getElementById("layers").innerHTML = "set"
          ghost.style.left = x3
          ghost.style.top = height
        } else {
          isSnapped = true
          closestObject = 0
          let minDistance = Number.MAX_SAFE_INTEGER;
          for (let n=0; n<layerorder.length; n++) {
            const obj = container.children[n+2]
            const distance = Math.abs(ghost.offsetLeft - obj.offsetLeft);
            if (distance < minDistance) {
              minDistance = distance;
              closestObject = n;
            }
          }
          if (ghost.offsetLeft > container.children[closestObject+2].offsetLeft) {
            closestObject += 1
          }
        }
      }
    }
}


