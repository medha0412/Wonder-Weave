import getImages from '../utils/getImages.js';
export const getDestinationImg = async(req,res)=>{
    const {destination}=req.query;
    if(!destination){
        return res.status(400).json({message:"destination is required"});
    }
    const imageUrl = await getImages(destination);
     if(imageUrl){
        res.json({imageUrl})
     }else{
        res.status(400).json({error:"image not found"})
     }
};
