// functions for analyzing sky images

function invertColor(rgbColorString){
  // binarize first. if any channel is > 200, we'll say that color is #fff. else #000.
  const match = rgbColorString.match(/(\d+)/g);
  const newChanColor = match.some(c => c > 200) ? 255 : 0;
  // then invert
  const invertedColor = match
                        .map(c => 255 - newChanColor)
                        .join(',');
  return `rgb(${invertedColor})`;
}

function createModal(skyColorData, skyName){
  const modalStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: "1010",
    textAlign: "center",
    padding: "10px",
    backgroundColor: "#fff",
    width: "80%",
    height: "auto",
    border: "1px solid #ccc",
    overflowY: "auto"
  };
  
  const modalOverlayStyle = {
    zIndex: "1000",
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "#090909",
    opacity: "0.5",
  };

  const modal = document.createElement('div');
  modal.id = "modal";
  Object.assign(modal.style, modalStyle);
  
  const title = document.createElement('p');
  title.textContent = 'sky palette (first 200 unique colors)';
  title.style.color = '#000';
  
  modal.appendChild(title);
  
  const colorDataDiv = document.createElement('div');
  colorDataDiv.style.display = 'flex';
  colorDataDiv.style.justifyContent = 'center';
  colorDataDiv.style.alignItems = 'center';
  colorDataDiv.style.width = '100%';
  colorDataDiv.style.flexWrap = 'wrap';
  colorDataDiv.style.gap = '3px';
  colorDataDiv.style.padding = '5px';
  
  const clickedColorDisplay = document.createElement('p');
  
  Array.from(skyColorData).forEach((color, idx) => {
    if(idx > 200) return;
    
    const colorDiv = document.createElement('div');
    colorDiv.style.border = '1px solid #000';
    colorDiv.style.backgroundColor = color;
    colorDiv.style.width = '30px';
    colorDiv.style.height = '10px';
    colorDiv.classList.add('colorDiv');
    colorDiv.addEventListener('click', (evt) => {
      clickedColorDisplay.style.backgroundColor = evt.target.style.backgroundColor;
      clickedColorDisplay.textContent = `${evt.target.style.backgroundColor}`;
      clickedColorDisplay.style.color = invertColor(evt.target.style.backgroundColor);
    });
    clickedColorDisplay.style.backgroundColor
    
    colorDataDiv.appendChild(colorDiv);
  });
  
  modal.appendChild(colorDataDiv);
  
  modal.appendChild(clickedColorDisplay);
  
  const skySource = document.createElement('p');
  skySource.textContent = skyName;
  skySource.style.color = '#000';
  
  modal.appendChild(skySource);
  
  const closeBtn = document.createElement('button');
  closeBtn.innerText = 'close';
  modal.appendChild(closeBtn);
  
  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'modal-overlay';
  Object.assign(modalOverlay.style, modalOverlayStyle);
  
  document.body.appendChild(modal);
  document.body.appendChild(modalOverlay);
  
  return new Promise(resolve => {
    closeBtn.onclick = () => {
        resolve(true);
    };
  }).finally(() => {
    // make sure to close modal
    document.body.removeChild(modal);
    document.body.removeChild(modalOverlay);
  });
}

async function analyzeImage(sky){
  if(!sky) return;
  
  const imgElement = sky.image;
  
  const canvas = document.createElement('canvas');
  canvas.width = imgElement.width;
  canvas.height = imgElement.height;
  
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
  
  const colors = new Set();
  
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for(let row = 0; row < canvas.height; row++){
    for(let col = 0; col < canvas.width; col++){
      const idx = (4 * row * canvas.width) + (4 * col);
      const r = imgData.data[idx];
      const g = imgData.data[idx + 1];
      const b = imgData.data[idx + 2];
      colors.add(`rgb(${r},${g},${b})`);
    }
  }
  
  await createModal(colors, sky.source);
  //console.log(colors);
}