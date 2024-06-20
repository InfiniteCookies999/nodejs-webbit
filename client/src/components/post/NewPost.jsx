import PageLayout from '../PageLayout';
import { useParams } from "react-router-dom"
import './NewPost.css';

function swapUnderline(target) {
  for (const child of document.getElementById('tab-container').children) {
    child.querySelector('.tab-underline').hidden = true;
  }
  
  // show our underline.
  const parent = target.parentElement;
  parent.querySelector('.tab-underline').hidden = false;
}

function swapUpload(showChildId) {  
  for (const child of document.querySelector('.body-container').children) {
    child.hidden = true;
  }
  document.querySelector('.body-container').style['border-style'] = 'solid';
  document.getElementById(showChildId).hidden = false;
}

function dragFinished(e) {
  e.target.parentElement.classList.remove('border-primary');
  const input = document.getElementById('file-input-holder');
  if (input.files.length > 0) {
    // Do not remove the solid border if there is already a file being displayed.
    return;
  }
  document.querySelector('.body-container').style['border-style'] = 'dashed';
}

function updateDisplayImageLeftRightArrows() {
  const input = document.getElementById('file-input-holder');
  const imageDisplay = document.getElementById('image-display');
  const leftCaret = imageDisplay.querySelector('.bx-caret-left');
  const rightCaret = imageDisplay.querySelector('.bx-caret-right');
  
  if (input.files.length > 1) {
    const index = imageDisplay.getAttribute('data-index');
    leftCaret.hidden = !(index > 0);
    rightCaret.hidden = !(index < input.files.length - 1);
  } else {
    leftCaret.hidden = true;
    rightCaret.hidden = true;
  }
}

function addMediaImage(file) {
  const input = document.getElementById('file-input-holder');
  const imageDisplay = document.getElementById('image-display');
  imageDisplay.hidden = false;
  document.getElementById('drag-drop-text').hidden = true;
  document.getElementById('media-drag-drop').classList.remove('media-drag-drop-pointer');

  if (input.files.length === 4) {
    document.getElementById('add-images').hidden = true;
  }

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    imageDisplay.style.backgroundImage = `url(${reader.result})`;
    imageDisplay.setAttribute("data-index", input.files.length - 1);
    document.getElementById('image-display').hidden = false;
    updateDisplayImageLeftRightArrows();
  };
}

function changeMediaImage(newIndex) {
  const input = document.getElementById('file-input-holder');
  const imageDisplay = document.getElementById('image-display');
  
  imageDisplay.setAttribute("data-index", newIndex);

  const reader = new FileReader();
  reader.readAsDataURL(input.files[newIndex]);
  reader.onload = () => {
    imageDisplay.style.backgroundImage = `url(${reader.result})`;
    updateDisplayImageLeftRightArrows();
  };
}

function removeMediaFile(input, index) {
  let newFiles = Array.from(input.files);
                      
  newFiles.splice(index, 1);
  const dataTransfer = new DataTransfer(newFiles);
  for (const f of newFiles) {
    dataTransfer.items.add(f);
  }
  input.files = dataTransfer.files;
}

