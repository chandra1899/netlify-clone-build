
export const updatestatus =async (id : string, status : string) => {
    try {
        await fetch('http://localhost:8000/api/updatestatus',{
            method:'POST',
            headers:{
              'Access-Control-Allow-Origin': '*',
              Accept:"application/json",
              "Content-Type":"application/json"
            },
            credentials:'include',
            body:JSON.stringify({
                status : status,
                deploymentId : id
            })
          })
    } catch (error) {
        console.log("error", error);
        
    }
}