import express from "express";
import cors from "cors";
import Joi from "joi";
import multer from "multer";
import { fileTypeFromBuffer } from "file-type";
import {
  deleteItem,
  getAll,
  saveItem,
  setup,
  editItem,
} from "./filestorage.js";

const PORT = 9898;
const app = express();
// const upload = multer({ dest: "./uploads/" }); // erstellt den Ordner "uploads", wenn es den noch nicht gibt
// const storage = multer({ dest: "./uploads/" });
const storage = multer.memoryStorage();
const DIR = "./uploads/";
const upload = multer({ storage });

setup();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/api/guestbook", (req, res) => {
  getAll()
    .then((data) => res.json(data))
    .catch(() => res.status(500).end());
});

// # Validierung mit JOI
const itemSchema = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  mail: Joi.string().required(),
  text: Joi.string().required(),
  imglink: Joi.binary(),
});

app.post("/api/guestbook", upload.single("imglink"), (req, res) => {
  //upload.none(), wenn keine Dateien dabei sind //* upload.single(), wenn wir eine Datei mit hochladen wollen (console.log(file))
  //- upload.array(), wenn wir mehrere Dateien in ein Input hochladen wollen (console.log(req.files))
  //? upload.fields(), wenn wir mehrere Dateien in verschiedene Inputfelder hochladen wollen

  let item = req.body;
  console.log("Hallooooo: ", req.file);

  item.imglink = req.file.path;

  const { error, value } = itemSchema.validate(item);
  if (error) {
    console.log(error.message);
    res.status(418).json({ message: error.message });
    return;
  }

  item = value;

  fileTypeFromBuffer(req.file.buffer)
    .then((data) => {
      const path = DIR + v4() + "." + data.ext;
      fs.writeFile(path, req.file.buffer);
      return path;
    })
    .then((data) => {
      item.imglink = data;
      console.log("Item", item);
      saveItem(item);
      res.end();
    })
    .catch((err) => res.status(500).end(err));

  // saveItem(item);
  // res.end();
});

app.delete("/api/guestbook", (req, res) => {
  const id = req.body.id;
  console.log("ID: ", id);
  deleteItem(id)
    .then(() => res.end())
    .catch((err) => res.status(500).end(err));
});

app.put("/api/guestbook", upload.none(), (req, res) => {
  console.log(req.body);
  editItem(req.body)
    .then(() => res.end())
    .catch((err) => {
      console.log(err);
      res.status(500).end("message");
    });
});

app.listen(PORT, () => console.log(PORT, "läuft"));
