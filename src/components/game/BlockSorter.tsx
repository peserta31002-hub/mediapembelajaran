"use client";

import { Reorder, useDragControls } from "framer-motion";
import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface SortItem {
  id: string;
  text: string;
}

function Row({
  item,
  index,
  total,
  mono,
  onMove,
}: {
  item: SortItem;
  index: number;
  total: number;
  mono?: boolean;
  onMove: (from: number, to: number) => void;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={item.id}
      dragListener={false}
      dragControls={controls}
      whileDrag={{ scale: 1.02, boxShadow: "0 12px 30px -8px rgba(255,122,26,0.35)" }}
      className="flex touch-none list-none items-stretch gap-2"
    >
      <div className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-[#0e1a33] px-3 py-2.5">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/5 font-mono-code text-[11px] font-bold text-slate-400">
          {index + 1}
        </span>
        <button
          type="button"
          className="flex flex-1 cursor-grab touch-none items-center gap-2 text-left active:cursor-grabbing"
          onPointerDown={(e) => controls.start(e)}
          aria-label={`Tahan untuk geser: ${item.text}`}
        >
          <GripVertical className="h-4 w-4 shrink-0 text-slate-500" />
          <span
            className={`text-sm text-slate-100 ${mono ? "font-mono-code text-[12.5px]" : ""}`}
          >
            {item.text}
          </span>
        </button>
        <div className="flex shrink-0 flex-col gap-0.5 sm:flex-row">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-slate-400 hover:text-white"
            disabled={index === 0}
            onClick={() => onMove(index, index - 1)}
            aria-label="Naikkan satu posisi"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-slate-400 hover:text-white"
            disabled={index === total - 1}
            onClick={() => onMove(index, index + 1)}
            aria-label="Turunkan satu posisi"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Reorder.Item>
  );
}

export default function BlockSorter({
  items,
  onOrderChange,
  mono,
  disabled,
}: {
  items: SortItem[];
  onOrderChange: (ids: string[]) => void;
  mono?: boolean;
  disabled?: boolean;
}) {
  const onMove = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onOrderChange(next.map((i) => i.id));
  };

  return (
    <Reorder.Group
      axis="y"
      values={items.map((i) => i.id)}
      onReorder={(ids) => !disabled && onOrderChange(ids)}
      className={`space-y-2 ${disabled ? "pointer-events-none opacity-60" : ""}`}
    >
      {items.map((item, idx) => (
        <Row
          key={item.id}
          item={item}
          index={idx}
          total={items.length}
          mono={mono}
          onMove={onMove}
        />
      ))}
    </Reorder.Group>
  );
}
