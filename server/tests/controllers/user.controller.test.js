const { UserController } = require('../../src/controllers');
const { UserService, FileUploaderService } = require('../../src/services');
const httpMocks = require('node-mocks-http');

jest.mock('../../src/services/user.service');
jest.mock('../../src/services/fileuploader.service');

describe('#updateGender', () => {
  it('update gender successful', async () => {

    const response = httpMocks.createResponse();
    const request = httpMocks.createRequest();
    request.body = {
      gender: 'Non-Binary'
    }
    const mockUser = {
      gender: 'Woman',
      save: jest.fn()
    };

    request.session = {
      user: {
        id: 1
      }
    };

    UserService.getUserById.mockResolvedValue(mockUser);

    const mockNext = jest.fn();
    await UserController.updateGender(request, response, mockNext);
    expect(mockNext).not.toHaveBeenCalled();
    expect(UserService.getUserById).toHaveBeenCalled();
    expect(mockUser.save).toHaveBeenCalled();
    expect(mockUser.gender).toBe('Non-Binary');

  });
});

describe('#updateProfilePicture', () => {
  it('update picture', async () => {
    const response = httpMocks.createResponse();
    const request = httpMocks.createRequest();
    
    request.session = {
      user: {
        id: 1
      }
    };

    const newFile = 'newfile.png';
    request.file = { mimetype: 'image/png' };
    const mockUser = {
      id: 1,
      profileFile: '',
      save: jest.fn()
    };

    UserService.getUserById.mockResolvedValue(mockUser);
    FileUploaderService.moveFileAndGenRandomName.mockReturnValue(newFile);

    const mockNext = jest.fn();
    await UserController.updateProfilePicture(request, response, mockNext);
    expect(mockNext).not.toHaveBeenCalled();
    expect(mockUser.profileFile).toBe(newFile);
    expect(FileUploaderService.moveFileAndGenRandomName).toHaveBeenCalled();
    expect(mockUser.save).toHaveBeenCalled();

  });
});