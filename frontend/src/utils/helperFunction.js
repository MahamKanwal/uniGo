import axios from "axios";

export const apiRequest = (url = "", method = "GET", body = undefined) => ({
  url,
  method,
  body,
});

export const snakeCaseToTitle = (name) => {
  return name.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
};

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const { data } = await axios.post( `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,formData)
  
  return data.secure_url;
};


