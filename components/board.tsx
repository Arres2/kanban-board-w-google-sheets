/* eslint-disable react/jsx-key */
"use client";
import { useState } from "react";
import { Column, Id, Lead } from "static/types";
import ColumnContainer from "./columnContainer";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import {
  DndContext,
  DragStartEvent,
  DragOverlay,
  DragEndEvent,
  useSensor,
  PointerSensor,
  useSensors,
  DragOverEvent,
} from "@dnd-kit/core";
import { createPortal } from "react-dom";
import { useEffect } from "react";
import LeadContainer from "./leadContainer";
import { sendEmail } from "static/actions/email-actions";


interface Props {
  leads: Lead[];
  setLeads: (data: any) => void;
  closer: string | null;
  selected: string | null;
}

export default function Board(props: Props) {
  const { leads, setLeads, closer, selected } = props;
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [docEnv, setDocEnv] = useState(false);
  const [columnChange, setColumnChange] = useState({ from: null, to: null });
  const [ changes, setChanges]  =  useState<any>([]);

  const onStorageUpdate = (e) => {
    const { key, newValue } = e;
    if (key === "changes") {
      setChanges([...changes, newValue]);
    }
  };

  const handleChange = (e) => {
    setChanges([...changes, e]);
    console.log("DATAA", JSON.parse(JSON.stringify(changes)))
    localStorage.setItem("changes", JSON.stringify(e));
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      setDocEnv(true);
    }
    
    window.addEventListener("storage", onStorageUpdate);
    return () => {
      window.removeEventListener("storage", onStorageUpdate);
    };
  }, []);
  

  const [columns, setColumns] = useState<Column[]>([
    { id: randomId(), title: "Contactando" },
    { id: randomId(), title: "Esperando" },
    { id: randomId(), title: "Llamando" },
    { id: randomId(), title: "Win" },
    { id: randomId(), title: "Lose" },
  ]);

  const columnsId = columns.map((col) => col.id);

  const mapLeadsToColumns = () => {
    let colid = columnsId[0];
    let data = leads.map((lead) => {
      if (!lead.columnId) {
        // console.log({...lead, columnId: columnsId[0]})
        return { ...lead, columnId: colid };
      } else return lead;
    });
    setLeads(data);
  };

  useEffect(() => {
    if (selected?.length) {
      mapLeadsToColumns();
    }
  }, [selected]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  function randomId() {
    return Math.floor(Math.random() * 1000001);
  }

  function createLead(columnId: Id) {
    const newLead: any = {
      Id: randomId(),
      columnId,
      Agendacion: null,
      Closer: closer || null,
      Status: null,
      Email: "email",
      UTM_Campaign: null,
      UTM_Content: null,
      UTM_Medium: null,
      UTM_Source: null,
      UTM_Term: null,
    };
    setLeads([...leads, newLead]);
  }

  function onDragEnd(event: DragEndEvent) {
    const { over, active } = event;
    handleChange({ ...columnChange, columns: columns, });
    setActiveColumn(null);
    setActiveLead(null);
    if(columnChange.to === "Win")sendEmail()
    setColumnChange({ from: null, to: null });
    if (!over) return;
    const activeColumnId = active.id;
    const overColumnId = over.id;
    if (activeColumnId === overColumnId) return;
    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (col) => col.id === activeColumnId
      );

      const overColumnIndex = columns.findIndex(
        (col) => col.id === overColumnId
      );
      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function deleteLead(leadId: Id) {
    let filetered = leads.filter((lead) => lead.Id !== leadId);
    setLeads(filetered);
  }

  function deleteColumn(id: Id) {
    let filetered = columns.filter((col) => col.id !== id);
    setColumns(filetered);

    const newLeads = leads.filter((l) => l.columnId !== id);
    setLeads(newLeads);
  }

  function updateColumn(id: Id, title: string) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    setColumns(newColumns);
  }

  function createNewColumn() {
    const columnToAdd: Column = {
      id: randomId(),
      title: "New Column",
    };
    setColumns([...columns, columnToAdd]);
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    if (event.active.data.current?.type === "Lead") {
      setActiveLead(event.active.data.current.lead);
      return;
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { over, active } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const isActiveLead = active.data.current?.type === "Lead";
    const isOverALead = over.data.current?.type === "Lead";

    if (!activeLead) return;

    if (isActiveLead && isOverALead) {
      setLeads((leads) => {
        const activeIndex = leads.findIndex((l) => l.Id === activeId);
        const overIndex = leads.findIndex((l) => l.Id === overId);

        leads[activeIndex].columnId = leads[overIndex].columnId;

        return arrayMove(leads, activeIndex, overIndex);
      });
    }
    const isOverAColumn = over.data.current?.type === "Column";

    if (isActiveLead && isOverAColumn) {
      (() => {
        const activeIndex = leads.findIndex((l) => l.Id === activeId);

        setColumnChange({lead: leads[activeIndex], from: leads[activeIndex].columnId, to: overId });
        leads[activeIndex].columnId = overId;

        return setLeads(arrayMove(leads, activeIndex, activeIndex));
      })();
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
        <DndContext
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          sensors={sensors}
          onDragOver={onDragOver}
        >
          <div className="m-auto flex gap-4">
            <div className="flex gap-4">
              <SortableContext items={columnsId}>
                {columns.map((column) => {
                  return (
                    <ColumnContainer
                      key={column.id}
                      column={column}
                      deleteColumn={deleteColumn}
                      updateColumn={updateColumn}
                      createLead={createLead}
                      leads={leads.filter((lead) => {
                        return lead.columnId === column.id;
                      })}
                      deleteLead={deleteLead}
                    />
                  );
                })}
              </SortableContext>
            </div>
            <button
              onClick={createNewColumn}
              className=" h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2 flex gap-2"
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
              Add Column
            </button>
          </div>
          {docEnv && createPortal(
            <DragOverlay>
              {activeColumn &&  (
                <ColumnContainer
                  column={activeColumn}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createLead={createLead}
                  leads={leads.filter((lead) => {
                    return lead.columnId === activeColumn.id;
                  })}
                  deleteLead={deleteLead}
                />
              )}
              {activeLead &&  (
                <LeadContainer lead={activeLead} deleteLead={deleteLead} />
              )}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>
    </div>
  );
}
