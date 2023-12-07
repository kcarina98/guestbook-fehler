import fs from "fs/promises";
import fsystem from "fs";
import { v4 } from "uuid";
import { log } from "console";
const DB = "storage";

export function setup() {
  fs.access("./" + DB + "/")
    .then(() => console.log("Storage Ordner ist schon vorhanden"))
    .catch(() => {
      fs.mkdir("./" + DB);
    });
}

// Als Parameter übergeben wir ein Object welches die properties enthält
export function saveItem(item) {
  console.log("Daten =======>", item);
  item.id = v4();
  fs.writeFile("./" + DB + "/" + item.id, JSON.stringify(item));
}

// Lese alle Dateien im Ordner storage ein und gebe uns diese als array mit objekten zurück
export function getAll() {
  return fs.readdir("./" + DB).then((files) => {
    const arr = [];
    for (const file of files) {
      arr.push(JSON.parse(fsystem.readFileSync("./" + DB + "/" + file)));
    }
    return arr;
  });
}

// wir holen uns die daten von genau einem character
export function getItem(id) {
  return fs
    .readFile("./" + DB + "/" + id)
    .then((data) => JSON.parse(data.toString()));
}
// wir löschen eine datei anhand der id die ja auch gleichzeitig der dateiname ist
export function deleteItem(id) {
  return (
    // getItem(id)
    //   .then((item) => fs.rm(item.imglink))
    //   .then(() =>
    fs.rm("./" + DB + "/" + id)
  );
}

export function editItem(item) {
  return getItem(item.id)
    .then((dbItem) => (dbItem = { ...dbItem, ...item }))
    .then((newItem) =>
      fs.writeFile("./" + DB + "/" + newItem.id, JSON.stringify(newItem))
    );
}
