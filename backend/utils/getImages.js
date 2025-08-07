import axios from "axios";
const getImages =async(destination)=>{
try{
    const response= await axios.get("https://api.pexels.com/v1/search",{
        headers:{
            Authorization:process.env.PEXELS_API_KEY
            
        },params:{
            query:destination,
            per_page:1,
        }
    })
    const photos =response.data.photos;
    if(photos.length>0){
        return photos[0].src.large;
    }else{
        return null;
    }
}catch(error){
console.error("Error in finding image: ", error.message);
return null;
}
}
export default getImages;