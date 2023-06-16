const User = require('../models/user.model');

const userController = {
  findUserByName: async (name) => {
    try {
      if (!name) throw new Error('Tên không được để trống');
      const user = await User.findOne({ name });
      return user;
    } catch (error) {
      console.log(error);
    }
  },
  findUserById: async (id) => {
    try {
      if (!id) throw new Error('Id không được để trống');
      return await User.findById(id);
    } catch (error) {
      console.log(error);
    }
  },
  register: async (req, res) => {
    try {
      const { name, password } = req.body;
      if (!name || !password) {
        res.status(400).json({ message: 'Tên và mật khẩu không được để trống' });
      }
      const user = await userController.findUserByName(name);
      if (user) {
        res.status(400).json({ message: 'Tên đã tồn tại' });
      }

      const newUser = new User({ name });
      newUser.setPassword(password);

      await newUser.save();

      res.status(200).json(newUser.toAuthJSON());
    } catch (error) {
      console.log(error);
    }
  },
  login: async (req, res) => {
    const { name, password } = req.body;
    try {
      if (!name || !password) {
        res.status(400).json({ message: 'Tên và mật khẩu không được để trống' });
      }
      const user = await userController.findUserByName(name);
      if (!user) {
        res.status(400).json({ message: 'Tên không tồn tại' });
      }

      const isValidPassword = user.validatePassword(password);
      if (!isValidPassword) {
        res.status(400).json({ message: 'Mật khẩu không đúng' });
      }

      res.status(200).json(user.toAuthJSON());
    } catch (error) {
      res.status(400).json({ message: 'Lỗi từ máy chủ' });
      // console.log(error);
    }
  },
  authenticate: async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        res.status(400).json({ message: 'Tài khoản không tồn tại' });
      }

      const { sub } = user;

      const userFound = await userController.findUserById(sub);
      if (!userFound) {
        res.status(400).json({ message: 'Tài khoản không tồn tại' });
      }

      res.status(200).json(userFound.toAuthJSON());
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = userController;