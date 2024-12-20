
const bcrypt = require('bcrypt');
const { generateToken, sendToken } = require('../middleware/authmiddleware');
const User = require('../models/userModel');
const catchAsyncError = require('../middleware/catchAsyncError');
const ErrorHandler = require('../utils/errorHandler');
const sendEmail = require("../utils/email");
const crypto = require('crypto');
const nodemailer = require('nodemailer')
const validator = require("validator");
const s3 = require('../config/awsConfig');
const { S3Client ,DeleteObjectCommand} = require('@aws-sdk/client-s3');



//register user

const userRegister = catchAsyncError(async (req, res, next) => {
  const { name, email, password, mobile } = req.body;
  // console.log(req.body)

  let avatar;

  let BASE_URL = process.env.BACKEND_URL;
  if (process.env.NODE_ENV === "production") {
    BASE_URL = `${req.protocol}://${req.get('host')}`
  }


  if (req.file) {
    const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
    
    if (fileExtension !== 'jpg' && fileExtension !== 'png' && fileExtension !== 'jpeg') {
      return next(new ErrorHandler('Only .jpg,.jpeg and .png files are allowed'));
    }
    avatar = `${BASE_URL}/uploads/user/${req.file.filename}`;
    // avatar = req.file.location; // This will be the S3 URL of the uploaded file
  }
  else {
    avatar = `${BASE_URL}/uploads/user/default_avatar.jpg`; // Default avatar if no file uploaded
  }
  
  // if (req.file) {
  //   const fileExtension = path.extname(req.file.originalname).toLowerCase();
  //   if (fileExtension !== '.jpg' && fileExtension !== '.png' && fileExtension !== '.jpeg') {
  //     return next(new ErrorHandler('Only .jpg,.jpeg and .png files are allowed', 400));
  //   }
  //   avatar = `${BASE_URL}/uploads/user/${req.file.filename}`; // Correct file path with filename
  // } else {
  //   avatar = `${BASE_URL}/uploads/user/default_avatar.jpg`; // Default avatar if no file uploaded
  // }

  // Name validation
  if ( !name) {
    return next(new ErrorHandler('Please enter Name', 400));
  }
  if ( name.trim().length < 2) {
    return next(new ErrorHandler('Name must be at least 2 characters long', 400));
  }

  // Email validation
  if (!email || !validator.isEmail(email)) {
    return next(new ErrorHandler('Please enter a valid email', 400));
  }

  // Password validation
  // if (!password || password.length < 6) {
  //   return next(new ErrorHandler('Password must be at least 6 characters long', 400));
  // }
  try {
    let user = await User.findOne({ email }).select('+password');
    if (user) {
      return next(new ErrorHandler('Email already exists', 400));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const regUser = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
      avatar
    });

    console.log("regUser",regUser)

    await regUser.save();
    return sendToken(regUser, 201, res);
  } catch (error) {
    console.log("error",error)
    return next(new ErrorHandler(error.message, 500));

  }
});

// Register user
// const userRegister =catchAsyncError( async (req, res, next) => {
//   try {
//     const { name, email, password } = req.body;

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: 'User already exists' });
//     }

//     // Create user
//     const newUser = await User.create({
//       name,
//       email,
//       password,
//       avatar: req.body.avatar || 'default_avatar.png',
//     });

//     res.status(201).json({
//       success: true,
//       user: newUser
//     });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// });



//login user

const userLogin = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  
  // console.log(email, password )
  res.clearCookie('token', { path: '/' });

    // Email validation
    if (!email || !validator.isEmail(email)) {
      return next(new ErrorHandler('Please enter a valid email', 400));
    }
  
    // Password validation
    if (!password || password.length < 6) {
      return next(new ErrorHandler('Please enter a valid password', 400));
    }
  try{
    let user = await User.findOne({ email }).select('+password');
    // console.log(user)
    if (!user) {
      return next(new ErrorHandler('Invalid credentials', 401));
    }
    // console.log(password, user.password)
  
    const isMatch = await bcrypt.compare(password, user.password);
  
    if (!isMatch) {
      return next(new ErrorHandler('Invalid credentials', 401));
    }
  
    // const token = generateToken(user);
  
    // res.status(201).json({ success:true, user, token});
  
    return sendToken(user, 201, res)

  }catch(error){
    console.log("error",error)
    return next(new ErrorHandler(error.message, 500));
  }
 

});


//logout user

// const logoutUser = (req, res, next) => {
//   return res.cookie('token', null, {
//     expires: new Date(Date.now()),
//     httpOnly: true
//   })
//     .status(200)
//     .json({
//       success: true,
//       message: "user LoggedOut"
//     })
// }
const logoutUser = (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache'); // For backward compatibility with HTTP/1.0
  res.setHeader('Expires', '0'); // Expire immediately
  res.cookie('token', '', {
    expires: new Date(0), // Set expiry to a past date to immediately clear the cookie
    httpOnly: true,
    path: '/' // Ensure that the cookie is cleared from all paths
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });

};

