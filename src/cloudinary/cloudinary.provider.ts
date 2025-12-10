import { v2 as Cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return Cloudinary.config({
      cloud_name: "dfnfsyjlz",
      api_key: "139278585153213",
      api_secret: "oRRHmP_ULDXV_fWkzj4977NxUi8",
    });
  },
};
