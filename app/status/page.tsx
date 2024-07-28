"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Status() {
  const [changes, setChanges] = useState<any>([]);
  
  const onStorageUpdate = (e) => {
    console.log("EVEEENT",e)
    const { key, newValue } = e;
    if (key === "changes") {
      setChanges(prev => [...prev, new Object(JSON.parse(newValue))]);
    }
  };
  
  useEffect(() => {
    let data = JSON.parse(localStorage.getItem("changes"))||""
    setChanges([...changes, data]);
    window.addEventListener("storage", onStorageUpdate);
    return () => {
      window.removeEventListener("storage", onStorageUpdate);
    };
  }, []);
  
  useEffect(() => {
    console.log("HEEERE", changes)
  }, [changes]);

  return (
    <div className="h-screen w-[100%] ">
      <div className="flex flex-col items-center justify-between">
        <div className="bg-mainBackgroundColor text-md h-[60px] cursor-pointer rounded-md rounded-b-none- p-3 font-bold border-columnBackgroundColor border-4">
          <Link href="/">BACK</Link>
        </div>
        <div>
        <table 
        className="w-[1300px] font-bold border-columnBackgroundColor border-4"
        >
          <thead>
            <tr className="h-20 ">
              <th>Changes</th>
            </tr>
            <tr>
              <th>Email</th>
              <th>From</th>
              <th>To</th>
            </tr>
          </thead>
      
          <tbody className="border-2 border-white h-20 ">
            {changes && changes.length>0  && changes.map((change, index) =>{
              let fromColumnName = change.from &&  change.columns.filter((col) => col.id === change.from)[0].title
              let toColumnName = change.to &&  change.columns.filter((col) => col.id === change.to)[0].title
              if(change.lead){
                return(
                <tr key={index} className="border-2 border-white h-20 hover:bg-columnBackgroundColor">
                  <td className="border-2 border-white h-20 ">{change.lead?.Email}</td>
                  <td className="border-2 border-white h-20 ">{fromColumnName}</td>
                  <td className="border-2 border-white h-20 ">{toColumnName}</td>
                </tr>)}
            })}
          </tbody>
  
        </table>
        </div>
      </div>
    </div>
  );
}
