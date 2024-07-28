"use client";
import { useState} from "react";
import { StatusChangesContext } from "static/components/context";
import LeadContainer from "./leadContainer";
import { Column, Id, Lead } from "static/types";
import { useSortable, SortableContext} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id:Id, title:string) => void;
  createLead: (columnId:Id)=> void
  leads: Lead[];
  deleteLead: (leanId:string|number)=>void;
}

export default function ColumnContainer(props: Props) {
  const { column, deleteColumn, updateColumn, createLead, leads, deleteLead} = props;
  const [editMode, setEditMode] = useState(false)
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({
      id: column.id,
      data: {
        type: "Column",
        column,
      },
      disabled:editMode
    });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  const leadIds = leads.map(lead => {return lead.Id })

  if(isDragging){
    return(
      <div 
      ref={setNodeRef}
      style={style}
      className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col opacity-60 border-2 border-rose-500"/>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
    >
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        className="bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none- p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between"
      >
        <div className="flex gap-2">
          <div className="flex justify-center items-center bg-columnBackgroundColor px-2 py-1 text-sm rounded-full ">
            0
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
              autoFocus
              className="bg-black focus:border-rose-500 border rounded outline-none px-2"
              value={column.title}
              onBlur={() => {
                setEditMode(false);
              }}
              onChange={(e) => {
                updateColumn(column.id, e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <button
          className="stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor rounded px-1 py-2"
          onClick={() => deleteColumn(column.id)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
          
        </button>
      </div>
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={leadIds}>
        {leads?.map((lead)=>{
          return(
            <LeadContainer deleteLead={deleteLead} key={lead.Id} lead={lead} />
          )
        })}
        </SortableContext>
      </div>
      <button 
      className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black"
      onClick={() =>{createLead(column.id)}}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        Add Task
      </button>
    </div>
  );
}
