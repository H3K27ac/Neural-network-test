let layertypes = ["activationlayer","batchnormlayer"];
let layernames = ["Activation layer", "Batch normalisation"];
let layerorder = [];


function ReplenishLayers() {
  for (let i=0; i<layertypes.length; i++) {
    if (document.getElementById(layertypes[i] + "incontainer") == null) {
      let container = document.getElementById("layercontainer");
      let layer = document.createElement("div");
      let layertext = document.createElement("span");
      layer.className = "layerincontainer"
      layer.id = layertypes[i] + "incontainer"
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
  neuron.className = "neuron"
  neuron.id = "neuron"
  let neuron2 = document.createElement("div")
  neuron2.className = "neuron"
  neuron2.id = "neuron2"
  container.appendChild(neuron)
  container.appendChild(neuron2)
  let weight = document.createElement("div")
  weight.className = "weight"
  weight.id = "weight"
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
      layertext.className = "layertext"
      layertext.innerHTML = layernames[i]
      layer.appendChild(layertext)
      document.getElementById("layercontainer").appendChild(layer)
      document.getElementById("layers").innerHTML = "start"
      
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }

    function handleMouseMove(event) {
        if (isDragging == true && isSnapped == false) {
          let ghost = document.getElementById(layertypes[i] + "ghost")
          ghost.style.left = (event.clientX - originalPosition.x) + 'px';
          ghost.style.top = (event.clientY - originalPosition.y) + 'px';

          isSnapped = false;

          handleSnap();
        }
    }

    function handleTouchMove(event) {
        event.preventDefault()
        if (isDragging == true && isSnapped == false) {
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
      document.getElementById("layers").innerHTML = "end"
        if (isSnapped) {
            // Object is snapped, remove the ghost and add the object
            if (ghost) {
                ghost.remove();
            }
          if (layerorder == []) {
            object.id = "layer " + i
            container.insertBefore(object,neuron2)
            layerorder.push(layertypes[i])
          } else {
            let closestObject;
            let minDistance = Number.MAX_SAFE_INTEGER;
            for (let n=0; n<layerorder.length; n++) {
              const obj = document.getElementById("layer " + n)
              const distance = Math.abs(ghost.offsetLeft - obj.right);
              if (distance < minDistance) {
                minDistance = distance;
                closestObject = n;
              }
            }
            if (object.offsetLeft < document.getElementById("layer " + closestObject).offsetRight) {
              for (let m=closestObject; m<layerorder.length; m++) {
                document.getElementById("layer " + m).id = "layer " + (closestObject+1)
              }
              object.id = "layer " + closestObject
              container.insertBefore(object,document.getElementById("layer " + closestObject))
              layerorder.splice(closestObject,0,layertypes[i])
            } else {
              for (let m=closestObject+1; m<layerorder.length; m++) {
                document.getElementById("layer " + m).id = "layer " + (closestObject+2)
              }
              object.id = "layer " + (closestObject+1)
              if (closestObject+1 == layerorder) {
                container.insertBefore(object,document.getElementById("neuron2"))
                layerorder.push(layertypes[i])
              } else {
                container.insertBefore(object,document.getElementById("layer " + (closestObject+1)))
                layerorder.splice(closestObject+1,0,layertypes[i])
              }
            }
      }
        } else {
            // Object is not snapped, remove the ghost
            if (ghost) {
                ghost.remove();
            }
        }
    }

    function handleSnap() {
      let neuron = document.getElementById("neuron")
      let neuron2 = document.getElementById("neuron2")
      const x1 = neuron.offsetLeft + neuron.offsetWidth / 2;
      const x2 = neuron2.offsetLeft + neuron2.offsetWidth / 2;
      const x3 = (x1 + x2)/(layerorder.length+2);
      
      let container = document.getElementById("inputcontainer");
      if (layerorder == []) {
        ghost.offsetLeft = x3
      } else {
        ghost.offsetLeft = x3
      }
      isSnapped = true
   //     const containerRect = container.getBoundingClientRect();

   //     if (
   //         draggableRect.left >= containerRect.left &&
   //         draggableRect.top >= containerRect.top &&
   //         draggableRect.right <= containerRect.right &&
  //          draggableRect.bottom <= containerRect.bottom
  //      ) {
 //           isSnapped = true;
//        } else {
//            isSnapped = false;
//        }
    }
}