//Requesting Password Reset

const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log(email)
    const user = await User.findOne({ email });
    console.log(user)
    if (!user) {
      return next(new ErrorHandler('user not found with is email'));
    }

    // Generate a reset token
    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordTokenExpire = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    // Send email with reset link including the token


    let BASE_URL = process.env.FRONTEND_URL;

    if (process.env.NODE_ENV === "production") {
      BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    const resetUrl = `${BASE_URL}/password/reset/${user.resetPasswordToken}`
    const message = `Your password reset url is as follows \n\n ${resetUrl} \n\n If you have not request this email, then ignore it.`
    console.log("message", message)
    // Code to send email goes here
    // sendEmail({
    //   email: user.email,
    //   subject: "password Recovery",
    //   message

    // })

    // Send link via email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SEND_MAIL, // Your Gmail email address
        pass: process.env.MAIL_PASS // Your Gmail password
      }
    });
    // Configure mail options
    const mailOptions = {
      from: process.env.SEND_MAIL,
      to: user.email,
      subject: 'Password Recovery',
      text: message // Use 'text' instead of 'message'
    };
    console.log("mailOptions", mailOptions)

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error); // Log the error for debugging
        return next(new ErrorHandler("Failed to send mail", 500))
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).json({ success: true, message: `email send to ${user.email}` });
      }
    });


    // res.status(200).json({ success: true, message: `email send to ${user.email}` });
  } catch (error) {
    next(error);
  }
};

//Resetting Password

const resetPassword = catchAsyncError(async (req, res, next) => {

  const { password } = req.body;
  const { token } = req.params;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordTokenExpire: { $gt: Date.now() }
  });
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler('Password does not match'))
  }

  if (!user) {
    return next(new ErrorHandler('Password reset token is invalid or expired'))
  }

 
  // Update user's password
  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpire = undefined;
  await user.save();

  sendToken(user, 201, res)

})

//Change Password  - api/v1/password/change
const changePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check old password
  const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);
  if (!isMatch) {
    return next(new ErrorHandler('Old password is incorrect', 401));
  }

  // Hashing the new password before saving it
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);
  await user.save();

  return res.status(200).json({
    success: true,
  });
});

// get user profile

const getUserProfile = catchAsyncError(async (req, res, next) => {
  // console.log(req)
  const user = await User.findById(req.user._id)
  // console.log(user)
  if (user) {
    return res.status(200).json({
      success: true,
      user
    })
  }

})



//update user profile

// const updateUserProfile = catchAsyncError(async (req, res, next) => {
//   let newUserData = {
//     name: req.body.name,
//     // email: req.body.email,
//     // mobile: req.body.mobile,
//   };

//   let avatar;

//   const user = await User.findById(req.user._id);

//   if (!user) {
//     return next(new ErrorHandler('User not found', 404));
//   }

//   if (req.file) {
//     // Same logic for handling file upload
//     avatar = req.file.location;
//     if (user.avatar && user.avatar !== 'default_avatar.png') {
//       await deleteOldAvatarFromS3(user.avatar);
//     }
//   } else if (req.body.avatar === 'null') {
//     // Remove previous avatar from S3 if user removes it
//     if (user.avatar && user.avatar !== 'default_avatar.png') {
//       await deleteOldAvatarFromS3(user.avatar);
//     }
//     avatar = 'default_avatar.png'; // Set to default avatar
//   }

//   // Add the new avatar to the update data
//   if (avatar) {
//     newUserData.avatar = avatar;
//   }

//   const updatedUser = await User.findByIdAndUpdate(req.user._id, {
//     $set: newUserData
//   }, { new: true, runValidators: true }).select('-password');

//   if (!updatedUser) {
//     return next(new ErrorHandler('Error updating user profile', 500));
//   }

//   return res.status(200).json({
//     success: true,
//     user: updatedUser,
//   });
// });

// // Helper function to delete old avatar from S3
// const deleteOldAvatarFromS3 = async (avatarUrl) => {
//   const key = avatarUrl.split('https://')[1].split('/').slice(1).join('/');
//   const params = {
//     Bucket: process.env.S3_BUCKET_NAME,
//     Key: key,
//   };
//   const command = new DeleteObjectCommand(params);
//   try {
//     const result = await s3.send(command);
//     console.log('Successfully deleted old image from S3:', result);
//   } catch (error) {
//     console.log('Error deleting old image from S3:', error);
//   }
// };


// Helper function to delete old avatar from S3
const deleteOldAvatarFromS3 = async (avatarUrl) => {
  if (!avatarUrl || typeof avatarUrl !== 'string') {
    console.log('Invalid avatar URL provided, skipping deletion.');
    return;
  }

  try {
    // Validate and parse the URL
    const key = avatarUrl.split('https://')[1]?.split('/')?.slice(1)?.join('/');
    if (!key) {
      console.log('Unable to extract key from avatar URL, skipping deletion.');
      return;
    }

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    };
    const command = new DeleteObjectCommand(params);

    const result = await s3.send(command);
    console.log('Successfully deleted old image from S3:', result);
  } catch (error) {
    console.log('Error deleting old image from S3:', error);
  }
};

