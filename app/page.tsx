"use client";
import Board from "static/components/board";
import { useEffect, useState } from "react";
import {
  getAllClosers,
  getCloserData,
  updateClientStatus,
} from "../actions/google-sheets.actions";
import Link from "next/link";

export default function Home() {
  const [closers, setClosers] = useState(null);
  const [selected, setSelected] = useState("");
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    let fetchClosers = async () => {
      const response = await getAllClosers();
      setClosers(response.data);
    };
    fetchClosers();
  }, []);

  const handleSelect = async (algo) => {
    return await getCloserData(algo).then((data) => {
      setSelected(algo);
      setLeads(data.data);
    });
  };

  return (
    <div>
      <select
        value={selected}
        onChange={(e) => handleSelect(e.target.value)}
        className="bg-mainBackgroundColor text-md h-[60px] cursor-pointer rounded-md rounded-b-none- p-3 font-bold border-columnBackgroundColor border-4 absolute top-32 left-1/4"
      >
        <option value={""}>Choose Closer</option>
        {closers?.map((e, i) => {
          return (
            <option key={i} value={e}>
              {e}
            </option>
          );
        })}
      </select>
      <div className="bg-mainBackgroundColor text-md h-[60px] cursor-pointer rounded-md rounded-b-none- p-3 font-bold border-columnBackgroundColor border-4 absolute top-32 left-1/2">
        <Link href="/status" passHref legacyBehavior>
          <a target="_blank">CLICK HERE TO GOT TO STATUS CHANGES</a>
        </Link>
      </div>
      <Board
        leads={leads}
        closer={selected}
        setLeads={setLeads}
        selected={selected}
      />
    </div>
  );
}
