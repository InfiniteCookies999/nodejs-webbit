const { HttpError } = require('../middleware');
const { SubWebbitService, FileUploaderService } = require('../services');

class SubWebbitController {

  async get(req, res, next) {
    try {

      const sub = await SubWebbitService.getSubWebbitByName(req.params.subname);
      if (!sub) {
        throw new HttpError("Subwebbit doesn't exist", 404);
      }

      await SubWebbitService.checkViewAccess(req.session, sub);

      res.json(sub.get({ plain: true }));

    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {

      if (await SubWebbitService.getSubWebbitByName(req.body.name)) {
        return res.json({ "status": "name taken" });
      }

      await SubWebbitService.createSubWebbit(req.session, req.body);

      res.end();

    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {

      await SubWebbitService.deleteSubwebbitByName(req.session, req.params.name);
    
      res.end();

    } catch (error) {
      next(error);
    }
  }

  async updateDescription(req, res, next) {
    try {
      const name = req.params.name;
      const description = req.body.description;

      await SubWebbitService.updateSubWebbit(name, req.session, sub => {
        sub.description = description;
        res.end();
      });
    } catch (error) {
      next(error);
    }
  }

  async updateBannerIcon(req, res, next) {
    try {

      const name = req.params.name;
      await SubWebbitService.updateSubWebbit(name, req.session, sub => {
        
        const file = FileUploaderService
          .moveFileAndGenRandomName(sub.id,
                                    req.file,
                                    'static/uploads/subwebbit/banners',
                                    sub.bannerFile);

        sub.bannerFile = file;
        
        res.end();
      });

    } catch (error) {
      next(error);
    }
  }

  async updateBackgroundIcon(req, res, next) {
    try {

      const name = req.params.name;
      await SubWebbitService.updateSubWebbit(name, req.session, sub => {
        
        const file = FileUploaderService
          .moveFileAndGenRandomName(sub.id,
                                    req.file,
                                    'static/uploads/subwebbit/backgrounds',
                                    sub.backgroundFile);

        sub.backgroundFile = file;
        
        res.end();
      });

    } catch (error) {
      next(error);
    }
  }

  async updateCommunityIcon(req, res, next) {
    try {

      const name = req.params.name;
      await SubWebbitService.updateSubWebbit(name, req.session, sub => {
        
        const file = FileUploaderService
          .moveFileAndGenRandomName(sub.id,
                                    req.file,
                                    'static/uploads/subwebbit/community_pictures',
                                    sub.communityFile);

        sub.communityFile = file;
        
        res.end();
      });

    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SubWebbitController();