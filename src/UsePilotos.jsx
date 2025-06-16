import { useState } from "react";

export function usePilotosApi() {
  const[datas,setDatas] = useState('')  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function sla(novoPiloto) {
  try{
    setLoading(true)
    setError(null)
    const res = await fetch(url,options)
    const json = await res.json()
    setDatas(json)
    console.log(json)
  }catch(err){
    setError(err.message || "Erro de fato")
  }finally{
    setLoading(false) 
  }
    
   
  }

  

  

  return { datas,loading,error,sla};
}
