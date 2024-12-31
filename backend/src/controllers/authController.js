const Factory = require('../models/Factory');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.register = async (req, res) => {
  try {
    console.log('Register request headers:', req.headers);
    console.log('Register request body:', req.body);
    console.log('Register request method:', req.method);
    const { email, password, name, location, description } = req.body;
    
    if (!email || !password || !name) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const existingFactory = await Factory.findOne({ email });
    if (existingFactory) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const factory = new Factory({
      email,
      password,
      name,
      location,
      description
    });

    await factory.save();
    const token = generateToken(factory._id);
    
    res.status(201).json({
      success: true,
      token,
      factory: {
        id: factory._id.toString(),
        name: factory.name,
        email: factory.email
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const factory = await Factory.findOne({ email }).select('+password');
    
    if (!factory || !(await factory.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(factory._id);
    
    res.json({
      success: true,
      token,
      factory: {
        id: factory._id.toString(),
        name: factory.name,
        email: factory.email
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const factory = await Factory.findById(req.factory._id);
    if (!factory) {
      return res.status(404).json({ error: 'Factory not found' });
    }
    
    res.json({
      id: factory._id,
      name: factory.name,
      email: factory.email,
      location: factory.location,
      description: factory.description
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
