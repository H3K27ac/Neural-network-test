let layertypes = ["activationlayer","batchnormlayer"];
let layernames = ["Activation layer", "Batch normalisation"];


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
      originalPosition.x = object.offsetLeft - event.clientX;
      originalPosition.y = object.offsetTop - event.clientY;

      let layer = document.createElement("div");
      let layertext = document.createElement("span");
      layer.className = "layerincontainer"
      layer.id = layertypes[i] + "ghost"
      layertext.className = "layertext"
      layertext.innerHTML = layernames[i]
      layer.appendChild(layertext)

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    function handleTouchStart(event) {
      event.preventDefault()
      isDragging = true;
      originalPosition.x = object.offsetLeft - event.touches[0].clientX;
      originalPosition.y = object.offsetTop - event.touches[0].clientY;

      let layer = document.createElement("div");
      let layertext = document.createElement("span");
      layer.className = "layerincontainer"
      layer.id = layertypes[i] + "ghost"
      layertext.className = "layertext"
      layertext.innerHTML = layernames[i]
      layer.appendChild(layertext)
      document.getElementById("layers").innerHTML = "start"
      
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }

    function handleMouseMove(event) {
        if (isDragging) {
          let ghost = document.getElementById(layertypes[i] + "ghost")
          ghost.style.left = (event.clientX + originalPosition.x) + 'px';
          ghost.style.top = (event.clientY + originalPosition.y) + 'px';

          isSnapped = false;

   //       handleSnap();
        }
    }

    function handleTouchMove(event) {
        event.preventDefault()
        if (isDragging) {
          let ghost = document.getElementById(layertypes[i] + "ghost")
          ghost.style.left = (event.touches[0].clientX + originalPosition.x) + 'px';
          ghost.style.top = (event.touches[0].clientY + originalPosition.y) + 'px';
          document.getElementById("layers").innerHTML = "moving"

          isSnapped = false;
          
    //      handleSnap();
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
        } else {
            // Object is not snapped, remove the ghost
            if (ghost) {
                ghost.remove();
            }
        }
    }

    function handleSnap() {
        const draggableRect = object.getBoundingClientRect();
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


