import express from "express";
import ejs from "ejs";
import mongoose from "mongoose";
import fileUpload from "express-fileupload";
import methodOverride from "method-override";
import "dotenv/config";

import {
    createPhotoCard,
    deletePhotoCard,
    getAllPhotoCards,
    getPhotoById,
    updatePhotoCard,
} from "./controllers/photoControllers.js";
import {
    getAboutPage,
    getAddPage,
    getEditPage,
} from "./controllers/pageControllers.js";

const app = express();
const port = 4000;

app.set("view engine", "ejs");


mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Succefuly Connect Db"))
    .catch((e) => console.log(e));

app.use(express.static("public"));
app.use(express.static('dist'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload(undefined));
app.use(
    methodOverride("_method", {
        methods: ["POST", "GET"],
    })
);
app.get("/", await getAllPhotoCards);

app.get("/photos/:id", await getPhotoById);

app.get("/photos/edit/:id", await getEditPage);

app.put("/photos/edit/:id", await updatePhotoCard);

app.delete("/photos/:id", await deletePhotoCard);

app.get("/about", await getAboutPage);

app.get("/add", await getAddPage);

app.post("/photos", await createPhotoCard);

app.listen(process.env.PORT || 4000, () =>
    console.log("Service stars on 4000")
);
