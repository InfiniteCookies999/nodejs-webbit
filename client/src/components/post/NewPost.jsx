import PageLayout from '../PageLayout';
import { useParams } from "react-router-dom"
import styles from './NewPost.module.css';

function swapUnderline(target) {
  for (const child of document.getElementById(styles.tabContainer).children) {
    child.querySelector('.' + styles.tabUnderline).hidden = true;
  }
  
  // show our underline.
  const parent = target.parentElement;
  parent.querySelector('.' + styles.tabUnderline).hidden = false;
}

function swapUpload(showChildId) {  
  for (const child of document.getElementById(styles.bodyContainer).children) {
    child.hidden = true;
  }
  document.getElementById(styles.bodyContainer).style['border-style'] = 'solid';
  document.getElementById(showChildId).hidden = false;
}

function dragFinished(e) {
  e.target.parentElement.classList.remove('border-primary');
  const input = document.getElementById('file-input-holder');
  if (input.files.length > 0) {
    // Do not remove the solid border if there is already a file being displayed.
    return;
  }
  document.getElementById(styles.bodyContainer).style['border-style'] = 'dashed';
}

function updateDisplayImageLeftRightArrows() {
  const input = document.getElementById('file-input-holder');
  const imageDisplay = document.getElementById(styles.imageDisplay);
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
  const imageDisplay = document.getElementById(styles.imageDisplay);
  imageDisplay.hidden = false;
  document.getElementById(styles.dragDropText).hidden = true;
  document.getElementById(styles.mediaDragDrop).classList.remove(styles.mediaDragDropPointer);

  if (input.files.length === 4) {
    document.getElementById(styles.addImages).hidden = true;
  }

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    imageDisplay.style.backgroundImage = `url(${reader.result})`;
    imageDisplay.setAttribute("data-index", input.files.length - 1);
    document.getElementById(styles.imageDisplay).hidden = false;
    updateDisplayImageLeftRightArrows();
  };
}

function changeMediaImage(newIndex) {
  const input = document.getElementById('file-input-holder');
  const imageDisplay = document.getElementById(styles.imageDisplay);
  
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
        const body = document.getElementById(styles.bodyTextArea).innerText;
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
        <br />
        <h3>Create Post</h3>
        <div id={styles.tabContainer} className="pl-2">
          <div>
            <span className={styles.tab} onClick={(e) => {
              swapUnderline(e.target);
              swapUpload(styles.bodyTextArea);
              
            }}>Text</span>
            <div className={`${styles.tabUnderline} bg-primary`}></div>
          </div>
          <div className="pl-3">
            <span className={styles.tab} onClick={(e) => {
              swapUnderline(e.target);
              swapUpload(styles.mediaDragDrop);
              const input = document.getElementById('file-input-holder');
              if (input.files.length === 0) {
                document.getElementById(styles.bodyContainer).style['border-style'] = 'dashed';
              }

            }}>Media</span>
            <div className={`${styles.tabUnderline} bg-primary`} hidden={true}></div>
          </div>            
        </div>
        
        <br />
        <input id='title-input' placeholder="Title*" className="form-control shadow-none" maxLength={300} />
        <br />
        <div id={styles.bodyContainer}>
          <div id={styles.bodyTextArea}
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

            <div id={styles.mediaDragDrop} hidden={true} className={styles.mediaDragDropPointer}
              onClick={(e) => {
                
                
                if (e.target !== document.getElementById(styles.mediaDragDrop) &&
                    e.target !== document.getElementById(styles.dragDropText)) {
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
                  document.getElementById(styles.bodyContainer).style['border-style'] = 'solid';
                  addMediaImage(file);
                };
                selector.click();
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.target.parentElement.classList.add('border-primary');
                document.getElementById(styles.bodyContainer).style['border-style'] = 'solid';
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
                    document.getElementById(styles.bodyContainer).style['border-style'] = 'dashed';
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
              <span id={styles.dragDropText}>Drag and drop media or click to upload</span>
              <input id="file-input-holder" type="file" name="file-holder" multiple="multiple" hidden={true}/>
              <input id="file-selector" type="file" hidden={true} />

              <div id={styles.imageDisplay} data-index="0" hidden={true}>
                <span id={styles.imageTrash} className={`bx bx-trash ${styles.imageDisplayIcon}`} onClick={() => {
                  const index = parseInt(document.getElementById(styles.imageDisplay).getAttribute("data-index"));
                  
                  const input = document.getElementById('file-input-holder');
                  
                  removeMediaFile(input, index);

                  document.getElementById(styles.addImages).hidden = false;

                  if (input.files.length === 0) {
                    document.getElementById(styles.bodyContainer).style['border-style'] = 'dashed';
                    document.getElementById(styles.imageDisplay).hidden = true;
                    document.getElementById(styles.dragDropText).hidden = false;
                    document.getElementById(styles.mediaDragDrop).classList.add(styles.mediaDragDropPointer);
                  } else  {
                    const newIndex = index === 0 ? 0 : index - 1;
                    changeMediaImage(newIndex);
                  }
                }}></span>
                <div id={styles.addImages} className={styles.imageDisplayIcon} onClick={() => {
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
                  <span className="bx bx-images"></span>
                  <span id={styles.addImagesText}>Add</span>
                </div>
                <span id={styles.imageLeft} className={`bx bx-caret-left ${styles.imageDisplayIcon}`} hidden={true} onClick={() => {
                  const index = parseInt(document.getElementById(styles.imageDisplay).getAttribute("data-index"));
                  changeMediaImage(index - 1);
                }}></span>
                <span id={styles.imageRight} className={`bx bx-caret-right ${styles.imageDisplayIcon}`} hidden={true} onClick={() => {
                  const index = parseInt(document.getElementById(styles.imageDisplay).getAttribute("data-index"));
                  changeMediaImage(index + 1);
                }}></span>
              </div>                  
            </div>
        </div>
        <button className='mt-2 bg-primary' id={styles.submitBtn}>Post</button>
      </form>
    } />
  )
}