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
  document.getElementById(showChildId).hidden = false;
}

export default function NewPost() {
  
  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-3">

        </div>
        <div className="col-sm-6">
          <form >
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
                  
                }}>Media</span>
                <div className="tab-underline bg-primary" hidden={true}></div>
              </div>            
            </div>
            
            <br />
            <input placeholder="Title*" className="form-control shadow-none" />
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

                <div id="media-drag-drop" hidden={true}>
                  <span id="drag-drop-text">Drag and drop media or click to upload</span>
                  <input type="file" style={{display:"none"}}/>
                </div>
            </div>
            <span className='mt-2 bg-primary' id='submit-btn' postActionType="submit">Post</span>
          </form>
        </div>
        <div className="col-sm-3">
          
        </div>
      </div>
    </div>
  );
}