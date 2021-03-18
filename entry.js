const express = require("express");
const oneNoteAuth = require("./services/oneNoteAuth"); 
const oneNoteFunction = require("./services/oneNoteFunctions");
const oneNotesAuth = require("./services/oneNoteAuth");

const app = express();

app.get('/api', (req,res)=>{
    res.json("connection working!!!")
})
app.get('/auth/consent', oneNoteAuth.giveConsent)
app.get('/auth/code', oneNoteAuth.getAccessTokenByUsingCode);

app.get('/Me', oneNoteFunction.getUserDetails)
app.get('/notebooks', oneNotesAuth.authenticate, oneNoteFunction.getAllNotebooks)
// ?notebookId
app.get('/sections', oneNotesAuth.authenticate, oneNoteFunction.getAllsectionsInNotebook);
// ?sectionId
app.get('/pages', oneNotesAuth.authenticate, oneNoteFunction.getAllPagesInASection)
// ?name
app.get('/createNotebook', oneNotesAuth.authenticate, oneNoteFunction.createOneNoteNotebook);
// ?notebookId & sections = comma seprated vales
app.get('/createsections', oneNotesAuth.authenticate, oneNoteFunction.createSections);
// ?[{sectionId,sectionName}]
app.get('/postPagesToAllSections', oneNotesAuth.authenticate, oneNoteFunction.postPagesToAllSections);

app.listen(8000, ()=>{
    console.log("server created!!!")
})