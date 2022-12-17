import axios from "axios";

// tokens to generate
let token :8;
// #temperature
let temperature :0.6; 
// #seed
let seed :42;

export const getGenByTemplate = (template:string) :Promise<any>=>{
    return axios({
        url:"https://bigcode-santa-demo.hf.space/run/predict",
        method:"POST",
        data: JSON.stringify({
            data:[
                template,
                8,
                0.6,
                42
            ]
        }),
        headers:{
            "Content-Type":"application/json"
        }
    });
};