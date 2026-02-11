import React, { useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import TodoCard from "./TodoCard";

function getISOWeekKey(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function weekIndex(weekKey) {
  // "2026-W06" -> comparable number
  const [y, w] = weekKey.split("-W");
  return Number(y) * 100 + Number(w);
}

export default function TodoGroup({
  groupName = "To-Dos",
  list = [],
  activeDate = new Date(), // <- neu: kommt von deiner Timeline
  toggleTodo,
  onEditRequest,
  onDeleteRequest,
}) {
  const [collapsed, setCollapsed] = useState(false);

  if (!Array.isArray(list) || list.length === 0) return null;

  const selectedWeekKey = useMemo(() => getISOWeekKey(activeDate), [activeDate]);
  const selectedWeekIdx = useMemo(() => weekIndex(selectedWeekKey), [selectedWeekKey]);

  const visibleList = useMemo(() => {
    const filtered = list.filter((t) => {
      const createdAt = t.createdAt ?? t.created_at ?? null;
      const doneAt = t.doneAt ?? t.done_at ?? null;

      // 1) Todo muss in der ausgewählten Woche schon existiert haben
      if (!createdAt) return true; // fallback: lieber anzeigen als verlieren
      const createdWeekIdx = weekIndex(getISOWeekKey(new Date(createdAt)));
      if (createdWeekIdx > selectedWeekIdx) return false;

      // 2) Sichtbarkeit nach done/doneAt
      if (!t.done) return true;

      if (!doneAt) return false;
      const doneWeekKey = getISOWeekKey(new Date(doneAt));
      return doneWeekKey === selectedWeekKey;
    });

    return filtered.sort((a, b) => {
      // offene zuerst
      if (a.done !== b.done) return a.done ? 1 : -1;

      // dann nach due_date (frühere zuerst)
      const ad = a.due_date ? new Date(a.due_date).getTime() : Infinity;
      const bd = b.due_date ? new Date(b.due_date).getTime() : Infinity;
      if (ad !== bd) return ad - bd;

      // dann nach created_at/createdAt (ältere zuerst)
      const ac = a.createdAt ?? a.created_at ?? 0;
      const bc = b.createdAt ?? b.created_at ?? 0;
      return new Date(ac).getTime() - new Date(bc).getTime();
    });
  }, [list, selectedWeekKey, selectedWeekIdx]);

  // Progress: würde ich ebenfalls auf visibleList beziehen (Timeline-View)
  const doneCount = visibleList.filter((t) => t.done).length;
  const total = visibleList.length;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div className="mb-3">
      <div
        className="px-4 py-3 flex items-center justify-between cursor-pointer rounded-2xl transition"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-2">
          {collapsed ? (
            <ChevronRight size={18} className="text-slate-300/70" />
          ) : (
            <ChevronDown size={18} className="text-slate-300/70" />
          )}
          <span className="font-semibold text-sm text-slate-300">{groupName}</span>
        </div>

        <div className="flex items-center gap-2 w-[40%]">
          <div className="h-2 flex-1 bg-slate-300/50 rounded-full overflow-hidden">
            <div
              className="h-2 bg-slate-200 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs text-slate-300">{pct}%</span>
        </div>
      </div>

      {!collapsed && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
          {visibleList.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              toggleTodo={toggleTodo}
              onEdit={onEditRequest}
              onDelete={onDeleteRequest}
            />
          ))}
        </div>
      )}
    </div>
  );
}