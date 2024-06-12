import { S3 } from "aws-sdk";
import fs from "fs"
import path from "path"

const s3 = new S3({
    accessKeyId : process.env.AWS_ACCESSKEYID,
    secretAccessKey : process.env.AWS_SECRETACCESSKEY,
    endpoint : process.env.AWS_ENDPOINT
})

export async function downloadS3Folder (prefix: string) {
    try {
        // console.log(prefix);
    const allFiles = await s3.listObjectsV2({
        Bucket: "vercel",
        Prefix: prefix
    }).promise();

    const allPromises = allFiles.Contents?.map(async ({Key}) => {
        return new Promise(async (resolve) => {
            if(!Key) {
                resolve("");
                return ;
            }
            const finalOutputPath = path.join(__dirname, Key);
            const outputFile = fs.createWriteStream(finalOutputPath);
            const dirName = path.dirname(finalOutputPath);
            if(!fs.existsSync(dirName)){
                fs.mkdirSync(dirName, { recursive : true});
            }
            s3.getObject({
                Bucket: "vercel",
                Key
            }).createReadStream().pipe(outputFile).on("finish", () => {
                resolve("");
            })
        })
    }) || []
    // console.log("waiting");
    
        await Promise.all(allPromises?.filter(x => x !== undefined))
    } catch (error) {
        console.log("error in downloads3folder", error);
    }
}

const getAllFiles = (folderpath : string) => {
    let response : string[] = []
    const allFilesAndFolders = fs.readdirSync(folderpath);
    allFilesAndFolders.forEach(file => {
        const fullFilePath = path.join(folderpath, file);
        if(fs.statSync(fullFilePath).isDirectory()){
            response = response.concat(getAllFiles(fullFilePath))
        } else {
            response.push(fullFilePath)
        }
    })
    return response;
}

const uploadFile = async (fileName : string, localFilePath : string) => {
    try {
        const fileContent = fs.readFileSync(localFilePath);
        const response = await s3.upload({
            Body: fileContent,
            Bucket:"vercel",
            Key: fileName,
        }).promise();
        // console.log(response);
    } catch (error) {
        console.log("error in uploadFile", error);
    }
}

// const parseFile = (filepath : string) => {
//     let s = "";
//     for(let i=0;i<filepath.length;i++){
//         if(filepath[i] === '\\'){
//             s += '/'
//         } else {
//             s += filepath[i]
//         }
//     }
//     return s;
// }

export function copyFinalDist (id: string) {
    const folderPath = path.join(__dirname, `output/${id}/dist`);
    const allFiles = getAllFiles(folderPath)
    allFiles.forEach(file => {
        // uploadFile(`dist/${id}/` + parseFile(file).slice(folderPath.length +  1), file);
        uploadFile(`dist/${id}/` + file.slice(folderPath.length +  1), file);
    })
}
