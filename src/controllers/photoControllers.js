import PhotoModel from "../models/Photo.js";
import fs from "fs";
import { absolutePhotoUploadPath, baseAppPath } from "./constans.js";
import Photo from "../models/Photo.js";

export const getAllPhotoCards = async (req, res) => {
    const page = req.query?.page || 1;
    const photoPerPage = 2;

    const totalPhotos = await Photo.find().countDocuments();

    const photos = await Photo.find()
        .skip((page - 1) * photoPerPage)
        .limit(photoPerPage);

    res.render("index", {
        photos,
        current: page,
        pages: Math.ceil(totalPhotos / photoPerPage),
    });
};

export const getPhotoById = async (req, res) => {
    const photo = await PhotoModel.findById(req.params.id);
    res.render("photo", { photo });
};

export const createPhotoCard = async (req, res) => {
    if (!fs.existsSync(absolutePhotoUploadPath)) {
        fs.mkdirSync(absolutePhotoUploadPath);
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No Files were uploaded");
    }

    const uploadImage = req.files.image;

    const uploadImagePath = absolutePhotoUploadPath + uploadImage.name;

    await uploadImage.mv(uploadImagePath, (err) => {
        if (err) {
            return res.status(500).send(err);
        }
    });

    await PhotoModel.create({
        ...req.body,
        file: "/uploads/" + uploadImage.name,
    });
    res.redirect("/");
};

export const updatePhotoCard = async (req, res) => {
    const uploadImage = req.files.image;

    const uploadImagePath = absolutePhotoUploadPath + uploadImage.name;

    if (req.files?.image) {
        await uploadImage.mv(uploadImagePath, (err) => {
            if (err) {
                return res.status(500).send(err);
            }
        });
    }

    await PhotoModel.findByIdAndUpdate(
        { _id: req.params.id },
        {
            ...req.body,
            file: "/uploads/" + uploadImage.name,
        }
    );

    res.redirect("/");
};

export const deletePhotoCard = async (req, res) => {
    const photo = await PhotoModel.findOne({ _id: req.params.id });
    const photoPath = baseAppPath + "/public" + photo.file;

    fs.stat(photoPath, (err) => {
        if (err) {
            return console.log(err);
        }

        fs.unlinkSync(photoPath, (err) => {
            if (err) return console.log("unlink", err);
            console.log("File deleted successfully");
        });
    });

    await photo.deleteOne();
    res.redirect(`/`);
};
