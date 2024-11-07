const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require('../utils/errorHandler');
const Payment = require("../models/paymentModel")
const Dispatch = require("../models/dispatchModel")
const User = require("../models/userModel")
const Enquiry = require("../models/enquiryModel")


//post address
// const postAddress = catchAsyncError(async (req, res, next) => {
//     const { userId } = req.params;
//     const addressData = req.body;
//     console.log("userid", userId);
//     console.log("address", addressData);

//     try {
//         const user = await User.findById(userId);
        
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         // If the new address is marked as default, update existing addresses to defaultAddress: false
//         if (addressData.defaultAddress) {
//             user.shippingInfo = user.shippingInfo.map((address) => ({
//                 ...address._doc,
//                 defaultAddress: false,
//             }));
//         }

//         // Add the new address to shippingInfo
//         user.shippingInfo.push(addressData);
//         await user.save();

//         res.status(201).json({ message: 'Address added successfully', address: addressData });
//     } 
//     catch (error) {
//         console.error("Error  add address:", error);
//         return next(new ErrorHandler(`Failed to add address. Try Again!`, 400));
//     }
// });
const postAddress = catchAsyncError(async (req, res, next) => {
    const { userId } = req.params;
    const addressData = req.body;

    try {
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // If this is the first address, set it as default automatically
        if (user.shippingInfo.length === 0) {
            addressData.defaultAddress = true;
        } else if (addressData.defaultAddress) {
            // If a new address is marked as default, update existing addresses to defaultAddress: false
            user.shippingInfo = user.shippingInfo.map((address) => ({
                ...address._doc,
                defaultAddress: false,
            }));
        }

        // Add the new address to shippingInfo
        user.shippingInfo.push(addressData);
        await user.save();

        res.status(201).json({ message: 'Address added successfully', address: addressData });
    } 
    catch (error) {
        console.error("Error adding address:", error);
        return next(new ErrorHandler(`Failed to add address. Try Again!`, 400));
    }
});

//getaddress
const getAddress = catchAsyncError(async (req, res, next) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return the shippingInfo array containing all addresses
        res.status(200).json({
            message: 'Addresses retrieved successfully',
            addresses: user.shippingInfo
        });
    } catch (error) {
        console.error("Error getting addresses:", error);
        return next(new ErrorHandler(`Failed to get addresses. Try Again!`, 400));
    }
});

// deleteAddress
// const deleteAddress = catchAsyncError(async (req, res, next) => {
//     const { userId, addressId } = req.params;

//  try{
//     const user = await User.findById(userId);
//     if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//     }

//     // Find the index of the address to delete
//     const addressIndex = user.shippingInfo.findIndex(address => address._id.toString() === addressId);
//     if (addressIndex === -1) {
//         return res.status(404).json({ error: 'Address not found' });
//     }

//     // Remove the address
//     user.shippingInfo.splice(addressIndex, 1);

//     await user.save();

//     res.status(200).json({ message: 'Address deleted successfully' });
//  }
//  catch (error) {
//     // console.error("Error getting addresses:", error);
//     return next(new ErrorHandler(`Failed to delete address. Try Again!`, 400));
// }

    
// });
const deleteAddress = catchAsyncError(async (req, res, next) => {
    const { userId, addressId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the index of the address to delete
        const addressIndex = user.shippingInfo.findIndex(address => address._id.toString() === addressId);
        if (addressIndex === -1) {
            return res.status(404).json({ error: 'Address not found' });
        }

        // Check if the address to be deleted is the default address
        const isDefaultAddress = user.shippingInfo[addressIndex].defaultAddress;

        // Remove the address
        user.shippingInfo.splice(addressIndex, 1);

        // If the deleted address was the default, set the first address as the default (if any address remains)
        if (isDefaultAddress && user.shippingInfo.length > 0) {
            user.shippingInfo[0].defaultAddress = true;
        }

        await user.save();

        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        return next(new ErrorHandler(`Failed to delete address. Try Again!`, 400));
    }
});



// Set Default Address
const setDefaultAddress = catchAsyncError(async (req, res, next) => {
    const { userId, addressId } = req.params;
    console.log()
try{
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Update all addresses to defaultAddress: false
    user.shippingInfo = user.shippingInfo.map((address) => ({
        ...address._doc,
        defaultAddress: address._id.toString() === addressId,
    }));

    await user.save();

    res.status(200).json({ message: 'Default address updated successfully' });
}
catch (error) {
    // console.error("Error getting addresses:", error);
    return next(new ErrorHandler(`Failed to set default addresses. Try Again!`, 400));
}
    
});

//update address

const updateAddress = catchAsyncError(async (req, res, next) => {
    const { userId, addressId } = req.params;
    const addressData = req.body;

    try {
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the address to update
        const addressIndex = user.shippingInfo.findIndex(address => address._id.toString() === addressId);
        
        if (addressIndex === -1) {
            return res.status(404).json({ error: 'Address not found' });
        }

        // Update the address
        user.shippingInfo[addressIndex] = {
            ...user.shippingInfo[addressIndex].toObject(), // Convert to plain object
            ...addressData // Merge new data
        };

        await user.save();

        res.status(200).json({ message: 'Address updated successfully', address: user.shippingInfo[addressIndex] });
    } 
    catch (error) {
        console.error("Error updating address:", error);
        return next(new ErrorHandler(`Failed to update address. Try Again!`, 400));
    }
});




module.exports = { postAddress,getAddress,deleteAddress ,setDefaultAddress,updateAddress};