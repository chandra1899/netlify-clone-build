require('dotenv').config();
// import { createClient, commandOptions } from "redis";
import { copyFinalDist, downloadS3Folder } from "./aws";
import { buildproject } from "./utils";
import { updatestatus } from "./updatestatus";
import { deleteFolder } from "./deleteFolder";
import path from "path"
import Redis from "ioredis"
// const publisher = createClient()
// publisher.connect()
// const subscriber = createClient()
// subscriber.connect()
const publisher = new Redis({
    host : process.env.REDIS_HOST as string,
    port : parseInt(process.env.REDIS_PORT as string) as number,
    username : process.env.REDIS_USERNAME as string,
    password : process.env.REDIS_PASSWORD as string
})

const subscriber = new Redis({
    host : process.env.REDIS_HOST as string,
    port : parseInt(process.env.REDIS_PORT as string) as number,
    username : process.env.REDIS_USERNAME as string,
    password : process.env.REDIS_PASSWORD as string
})

async function main () {
    while(1){
        const res = await subscriber.brpop('build-queue', 0);
            // @ts-ignore
            const id = res[1]
            await downloadS3Folder(`output/${id}`)
            // console.log("downloded");
            
            await updatestatus(id, "building")

            await publisher.hset("status", id, "building...")
            await buildproject(id);
            
            await updatestatus(id, "build")

            await publisher.hset("status", id, "build...")
            await publisher.hset("status", id, "deploying...")
            await copyFinalDist(id); 
            await updatestatus(id, "deployed")
            // console.log("deleting files");
            
            await deleteFolder(path.join(__dirname, `output/${id}`))
            // console.log("deleted all files");
        
        await publisher.hset("status", id, "deployed")
    }
}

main()