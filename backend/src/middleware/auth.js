const jwt = require('jsonwebtoken');
const Factory = require('../models/Factory');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const factory = await Factory.findOne({ _id: decoded.id });

    if (!factory) {
      throw new Error();
    }

    req.token = token;
    req.factory = factory;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate.' });
  }
};

module.exports = auth;
