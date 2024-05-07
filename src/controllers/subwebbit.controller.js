const { SubWebbitService, FileUploaderService } = require('../services');

class SubWebbitController {

  async create(req, res, next) {
    try {

      if (await SubWebbitService.getSubWebbitByName(req.body.name)) {
        return res.json({ "status": "name taken" });
      }

      await SubWebbitService.createSubWebbit(req.session, req.body);

      return res.json({ "status": "success" });
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
        res.json({ "status": "updated" });
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
          .moveFileAndGenRandomName(req.file,
                                    'uploads/subwebbit/banners',
                                    sub.bannerFile);

        sub.bannerFile = file;
        
        res.json({ "status": "updated" });
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
          .moveFileAndGenRandomName(req.file,
                                    'uploads/subwebbit/backgrounds',
                                    sub.backgroundFile);

        sub.backgroundFile = file;
        
        res.json({ "status": "updated" });
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
          .moveFileAndGenRandomName(req.file,
                                    'uploads/subwebbit/community_pictures',
                                    sub.communityFile);

        sub.communityFile = file;
        
        res.json({ "status": "updated" });
      });

    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SubWebbitController();