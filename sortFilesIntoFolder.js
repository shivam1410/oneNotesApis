const fse = require('fs-extra');

const jsonFilter = new RegExp('.json$')
var files = (fse.readdirSync('./Keep')).filter(e => e.match(jsonFilter));

// copy all notes to a single folder
async function copyAllJsonNotesToASeparateFolder(){
    fse.ensureDir("./notes/", async (e, s) => {
        if(!e){
            for(let fileName of files){
                try{
                    await fse.copyFile(`./keep/${fileName}`, `./notes/${fileName}`);
                } catch(e){
                    console.log(e)
                }
            } 
        }
    });
}

// moving files to folders
async function moveAllNotesToFolders(){
    for(const fileName of files) {
        try{
            // await copyAllJsonNotesToASeparateFolder();
            let note = await fse.readJson( `./notes/${fileName}`);
            if(note.labels){
                for(let label of note.labels){
                    console.log(label.name)
                    //create folder for notes with label

                    await fse.ensureDir(`./notes/${label.name}`)
                    await fse.move(`./notes/${fileName}`, `./notes/${label.name}/${fileName}`)
                }
            }
            else {
                console.log(note.title)
                // create separate folder for misc notes
                await fse.ensureDir(`./notes/misc`)
                await fse.move(`./notes/${fileName}`, `./notes/misc/${fileName}`)
            }
        } catch(e){
            console.error(e)
        }
    };
} 

// creating array of all the files in heirarchy
async function checkIfALLAreCopied(root = "./notes", current = "", arr = []){
    const state = await fse.statSync(root);
    if(state.isFile()){
        arr.push(current);
    }
    else {
        const dirs = await fse.readdirSync(root);
        for(let dir of dirs){
            let appendDir = root + '/' + dir
            arr = await checkIfALLAreCopied(appendDir, dir, arr);
        }
    }
    return arr
}

module.exports = {
    copyAllJsonNotesToASeparateFolder,
    moveAllNotesToFolders,
    checkIfALLAreCopied
}