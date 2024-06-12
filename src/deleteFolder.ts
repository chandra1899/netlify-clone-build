import fs from "fs"

export const deleteFolder = (folderPath : string) => {
    return new Promise(async (resolve) => {
        fs.rm(folderPath, { recursive: true, force: true }, (err) => {
            if (err) {
                console.error(`Error deleting folder: ${err.message}`);
            } else {
                console.log(`Folder deleted successfully`);
                resolve("")
            }
        });
    })
}