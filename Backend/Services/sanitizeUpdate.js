module.exports = (req, ...allowedFields) => {
  const imageUrls = [];
  const images = Array.isArray(req.files) ? req.files : [];
  for (const image of images) {
    if (image && image.filename) {
      imageUrls.push(image.filename);
    }
  }

  const updateFields = {};
  allowedFields.forEach(f => {
    if(req.body[f] !== undefined) {
      updateFields[f] = req.body[f];
    };
  });
  return {
    imageUrls,
    updateFields
  };
};
