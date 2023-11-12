let layertypes = ["activationlayer","dropoutlayer","batchnormlayer","layernorm"];
let layernames = ["Activation layer","Dropout layer","Batch normalisation","Layer normalisation"];
let layercolor = ["lightgray","lightgreen","lightblue","blue"];
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
          switch (layertypes[i]) {
            case "batchnormlayer":
              let modifylayercontainer = document.createElement("div");
              let modifylayer = document.createElement("button");
              let originallayer = document.createElement("button");
              let modifylayertext = document.createElement("span");
              let originallayertext = document.createElement("span");
              modifylayercontainer.className = "modifylayercontainer"
              modifylayer.className = "modifylayer"
              modifylayer.style.backgroundColor = "deepskyblue"
              modifylayertext.className = "modifylayertext"
              modifylayertext.innerHTML = "BRN"
              modifylayer.onclick = function() {
                let index;
                let m2 = container.children.length
                for (let m=0; m<m2; m++) {
                if (container.children[m] === newobject) {
                  index = m;
                }
              }
              layerorder[index-2] = "batchrenorm"
              layertext.innerHTML = "Batch renormalisation"
              newobject.style.backgroundColor = "deepskyblue"
            }
              originallayer.className = "modifylayer"
              originallayer.style.backgroundColor = "lightblue"
              originallayertext.className = "modifylayertext"
              originallayertext.innerHTML = "BN"
              originallayer.onclick = function() {
                let index;
                let m2 = container.children.length
                for (let m=0; m<m2; m++) {
                if (container.children[m] === newobject) {
                  index = m;
                }
              }
              layerorder[index-2] = "batchnormlayer"
              layertext.innerHTML = "Batch normalisation"
              newobject.style.backgroundColor = "lightblue"
            }
              modifylayer.appendChild(modifylayertext)
              originallayer.appendChild(originallayertext)
              modifylayercontainer.appendChild(originallayer)
              modifylayercontainer.appendChild(modifylayer)
              newobject.appendChild(modifylayercontainer)
              break;
            case "layernorm":
              let modifylayercontainer = document.createElement("div");
              let modifylayer = document.createElement("button");
              let modifylayer2 = document.createElement("button");
              let originallayer = document.createElement("button");
              let modifylayertext = document.createElement("span");
              let modifylayertext2 = document.createElement("span");
              let originallayertext = document.createElement("span");
              modifylayercontainer.className = "modifylayercontainer"
              modifylayer.className = "modifylayer"
              modifylayer.style.backgroundColor = "steelblue"
              modifylayertext.className = "modifylayertext"
              modifylayertext.innerHTML = "IN"
              modifylayer2.className = "modifylayer"
              modifylayer2.style.backgroundColor = "slateblue"
              modifylayertext2.className = "modifylayertext"
              modifylayertext2.innerHTML = "GN"
              modifylayer.onclick = function() {
                let index;
                let m2 = container.children.length
                for (let m=0; m<m2; m++) {
                if (container.children[m] === newobject) {
                  index = m;
                }
              }
              layerorder[index-2] = "instancenorm"
              layertext.innerHTML = "Instance normalisation"
              newobject.style.backgroundColor = "steelblue"
            }
              modifylayer2.onclick = function() {
                let index;
                let m2 = container.children.length
                for (let m=0; m<m2; m++) {
                if (container.children[m] === newobject) {
                  index = m;
                }
              }
              layerorder[index-2] = "groupnorm"
              layertext.innerHTML = "Group normalisation"
              newobject.style.backgroundColor = "slateblue"
            }
              originallayer.className = "modifylayer"
              originallayer.style.backgroundColor = "blue"
              originallayertext.className = "modifylayertext"
              originallayertext.innerHTML = "LN"
              originallayer.onclick = function() {
                let index;
                let m2 = container.children.length
                for (let m=0; m<m2; m++) {
                if (container.children[m] === newobject) {
                  index = m;
                }
              }
              layerorder[index-2] = "layernorm"
              layertext.innerHTML = "Layer normalisation"
              newobject.style.backgroundColor = "blue"
            }
              modifylayer.appendChild(modifylayertext)
              modifylayer2.appendChild(modifylayertext2)
              originallayer.appendChild(originallayertext)
              modifylayercontainer.appendChild(originallayer)
              modifylayercontainer.appendChild(modifylayer)
              modifylayercontainer.appendChild(modifylayer2)
              newobject.appendChild(modifylayercontainer)
              break;
            default:
              break;
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
          if (ghost) {
                ghost.remove();
            }
          isSnapped = false;
          document.getElementById("layers").innerHTML = JSON.stringify(layerid)
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
  //    const x3 = (x1 + x2)/(layerorder.length+2) - (x1 * (layerorder.length+2));
      if (Math.abs(ghost.offsetTop-height) < 50) {
        if (layerorder.length == 0) {
          document.getElementById("layers").innerHTML = "snapping"
          isSnapped = true
          document.getElementById("layers").innerHTML = "set"
   //       ghost.style.left = x3
   //       ghost.style.top = height
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