// Main function
const updateUserProfile = catchAsyncError(async (req, res, next) => {
  let newUserData = {
    name: req.body.name,
    // email: req.body.email,
    // mobile: req.body.mobile,
  };

  let avatar;

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  if (req.file) {
    // Handling file upload
    avatar = req.file.location;
    if (user.avatar && user.avatar !== 'default_avatar.png') {
      await deleteOldAvatarFromS3(user.avatar);
    }
  } else if (req.body.avatar === 'null') {
    // Remove previous avatar from S3 if user removes it
    if (user.avatar && user.avatar !== 'default_avatar.png') {
      await deleteOldAvatarFromS3(user.avatar);
    }
    avatar = 'default_avatar.png'; // Set to default avatar
  }

  // Add the new avatar to the update data
  if (avatar) {
    newUserData.avatar = avatar;
  }

  const updatedUser = await User.findByIdAndUpdate(req.user._id, {
    $set: newUserData,
  }, { new: true, runValidators: true }).select('-password');

  if (!updatedUser) {
    return next(new ErrorHandler('Error updating user profile', 500));
  }

  return res.status(200).json({
    success: true,
    user: updatedUser,
  });
});


// const updateUserProfile = catchAsyncError(async (req, res, next) => {
//   let newUserData = {
//     name: req.body.name,
//     email: req.body.email,
//     mobile: req.body.mobile,
//   };

//   let avatar;

//   // Find the existing user
//   const user = await User.findById(req.user._id);

//   if (!user) {
//     return next(new ErrorHandler('User not found', 404));
//   }

//   if (req.file) {
//     // Validate the file type
//     const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
//     if (fileExtension !== 'jpg' && fileExtension !== 'jpeg' && fileExtension !== 'png') {
//       return next(new ErrorHandler('Only .jpg, .jpeg, and .png files are allowed', 400));
//     }

//     // Set the new avatar URL
//     avatar = req.file.location; // Get the S3 URL of the new image

//     // Delete the previous avatar from S3
//     if (user && user.avatar && user.avatar !== 'default_avatar.png') {
//       const key = user.avatar.split('https://')[1].split('/').slice(1).join('/'); // Adjust the extraction based on the URL format
//       console.log('Deleting image from S3 with key:', key);
    
//       const params = {
//         Bucket: process.env.S3_BUCKET_NAME,
//         Key: key,
//       };
    
//       const command = new DeleteObjectCommand(params);
    
//       try {
//         const result = await s3.send(command);
//         console.log('Successfully deleted old image from S3:', result);
//       } catch (error) {
//         console.log('Error deleting old image from S3:', error);
//       }
//     }

//     // Add the new avatar to newUserData
//     newUserData = { ...newUserData, avatar };
//   }

//   // Update the user profile
//   const updatedUser = await User.findByIdAndUpdate(
//     req.user._id,
//     { $set: newUserData },
//     { new: true, runValidators: true }
//   ).select('-password');

//   // If the user was not found or the update failed
//   if (!updatedUser) {
//     return next(new ErrorHandler('Error updating user profile', 500));
//   }

//   return res.status(200).json({
//     success: true,
//     user: updatedUser,
//   });
// });

//Admin: Get All Users - /api/v1/admin/users
const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();
  return res.status(200).json({
    success: true,
    users
  })
})

//Admin: Get Specific User - api/v1/admin/user/:id
const getUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler(`User not found with this id ${req.params.id}`))
  }
  return res.status(200).json({
    success: true,
    user
  })
});

//Admin: Update User - api/v1/admin/user/:id
const updateUser = catchAsyncError(async (req, res, next) => {
  console.log("userdata",req.body)
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  }
try{
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
  })
  // console.log(user)
  return res.status(200).json({
    success: true,
    user
  })
}catch(error){
  console.log(error )
}
 

 
})

//Admin: Delete User - api/v1/admin/user/:id
const deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler(`User not found with this id ${req.params.id}`));
  }

  if (user && user.avatar && user.avatar !== 'default_avatar.jpg') {
    const key = user.avatar.split('https://')[1].split('/').slice(1).join('/'); 
    console.log('Deleting image from S3 with key:', key);
  
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    };
  
    const command = new DeleteObjectCommand(params);
  
    try {
      const result = await s3.send(command);
      console.log('Successfully deleted old image from S3:', result);
    } catch (error) {
      console.log('Error deleting old image from S3:', error);
    }
  }

  await User.deleteOne({ _id: req.params.id });
  return res.status(200).json({
    success: true,
  });
});





module.exports = { userRegister, userLogin, logoutUser, requestPasswordReset, resetPassword, getUserProfile, updateUserProfile, changePassword, getAllUsers, getUser, updateUser, deleteUser };