export default function NewPost() {

  const { subname } = useParams();

  return (
    <PageLayout middle={
      <form onSubmit={(e) => {
        e.preventDefault();
        
        const title = document.getElementById('title-input').value;
        const body = document.getElementById('body-textarea').innerText;
        const files = document.getElementById('file-input-holder').files;

        if (title === "" || body === "") return;

        if (body.length > 40000) {
          return;
        }

        const formData = new FormData();
        formData.append("subname", subname);
        formData.append("title", title);
        formData.append("body", body);
        if (files.length > 0) {
          for (const f of files) {
            formData.append("media", f);
          }
        }

        fetch('/api/post', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        })
        .then(response => {
          if (response.status !== 200) {
            // something went wrong let us redirect to the home page.
            window.location.href = "/";
          }
          return response.json();
        })
        .then(response => {
          window.location.href = `/w/${subname}/comments/${response.postId}`;
        })
        .catch(error => console.log(error));
        
      }}>
        <h3>Create Post</h3>
        <div id="tab-container" className="pl-2">
          <div>
            <span className="tab" onClick={(e) => {
              swapUnderline(e.target);
              swapUpload('body-textarea');
              
            }}>Text</span>
            <div className="tab-underline bg-primary"></div>
          </div>
          <div className="pl-3">
            <span className="tab" onClick={(e) => {
              swapUnderline(e.target);
              swapUpload('media-drag-drop');
              const input = document.getElementById('file-input-holder');
              if (input.files.length === 0) {
                document.querySelector('.body-container').style['border-style'] = 'dashed';
              }

            }}>Media</span>
            <div className="tab-underline bg-primary" hidden={true}></div>
          </div>            
        </div>
        
        <br />
        <input id='title-input' placeholder="Title*" className="form-control shadow-none" maxLength={300} />
        <br />
        <div className="body-container">
          <div id="body-textarea"
              type="text"
              role="textbox"
              placeholder="Body"
              className="edit-box form-control shadow-none"
              contentEditable={true}
              onInput={(e) => {
                const area = e.target;
                if (area.innerHTML.trim() === '<br>') {
                  area.innerHTML = "";
                }
              }}
              />

            <div id="media-drag-drop" hidden={true} className='media-drag-drop-pointer'
              onClick={(e) => {
                
                
                if (e.target !== document.getElementById('media-drag-drop') &&
                    e.target !== document.getElementById('drag-drop-text')) {
                  return;
                }
                
                const selector = document.getElementById('file-selector');

                selector.onchange = () => {
                  const file = selector.files[0];
                  if (!file.type.startsWith('image/')) {
                    return;
                  }
                  
                  const input = document.getElementById('file-input-holder');
                  const transfer = new DataTransfer();
                  transfer.items.add(file);
                  input.files = transfer.files;
                  addMediaImage(file);
                };
                selector.click();
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.target.parentElement.classList.add('border-primary');
                document.querySelector('.body-container').style['border-style'] = 'solid';
              }}
              onDragEnd={dragFinished}
              onDragLeave={dragFinished}
              onDrop={(e) => {
                e.preventDefault();
                e.target.parentElement.classList.remove('border-primary');

                const input = document.getElementById('file-input-holder');

                if (input.files.length === 4) {
                  // Already too many files!
                  return;
                }

                if (e.dataTransfer.files.length === 0 ||
                    !e.dataTransfer.files[0].type.startsWith('image/')) {
                  if (input.files.length === 0) {
                    document.querySelector('.body-container').style['border-style'] = 'dashed';
                  }
                  return;
                }

                const file = e.dataTransfer.files[0];

                const transfer = new DataTransfer();
                for (const f of input.files) {
                  transfer.items.add(f);
                }
                transfer.items.add(file);
                input.files = transfer.files;

                addMediaImage(file);
                
              }}
              >
              <span id="drag-drop-text">Drag and drop media or click to upload</span>
              <input id="file-input-holder" type="file" name="file-holder" multiple="multiple" hidden={true}/>
              <input id="file-selector" type="file" hidden={true} />

              <div id="image-display" data-index="0" hidden={true}>
                <span className='bx bx-trash' onClick={() => {
                  const index = parseInt(document.getElementById('image-display').getAttribute("data-index"));
                  
                  const input = document.getElementById('file-input-holder');
                  
                  removeMediaFile(input, index);

                  document.getElementById('add-images').hidden = false;

                  if (input.files.length === 0) {
                    document.querySelector('.body-container').style['border-style'] = 'dashed';
                    document.getElementById('image-display').hidden = true;
                    document.getElementById('drag-drop-text').hidden = false;
                    document.getElementById('media-drag-drop').classList.add('media-drag-drop-pointer');
                  } else  {
                    const newIndex = index === 0 ? 0 : index - 1;
                    changeMediaImage(newIndex);
                  }
                }}></span>
                <div id="add-images" onClick={() => {
                  const selector = document.getElementById('file-selector');

                  selector.onchange = () => {
                    const file = selector.files[0];
                    if (!file.type.startsWith('image/')) {
                      return;
                    }
                    
                    const input = document.getElementById('file-input-holder');
                    const transfer = new DataTransfer();
                    for (const f of input.files) {
                      transfer.items.add(f);
                    }
                    transfer.items.add(file);
                    input.files = transfer.files;

                    addMediaImage(file);
                  };
                  selector.click();
                }}>
                  <span className='bx bx-images'></span>
                  <span id="add-images-text">Add</span>
                </div>
                <span className='bx bx-caret-left' hidden={true} onClick={() => {
                  const index = parseInt(document.getElementById('image-display').getAttribute("data-index"));
                  changeMediaImage(index - 1);
                }}></span>
                <span className='bx bx-caret-right' hidden={true} onClick={() => {
                  const index = parseInt(document.getElementById('image-display').getAttribute("data-index"));
                  changeMediaImage(index + 1);
                }}></span>
              </div>                  
            </div>
        </div>
        <button className='mt-2 bg-primary' id='submit-btn'>Post</button>
      </form>
    } />
  )
}