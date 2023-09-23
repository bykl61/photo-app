import mongoose, { Schema } from "mongoose";

const PhotoSchema = new Schema({
    title: String,
    description: String,
    file: String,
    createdDate: {
        type: Date,
        default: Date.now(),
    },
});

const PhotoModel = mongoose.model("photos", PhotoSchema);

export default PhotoModel;
