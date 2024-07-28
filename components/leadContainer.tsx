"use client";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { Lead } from "static/types";
import { useSortable } from "@dnd-kit/sortable";

interface Props {
  lead: Lead;
  deleteLead: (leadId: string | number) => void;
}

export default function LeadContainer(props: Props) {
  const { lead, deleteLead } = props;
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lead.Id,
    data: {
      type: "Lead",
      lead,
    },
  });
  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
    setMouseIsOver(false);
  };

  if (isDragging) {
    <div
      ref={setNodeRef}
      style={style}
      className="opacity-30 bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left 
       rounded-xl border-2  border-rose-500 cursor-grab relative"
    />;
  }

  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        autoFocus
        // onBlur={toggleEditMode}
        onClick={toggleEditMode}
        className="bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] flex flex-col items-center rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative"
      >
        <p className="my-auto w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
          {lead.Email}
        </p>
        <p className="my-auto w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
          {lead.Agendacion}
        </p>
        <p className="my-auto w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
          {lead.UTM_Campaign}
        </p>
        <p className="my-auto w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
          {lead.UTM_Content}
        </p>
        <p className="my-auto w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
          {lead.UTM_Medium}
        </p>
        <p className="my-auto w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
          {lead.UTM_Source}
        </p>
        <p className="my-auto w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
          {lead.UTM_Term}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onDoubleClick={toggleEditMode}
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      className="bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative"
    >
      <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {lead.Email}
      </p>
      {mouseIsOver && (
        <button
          onClick={() => deleteLead(lead.Id)}
          className="stroke-white absolute right-0 -translate-x-1/2 bg-columnBackgroundColor p-2 rounded opacity-60 hover:opacity-100"
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
      )}
    </div>
  );
}
