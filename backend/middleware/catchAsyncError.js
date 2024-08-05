module.exports = func => (req,res,next)=>{
   console.log("testing enquiry",res)
   return Promise.resolve(func(req,res,next)).catch(next)

}