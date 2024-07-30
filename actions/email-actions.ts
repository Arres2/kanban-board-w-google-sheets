'use server';

export async function sendEmail() { 
    try{
        
        const response = await fetch("https://hook.us1.make.com/besp8qy2kexxw3ap6e9ewswsvczrtbr8",{
            method:"POST",
            headers:{
                Authorization: "Token "+ process.env.MAKE_MASTER_KEY
            }
        }).then(res => res.json())
        
        console.log( response)
        return { data: response };
    }
    catch(error){
        console.log(error.message)
    }
}
