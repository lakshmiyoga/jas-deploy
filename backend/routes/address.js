const express =require('express');
const { isAuthenticateUser, authorizeRoles } = require('../middleware/authmiddleware');
const {postAddress, getAddress, deleteAddress,setDefaultAddress, updateAddress} = require("../controllers/addressController");
const router = express.Router();



router.post('/user/:userId/address',isAuthenticateUser, postAddress);
router.get('/user/:userId/address',isAuthenticateUser, getAddress);
router.delete('/user/:userId/address/:addressId', isAuthenticateUser, deleteAddress);
router.put('/user/:userId/address/:addressId/default', isAuthenticateUser, setDefaultAddress);
router.put('/user/:userId/address/:addressId', isAuthenticateUser, updateAddress);







module.exports=router;