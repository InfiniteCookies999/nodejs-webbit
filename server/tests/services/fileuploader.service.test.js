const { FileUploaderService } = require('../../src/services');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

jest.mock('fs');
jest.mock('uuid');

describe('FileUploader', () => {
  describe('#getFileExtension', () => {
    it('from mimetype audio/aac', () => {
      file = {
        mimetype: 'audio/aac'
      };

      expect(FileUploaderService.getFileExtension(file)).toBe('aac');
    });
    it('from mimetype image/png', () => {
      file = {
        mimetype: 'image/png'
      };

      expect(FileUploaderService.getFileExtension(file)).toBe('png');
    });
    it('from mimetype application/x-httpd-php', () => {
      file = {
        mimetype: 'application/x-httpd-php'
      };

      expect(FileUploaderService.getFileExtension(file)).toBe('x-httpd-php');
    });
  });

  describe('#moveFileAndGenRandomName', () => {
    it('move file without old file', () => {
      file = {
        mimetype: 'image/png'
      };

      uuidv4.mockReturnValue('random');
      jest.spyOn(FileUploaderService, 'moveFile').mockReturnValue(undefined);

      expect(FileUploaderService.moveFileAndGenRandomName(1, file, 'dest')).toBe('1-random.png');
      expect(fs.unlink).not.toHaveBeenCalled();
      expect(FileUploaderService.moveFile).toHaveBeenCalled();
      
    });
    it('move file with old file', () => {
      file = {
        mimetype: 'image/png'
      };

      uuidv4.mockReturnValue('random');
      jest.spyOn(FileUploaderService, 'moveFile').mockReturnValue(undefined);

      expect(FileUploaderService.moveFileAndGenRandomName(1, file, 'dest', 'old')).toBe('1-random.png');
      expect(fs.unlink).toHaveBeenCalled();
      expect(FileUploaderService.moveFile).toHaveBeenCalled();
      
    });
  });
});