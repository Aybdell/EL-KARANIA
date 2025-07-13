import { findMedicalRecord } from "../models/medicalRecordsModel.js";
import { createImagingRecord, getImagingRecord } from "../models/imagingModel.js";
import upload from '../upload.js';

export const createImaging = async (req, res) => {
  try {
    // Use multer to handle the file upload
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: 'File upload error' });
      }

      const { record_id, imageType, image_description } = req.body;
      const imageFile = req.file; // The uploaded file details from multer

      if (!imageFile) {
        return res.status(400).json({ message: 'No image file uploaded' });
      }

      // The path to the saved image, relative to the public folder
      const img_url = `/images/${imageFile.filename}`;

      // Check if the medical record exists (assuming this function exists in your model)
      const record = await findMedicalRecord(record_id);
      if (!record) {
        return res.status(404).json({ message: 'Medical record not found' });
      }

      // Create the imaging record with the image path (assuming this function exists)
      const image = await createImagingRecord(record_id, imageType, img_url, image_description);
      return res.status(201).json({ message: 'Imaging record created successfully', image });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getImaging = async (req, res) => {
    const {record_id} = req.body;
    try{
        const record = await findMedicalRecord(record_id);
        if(!record) {
            return res.status(404).json({message: "Medical record not found"});
        }
        const image = await getImagingRecord(record_id);
        if(!image) {
            return res.status(404).json({message: "No imaging records found"});
        }
        return res.status(200).json({message: "Imaging records found", image});
    }catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    }
}