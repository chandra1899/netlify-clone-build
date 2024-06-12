import fs from "fs"
import path from "path"

// export const deleteFolder = (folderPath : string) => {
//     return new Promise(async (resolve) => {
//         fs.rm(folderPath, { recursive: true, force: true }, (err) => {
//             if (err) {
//                 console.error(`Error deleting folder: ${err.message}`);
//             } else {
//                 console.log(`Folder deleted successfully`);
//                 resolve("")
//             }
//         });
//     })
// }

// export const deleteFolder = (directoryPath : string) => {
//     if (fs.existsSync(directoryPath)) {
//         fs.readdirSync(directoryPath).forEach((file) => {
//             const currentPath = path.join(directoryPath, file);
//             if (fs.lstatSync(currentPath).isDirectory()) {
//                 deleteFolder(currentPath);
//             } else {
//                 fs.unlinkSync(currentPath);
//             }
//         })
//     }
// }

export const deleteFolder = (directoryPath : string) => {
    if (fs.existsSync(directoryPath)) {
        fs.readdirSync(directoryPath).forEach((file) => {
            const currentPath = path.join(directoryPath, file);
            if (fs.lstatSync(currentPath).isDirectory()) {
                deleteFolder(currentPath);
            } else {
                fs.unlinkSync(currentPath);
            }
        });
        fs.rmdirSync(directoryPath); 
    }
}
       

