import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';
const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  const { username, fullName, email, password } = req.body;
  console.log("Email :", email);
  //validation - not empty
  if (
    [username, fullName, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  //check if user already exist:username,email;
  const existedUser = User.findOne({
    $or : [{username},{email}]
  })
  if(existedUser){
    throw new ApiError(409,"User with this email and username already exist")
  }
  //check for images ,check for avatar,
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path

  if(!avatarLocalPath){
    throw new ApiError(400,"Avatar File is required")
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)
  if(!avatar){
    throw new ApiError(400,"Avatar file is required db")
  }
  //create user object - create entry in db

  const user = await User.create({
    fullName,
    avatar : avatar.url,
    coverImage : coverImage?.url || "",
    username : username.toLowercase(),
    password
  })
  //remove password and refresh token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )
  //check for user creation
  if(!createdUser){
    throw new ApiError(500,"something went wrong while registering user to db")
  }
  //return res
  return res.status(201).json(
    new ApiResponse(200,createdUser,"User registered scuccessfully")
  )
});

export { registerUser };
