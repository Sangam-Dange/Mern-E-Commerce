import AsyncHandler from "express-async-handler";
import UserModel from "../models/userModels.js";
import generateToken from "../utils/generateToken.js";

//? @desc     Auth user & get token
//? @route    Post /api/users/login
//? @access   Public

export const authUser = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("Invalid email or password");
  }

  const user = await UserModel.findOne({ email });
  const enteredPass = await user.matchPassword(password);

  if (user && enteredPass) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);

    throw new Error("Invalid email or password");
  }
});
//? @desc     Registering new user
//? @route    Post /api/users/register
//? @access   Public

export const registerUser = AsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await UserModel.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await UserModel.create({
    name,
    email,
    password,
  });

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid User Data");
  }
});

//? @desc     Get user profile
//? @route    Get /api/users/login
//? @access   private

export const getUserProfile = AsyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found ");
  }
});

//? @desc     Update user profile
//? @route    Put /api/users/profile
//? @access   private

export const updateUserProfile = AsyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user._id);
  const { name, email } = req.body;

  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found ");
  }
});

//? @desc     Get all users
//? @route    Get /api/users
//? @access   Private/Admin

export const getUsers = AsyncHandler(async (req, res) => {
  const users = await UserModel.find({});
  res.json(users);
});

//? @desc     Delete users
//? @route    Get /api/users/:id
//? @access   Private/Admin

export const getUserById = AsyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found ");
  }
});

//? @desc     Update user by Admin
//? @route    Put /api/users/:id
//? @access   Private/Admin

export const updateUserAdmin = AsyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.params.id);
  const { name, email } = req.body;

  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;
    user.isAdmin = req.body.isAdmin || user.isAdmin;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found ");
  }
});

//? @desc     Delete users
//? @route    Delete /api/users/:id
//? @access   Private/Admin

export const deleteUser = AsyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found ");
  }
});
