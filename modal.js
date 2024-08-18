class Modal {
  constructor(){
    this.modalStyle = {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: "1010",
      textAlign: "center",
      padding: "35px 0px 15px 0px",
      backgroundColor: "#fff",
      width: "auto",
      height: "auto",
      border: "1px solid #ccc",
      overflowY: "auto"
    };
    
    this.modalOverlayStyle = {
      zIndex: "1000",
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      backgroundColor: "#090909",
      opacity: "0.5",
    };
  }
  
  createModal(sky){
    const modal = document.createElement('div');
    modal.id = "modal";
    Object.assign(modal.style, this.modalStyle);
    
    const img = document.createElement('img');
    img.style.width = '70%';
    img.style.height = '70%';
    img.src = sky.path;
    modal.appendChild(img);
    
    const skySource = document.createElement('p');
    skySource.textContent = sky.source;
    skySource.style.color = "#000";
    
    modal.appendChild(skySource);
    
    const closeBtn = document.createElement('button');
    closeBtn.innerText = "close";
    modal.appendChild(closeBtn);
    
    const modalOverlay = document.createElement('div');
    modalOverlay.id = "modal-overlay";
    Object.assign(modalOverlay.style, this.modalOverlayStyle);
    
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
}