var FormData = require('form-data');
const config = require("../config/ms.config");
const axios = require("axios");
const fse = require("fs-extra");
const url = require('url');

async function getUserDetails(req,res){
    const token = await returnToken();
    const url = config.graph_url + `me`;
    const headers = {
        "Content-type": "application/json",
        "Authorization": "Bearer "+ token,
        "accept": "application/json",
        "ConsistencyLevel": "eventual"
    }

    axios({
        method: 'get',
        url,
        headers
    })
    .then(d=>{
        console.log(d.data)
        return res.json(d.data)
    })
    .catch(e=>{
        console.error(e.response.data)
        if(e.response.data.error.message){
            res.json({error: e.response.data.error.message})
        }
    })

}

async function getAllNotebooks(req,res){
    const token = await returnToken();
    const url = config.base_URL + "/notebooks";
    const headers = {
        "Authorization": "Bearer "+ token,
        "accept": "application/json"
    }

    axios({
        method: 'get',
        url,
        headers
    })
    .then(d=>{
        return res.json(d.data.value.map(a=>({
            id: a.id, 
            title: a.displayName
        })))
    })
    .catch(e=>{
        console.error(e.response.data)
        if(e.response.data.error.message){
            res.json({error: e.response.data.error.message})
        }
    })
}

async function getAllsectionsInNotebook(req,res){
    const token = await returnToken();
    const url = config.base_URL + "/notebooks/" + req.query.notebookId + "/sections/";
    const headers= {
        "Authorization": "Bearer "+ token,
        "accept": "application/json"
    }

    axios({
        method: 'get',
        url,
        headers
    })
    .then(d=>{
        return res.json(d.data.value.map(a=>({
            id: a.id, 
            title: a.displayName, 
            notebook: a.parentNotebook.displayName
        })))
    })
    .catch(e=>{
        console.error(e.response.data)
        if(e.response.data.error.message){
            res.json({error: e.response.data.error.message})
        }
    })
}

async function getAllPagesInASection(req,res){
    const token = await returnToken();
    const url = config.base_URL + "/sections/" + req.query.sectionId + "/pages/"
    const headers= {
        "Authorization": "Bearer "+ token,
        "accept": "application/json"
    }

    axios({
        method: 'get',
        url,
        headers
    })
    .then(d=>{
        return res.json(d.data.value.map(a=>({
            id: a.id, 
            title: a.title, 
            section: a.parentSection.displayName
        })))
    })
    .catch(e=>{
        console.error(e.response.data)
        if(e.response.data.error.message){
            res.json({error: e.response.data.error.message})
        }
    })
}

async function createOneNoteNotebook(req,res){
    const token = await returnToken();
    const url = config.base_URL + "notebooks";
    const headers= {
        "Content-type": "application/json",
        "Authorization": "Bearer "+ token
    }
    const data = {
      displayName: req.query.name
    }

    axios({
        method: 'post',
        url,
        headers,
        data
    })
    .then(d=>{
        res.json({
            id: d.data.id, 
            title: d.data.displayName
        })
    })
    .catch(e=>{
        console.error(e.response.data)
        if(e.response.data.error.message){
            res.json({error: e.response.data.error.message})
        }
    })
 }

async function createSections(req,res){
    try{
        if(req.query.notebookId){
            const sections = url.parse(req.url,true).query.sections.split(","); // ',' separated section names
            // const Sections = fse.readdirSync('./notes'); // extract from folder

            const response_array = [];
            for(let section of sections){
                response_array.push(await createOneSection(section,req.query.notebookId));
            }
            res.json(response_array)
        } else {
            console.log("no notebook Id")
        }
    }
    catch(e)
    {
        console.log(e);
        res.json({error: e})
    }
}

async function createOneSection(name,notebookId){
    const token = await returnToken();
    const url = config.base_URL + "/notebooks/" + notebookId + "/sections/";
    const headers= {
        "Content-type": "application/json",
        "Authorization": "Bearer "+ token
    }
    data = {
        "displayName": name
    }
    return axios({
        method: 'post',
        url,
        headers,
        data
    })
    .then(d=>{
        console.log(d.data)
        return {id: d.data.id, title: d.data.displayName};   
    })
    .catch(e=>{
        console.error(e.response.data)
        if(e.response.data.error.message){
            return {error: e.response.data.error.message}
        }
    })
}

// Now, posting all the paegs from ./notes(google archive of keep notes) to one notes
async function postPagesToAllSections(req,res){
    const token = await returnToken();
    // const url = config.base_URL + "/notebooks/" + req.query.notebookId + "/sections/";
    const headers = {
        "content-type": "application/json",
        "Authorization": "Bearer " + token
    }

    // const sections = (await axios({
    //     method : 'get',
    //     url,
    //     headers
    // })).data.value // when reading from file directory
    const sections = JSON.parse( url.parse(req.url, true).query.sections )// when provided in query
    // sections = [{
    //     id:"id",
    //     name:"name"
    // }]
    res.json(sections);
    console.log(sections.length)
    let response_json = {};
    for(let section of sections){
        response_json[section.displayName] = await postAllPagesToAsection(section.title,section.id)
    }
}
// postPagesToAllSections();

async function postAllPagesToAsection(sectionName, sectionId){
    try{
        // folder which need to be moved, can also be passed as form data;
        const pages = await fse.readdir(`./notes/${sectionName}`)

        let response_array = []
        for(let page of pages){
            console.log(page)
            response_array.push(await postOnePagetoASection(page, sectionId))
        }
        return response_array;
        // return pages;
    } catch(e){
        console.log("error created multiple page")
    }
}

async function postOnePagetoASection(page, sectionId){
    try{
        const token = await returnToken();
        const fileName = page.replace(".json", ".html")
        const file = (await fse.readFileSync(`./Keep/${fileName}`, "utf-8"))
        // console.log(file)
        const url = config.base_URL + "sections/" + sectionId + "/pages";
        const data = new FormData();
        data.append("Presentation", file , {contentType: "text/html; charset=UTF-8"})
        const headers = {
            "Authorization": "Bearer " + token,
            "Content-type": `multipart/form-data; boundary=${data._boundary}`
        }
      
        return await axios({
            method: 'post',
            url,
            headers,
            data
        })
        .then(d=>{
            console.log(d.data.title)
            return d.data.title;
        })
        .catch(e=>{
            console.log(e.response)
        })
    } catch(e){
        console.log("error creating single page", page)
    }
    
}

async function returnToken(){
    const tokenObject = await fse.readJsonSync('./Cred/token_Object.json');
    return tokenObject.access_token;
}


module.exports = {
    getAllNotebooks,
    getUserDetails,
    getAllsectionsInNotebook,
    getAllPagesInASection,
    createOneNoteNotebook,
    createSections,
    postPagesToAllSections,
}



// const NoteCOnfig = {
//     color: String,
//     isTashed: Boolean,
//     isPinned: Boolean,
//     isArchived: Boolean,
//     textContent: String,
//     title: String,
//     userEditedTimestampUsec: Number,
//     labels: [
//         {
//             name: "String"
//         }
//     ]
// }