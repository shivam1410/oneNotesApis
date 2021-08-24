
<img src="https://img.icons8.com/color/452/microsoft-onenote-2019.png" width="300">

# onNotesApis

# What is it?
Implemetation of microsoft Oauth 2.0 code based Authorization, and APIs to read and create Notebooks, Sections, Pages on One Note. I wanted to implement this to migrate all my notes from Google Keep to Microsoft One Notes.

# How its done?
1. Well firstly, I needed to register my application on Azure Portal, with providing enough scopes and permissions that I am gonna be using to read and write data to Microsoft's One drive(One Notes here), and get a CLient_Id, Client_secret in return, that I will be using To make my API calls.
2. Then, I needed to implement OAuth Code autherization API from my node.js app, That was just funtions written in Javascript. 
3. Then, I Visited the One note REST API Documentation to understand APIs and implement them, Only there I get to know about what permissions I will be needing to call the Microsoft server.
4. Athentication itself is a 3  way process, You Create a URL, that's to be hit in order to get the user's consent to use his Database to provide him services.
5. That carries out By Agreeing on the consent screen, Then, I get the 'code', in form of query param, in the redirected URl, that I provided in first step, while regisering app on Azure.
6. Then, Using that code, I hit the server asking them to give me token, Here I used code to hit the server so Type of grant is "Authorization_code", It returns me with "access_token", "refresh_token", "Expiry time".
7. Refresh_token can be used to get get the new token, It also expires. Now when you ask for "access_token" by using "refresh_token", the type of grant changes to "refresh_token".
8. Using this Access_token you can call your APIs, 
9. Everything would have gone smoothly, if I had just done everything as written above, but initially I registered my app wrongly to be organisation based, Hopefully I was able to make API call, but just to another database not mine, Then I registered for personal Account ( Here the databse is of the authenticated user only). Then once I messed up with Scopes, Always give right scopes and permission, check for them In official documentation. Other then that the data migrated effortlesssly, at the end when my notes were being pussed to microsoft's one note database as I listened to Bach.

# Tech Involved
1. Node.js
2. Fs-extra.js
3. axios
4. Microsoft Azure *(to register the app)*
5. OneNotes APIs *(well!!)*
6. Postman
7. Google Chrome
8. Vs Code

# USE cases
1. Test api
``` GET /api```

2. Auth APIs
```
# to get the consent screen
GET /auth/consent

# It will be called automatically (as microsoft send the response. ref Medium arcticle)
GET /auth/code

# *(there's no need for this)
GET /refreshtoken
```

3. Check if you're connected
```
// Basics
# See if you're authenticated
GET /Me
```

4. Get all notebooks
```
# To get all your notebooks
GET /notebooks
```

5. Get all Sections
```
# To get all your sections, in a notebook ( provide notebookID)
// ?notebookId=""
GET /sections,
```

6. Get all Pages
```
# To get all your pages, in a section ( provide sectionID)
// ?sectionId=""
GET /pages,
```

7. Create A Notebook
```
# To create a notebook,(provide name in query)
// ?name=""
POST /createNotebook,
```

8. Create sections
```
# To create sections ,(provide notebookID and array of section names in query)
// ?notebookId=""&sections=[] 
POST /createsections
```

9. Create pages
```
# To post pages to all section, but you must have pages, ( I have download my google archive keep notes, and used the function sortFileIntoFolder.js and</br>
then post all the notes/pages section-wise(folder-wise))
// ?[{sectionId="",sectionName=""}]
POST /postPagesToAllSections

// a function to post all notes of all sections 
// to post google archive keep notes to one notes
```
