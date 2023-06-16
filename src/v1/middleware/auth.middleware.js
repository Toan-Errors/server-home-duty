const jwt = require('jsonwebtoken');

const authMiddleware = {
  isAuth: (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const bearer = req.headers.authorization.split(' ')[0];
      if (bearer !== 'Bearer') {
        res.status(500).json({ message: 'Authentication is required' });
      }

      const decoded = jwt.verify(token, process.env.SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Authentication is required' });
    }
  }
}

module.exports = authMiddleware;