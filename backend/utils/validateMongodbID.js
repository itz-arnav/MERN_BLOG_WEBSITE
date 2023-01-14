const mongoose = require("mongoose");
mongoose.set('strictQuery', true);

const validateMongodbId = id => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new Error("User id is not valid or found");
};

module.exports = validateMongodbId;
