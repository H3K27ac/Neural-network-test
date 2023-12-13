let layertypes = ["connectedlayer","activationlayer","dropoutlayer","batchnormlayer","layernorm","weightnorm"];
let layernames = ["Fully connected layer","Activation layer","Dropout layer","Batch normalisation","Layer normalisation","Weight normalisation"];
let layercolor = ["white","lightgray","lightgreen","lightblue","blue","mediumslateblue"];
let modifytypes = [[],[],["dropoutlayer","dropconnect"],["batchnormlayer","batchrenorm","batchkalman","decorbatchnorm"],["layernorm","instancenorm","groupnorm"],["weightnorm","weightstand"]];
let modifynames = [[],[],["Dropout layer","Dropconnect layer"],["Batch normalisation","Batch renormalisation","Batch Kalman normalisation","Decorrelated batch normalisation"],["Layer normalisation","Instance normalisation","Group normalisation"],["Weight normalisation","Weight Standardisation"]];
let modifynames2 = [[],[],["DL","DCL"],["BN","BRN","BKN","DBN"],["LN","IN","GN"],["WN","WS"]];
let modifycolor = [[],[],["lightgreen","chartreuse"],["lightblue","deepskyblue","cornflowerblue","lightskyblue"],["blue","steelblue","darkcyan"],["mediumslateblue","slateblue"]];
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
      let j2 = modifytypes[i].length
      if (j2 != 0) {
        let modifylayercontainer = document.createElement("div");
        modifylayercontainer.className = "modifylayercontainer"
        for (let j=0; j<j2; j++) {
          let modifylayer = document.createElement("button");
          let modifylayertext = document.createElement("span");
          modifylayer.className = "modifylayer"
          modifylayertext.className = "modifylayertext"
          modifylayer.style.backgroundColor = modifycolor[i][j]
          modifylayertext.innerHTML = modifynames2[i][j]
          modifylayer.appendChild(modifylayertext)
          modifylayercontainer.appendChild(modifylayer)
        }
        layer.appendChild(modifylayercontainer)
      }
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
  let i2 = children.length;
  for (let i=0; i<i2; i++) {
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
  let neuronvalue = document.createElement("span")
  neuronvalue.className = "neuronvalue"
  neuronvalue.innerHTML = "In"
  let neuronvalue2 = document.createElement("span")
  neuronvalue2.className = "neuronvalue"
  neuronvalue2.innerHTML = "Out"
  neuron.className = "neuron"
  neuron.id = "neuron"
  neuron2.className = "neuron"
  neuron2.id = "neuron2"
  weight.className = "weight"
  weight.id = "weight"
  neuron.appendChild(neuronvalue)
  neuron2.appendChild(neuronvalue2)
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

function MakeDraggable(i) {
  let object = document.getElementById(layertypes[i] + "incontainer")
  let layercontainer = document.getElementById("layercontainer")
  let isDragging = false;
  let isSnapped = false;
  let originalPosition = { x: 0, y: 0 };
  let closestObject;
  let ghostleft = 0;
  let ghosttop = 0;
  let leftofobj = true
  let minDistance = Number.MAX_SAFE_INTEGER;

  object.addEventListener('mousedown', handleMouseDown);
  object.addEventListener('touchstart', handleTouchStart);

    function handleMouseDown(event) {
      isDragging = true;
      originalPosition.x = event.clientX - object.offsetLeft;
      originalPosition.y = event.clientY - object.offsetTop;

      handleGhost()

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    function handleTouchStart(event) {
      event.preventDefault()
      isDragging = true;
      originalPosition.x = event.touches[0].clientX - object.offsetLeft;
      originalPosition.y = event.touches[0].clientY - object.offsetTop;

      handleGhost()
      
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
        ghostleft = event.touches[0].clientX - originalPosition.x;
        ghosttop = event.touches[0].clientY - originalPosition.y;
        if (isDragging && isSnapped == false) {
          let ghost = document.getElementById(layertypes[i] + "ghost")
          ghost.style.left = ghostleft + 'px';
          ghost.style.top = ghosttop + 'px';
        }
        handleSnap();
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
          if (ghost) {
                ghost.remove();
            }
          let newobject = document.createElement("div");
          let layertext = document.createElement("span");
          let deletelayer = document.createElement("button");
          let j2 = modifytypes[i].length
          if (j2 != 0) {
          let modifylayercontainer = document.createElement("div");
          modifylayercontainer.className = "modifylayercontainer"
          for (let j=0; j<j2; j++) {
            let modifylayer = document.createElement("button");
            let modifylayertext = document.createElement("span");
            modifylayer.className = "modifylayer"
            modifylayertext.className = "modifylayertext"
            modifylayer.style.backgroundColor = modifycolor[i][j]
            modifylayertext.innerHTML = modifynames2[i][j]
            modifylayer.onclick = function() {
              let index;
              let m2 = container.children.length
              for (let m=0; m<m2; m++) {
                if (container.children[m] === newobject) {
                  index = m;
                }
              }
              layerorder[index-2] = modifytypes[i][j]
              layertext.innerHTML = modifynames[i][j]
              newobject.style.backgroundColor = modifycolor[i][j]
            }
              modifylayer.appendChild(modifylayertext)
              modifylayercontainer.appendChild(modifylayer)
          }
          newobject.appendChild(modifylayercontainer)
          }
          newobject.className = "layerincontainer"
          newobject.style.backgroundColor = layercolor[i]
          layertext.className = "layertext"
          layertext.innerHTML = layernames[i]
          deletelayer.className = "deletelayer"
          deletelayer.onclick = function() {
            let index;
            let m2 = container.children.length
              for (let m=0; m<m2; m++) {
                if (container.children[m] === newobject) {
                  index = m;
                }
              }
            newobject.remove()
            layerorder.splice(index-2,1)
            document.getElementById("layers").innerHTML = "index done"
          };
          newobject.appendChild(layertext)
          newobject.appendChild(deletelayer)
          if (layerorder.length == 0) {
            container.insertBefore(newobject,container.children[layerorder.length+2])
            layerorder.push(layertypes[i])
          } else {
            newobject.id = "layer " + closestObject
            document.getElementById("layers").innerHTML = "insert" 
            container.insertBefore(newobject,container.children[closestObject+2]);
            layerorder.splice(closestObject,0,layertypes[i])
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

  function handleGhost() {
    let layer = document.createElement("div");
    let layertext = document.createElement("span");
    layer.className = "layerghost"
    layer.id = layertypes[i] + "ghost"
    layer.style.backgroundColor = layercolor[i]
    layertext.className = "layertext"
    layertext.innerHTML = layernames[i]
    layer.appendChild(layertext)
    layercontainer.appendChild(layer)
  }
  
  function handleSnap() {
    let container = document.getElementById("inputcontainer")
    let ghost = document.getElementById(layertypes[i] + "ghost");
    let neuron = document.getElementById("neuron")
    let neuron2 = document.getElementById("neuron2")
    const x1 = neuron.offsetLeft + neuron.offsetWidth / 2;
    const x2 = neuron2.offsetLeft + neuron2.offsetWidth / 2;
    const height = -((2 * neuron.offsetTop) + (3 * neuron.offsetHeight)) / 4
  //    const x3 = (x1 + x2)/(layerorder.length+2) - (x1 * (layerorder.length+2));
    if (!isSnapped) {
    if (Math.abs(ghosttop-height) < 50) {
      isSnapped = true
      ghost.style.left = 0 + "px";
      ghost.style.top = 0 + "px";
      ghost.style.position = "relative";
      ghost.style.opacity = 0.8;
      if (layerorder.length == 0) {
        document.getElementById("layers").innerHTML = "set"
        container.insertBefore(ghost,container.children[layerorder.length+2])
   //       ghost.style.left = x3
   //       ghost.style.top = height
      } else {
        closestObject = 0
        minDistance = Number.MAX_SAFE_INTEGER;
        for (let n=0; n<layerorder.length; n++) {
          const obj = container.children[n+2]
          const distance = Math.abs(ghostleft - obj.offsetLeft);
          if (distance < minDistance) {
            minDistance = distance;
            closestObject = n;
          }
        }
        if (ghostleft > container.children[closestObject+2].offsetLeft) {
          closestObject += 1
          leftofobj = false
        } else {
          leftofobj = true
        }
          container.insertBefore(ghost,container.children[closestObject+2]);
        }
      }
      } else {
      if (Math.abs(ghosttop-height) > 50) {
        isSnapped = false;
        ghost.remove()
        handleGhost()
        ghost.style.left = ghostleft + 'px';
        ghost.style.top = ghosttop + 'px';
      } else {
        if ((!leftofobj && ghostleft < container.children[closestObject+2].offsetLeft)||(leftofobj && ghostleft > container.children[closestObject+2].offsetLeft)) {
          isSnapped = false;
          ghost.remove()
          handleGhost()
          ghost.style.left = ghostleft + 'px';
          ghost.style.top = ghosttop + 'px';
        }
      }
    }
  }
}


