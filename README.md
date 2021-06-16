# onNotesApis

# What is is?
Implemetation of microsoft Oauth 2.0 code base Authorization, and APIs to read and create Notebooks, Sections, Pages on One Note. I wanted to implement this to migrate all my notes from Google Keep to Microsoft One Notes.

# How its done?
1. Well firstly, I needed to register my application on Azure Portal, with providing enough scopes and permissions that I am gonna be using to read and write data to Microsoft's One drive(One Notes here), and get a CLient_Id, Client_secret in return, that I will be using To make my Apli calls.
2. Then, I need to implement OAuth Code autherization API from my node.js app, That was just funtions written in Javascript. 
3. Then, I Visited the One note REST API Documentation to understand APIs and implement them, Only Their I get to knwo about what permissions I will be needing to Call the Microsoft server.
4. Athentication itself is a 3  way process, You Create a URL, thats to be hit in order to get the user's consent to use his Database to provide him services.
5. That carries out By Agreeing on the consent screen, Then, I get the 'code', in form of query param, in the redirect URl, I provide in first step.
6. Then, Using that code, I hit the server asking them to give me token, Here I used code to hit the server so my Tyoe of grant is Authorization_code, It returns me with access_token, refresh_token, Expiry time.
7. Refresh_token can be used to get get the new token, It also expires. Now when you ask for access_token by using refresh_token, the type of grant changes to refresh_token.
8. Using this Access_token you can call your APIs, 
9. Everything would have gone smoothly, if I had just done everything as written above, but sometimes I register my app wrongly to be organisation based, Hopefully I was able to make API call, but just to another database not mine, Then I registered for personal Account ( Here the databse is sed is of the authenticated user only). Then sometimes I messed with Scopes, Always give right scopes and permission, check for them In official documentation. Other then that the data migrated effrtlesssly, at the end when my notes were being pussed to microsoft's one note database I listened to Bach.

# Tech Involved
1. Node.js
2. Fs-extra.js
3. axios
4. Microsoft Azure *(new)*
5. OneNotes APIs *(new)*
6. Postmen
7. Google Chrome
8. Vs Code