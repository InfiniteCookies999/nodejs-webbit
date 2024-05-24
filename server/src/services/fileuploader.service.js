const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class FileUploaderService {

  getFileExtension(file) {
    return file.mimetype.split('/').pop();
  }

  moveFile(srcFile, destDir, destFileName) {
    if (!destDir.endsWith('/'))
      destDir += '/';
    
    const src = fs.createReadStream(srcFile.path);
    const dest = fs.createWriteStream(destDir + destFileName);
    src.pipe(dest);
  }

  moveFileAndGenRandomName(id, srcFile, destDir, oldFile) {
    if (!destDir.endsWith('/'))
      destDir += '/';

    // Deleting the old file if it exists.
    if (oldFile) {
      fs.unlink(destDir + '/' + oldFile, (error) => {
        // ignore the error because if the file doesn't exist we don't
        // care.
      });
    }

    const ext = this.getFileExtension(srcFile);
    const name = id + '-' + uuidv4() + '.' + ext;
    this.moveFile(srcFile, destDir, name);
    return name;
  }
}

module.exports = new FileUploaderService();