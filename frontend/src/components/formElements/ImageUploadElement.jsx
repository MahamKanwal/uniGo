import React, { useEffect, useState } from "react";
import {
  snakeCaseToTitle,
  uploadToCloudinary,
} from "../../utils/helperFunction";

const ImageUploadElement = ({ name, value, label, handleChange, error }) => {
  const [preview, setPreview] = useState(value || "");
  const [loading, setLoading] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, JPEG, PNG, and WEBP images are allowed.");
      return;
    }
    setPreview(URL.createObjectURL(file));
    try {
      const uploadedUrl = await uploadToCloudinary(file);
      handleChange({
        target: { name, value: uploadedUrl },
      });
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Image uploading error");
      setLoading(false);
    }
  };

  const fieldName = label || snakeCaseToTitle(name);

  useEffect(() => {
    if (value) {
      setPreview(value);
    }
  }, [value]);

  return (
    <div className="space-y-1">
      <label className="font-medium">{fieldName}</label>
      <input
        type="file"
        accept="image/"
        onChange={handleImageChange}
        className="block w-full border p-2 rounded-md"
      />
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-24 h-24 object-cover rounded-md border"
        />
      )}
      {loading && <p className="text-blue-500 text-sm">Uploading...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default ImageUploadElement;

