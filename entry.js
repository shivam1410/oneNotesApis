const express = require("express");
const oneNoteAuth = require("./services/oneNoteAuth"); 
const oneNoteFunction = require("./services/oneNoteFunctions");

const app = express();

app.get('/api', (req,res)=>{
    res.json("connection working!!!")
    console.log("api test change 1: to test for layering")
})

app.get('/auth/consent', oneNoteAuth.giveConsent)
app.get('/auth/code', oneNoteAuth.getAccessTokenByUsingCode);
app.get('/refreshtoken', oneNoteAuth.getAccessTokenByRefreshToken);

// Basics
app.get('/Me', oneNoteFunction.getUserDetails)
app.get('/notebooks', oneNoteAuth.authenticate, oneNoteFunction.getAllNotebooks)

// ?notebookId=
app.get('/sections', oneNoteAuth.authenticate, oneNoteFunction.getAllsectionsInNotebook);

// ?sectionId
app.get('/pages', oneNoteAuth.authenticate, oneNoteFunction.getAllPagesInASection)

// ?name
app.post('/createNotebook', oneNoteAuth.authenticate, oneNoteFunction.createOneNoteNotebook);

// ?notebookId & sections = comma seprated vales
app.post('/createsections', oneNoteAuth.authenticate, oneNoteFunction.createSections);

// ?[{sectionId,sectionName}]
app.post('/postPagesToAllSections', oneNoteAuth.authenticate, oneNoteFunction.postPagesToAllSections);

app.listen(8000, ()=>{
    console.log("server created!!!")
})
