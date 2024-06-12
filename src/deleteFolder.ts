import fs from "fs"
import path from "path"
 
export const deleteFolder = (directoryPath : string) => {
    try {
        if (fs.existsSync(directoryPath)) {
            fs.readdirSync(directoryPath).forEach((file) => {
                const currentPath = path.join(directoryPath, file);
                if (fs.lstatSync(currentPath).isDirectory()) {
                    deleteFolder(currentPath);
                } else {
                    fs.unlinkSync(currentPath);
                }
            });
        }
    } catch (error) {
        console.log("error in deleting files", error);
        
    }
}