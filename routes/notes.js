const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const util = require('util');

// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);
const writeToFile = util.promisify(fs.writeFile);
const getNotes = () => {
  return readFromFile("db/db.json", "utf-8").then(rawnotes=>[].concat(JSON.parse(rawnotes)))
}
// // GET Route for retrieving all the notes
router.get('/', (req, res) =>
  getNotes().then(notes=> res.json(notes))
);

// // POST Route for submitting notes
router.post('/', (req, res) => {
  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

//   // If all the required properties are present

    // Variable for the object we will save
    const newNotes = {
     title,
     text,
      id: uuidv4(),
    };
getNotes().then(oldNotes => [...oldNotes, newNotes]).then(finalNotes => {
  writeToFile("db/db.json", JSON.stringify(finalNotes)).then(()=> {
    const response = {
      status: 'success',
      message: "ok",
    };
    res.json(response);
  })
})
    // readAndAppend(newNotes, './db/db.json');

   

    
});
router.delete("/:id", (req, res) => {
getNotes().then(oldNotes=>oldNotes.filter(note => note.id !== req.params.id)).then(deletedArray => {
  writeToFile("db/db.json", JSON.stringify(deletedArray)).then(()=> {
    const response = {
      status: 'success',
      message: "ok",
    };
    res.json(response);
  })
})
})
module.exports = router;