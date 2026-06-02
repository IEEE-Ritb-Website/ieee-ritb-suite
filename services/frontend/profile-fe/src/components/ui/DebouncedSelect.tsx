"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface DebouncedSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const DebouncedSelect = ({ options, value, onChange, placeholder = "Search...", disabled }: DebouncedSelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 200);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find(o => o.value === value);
  const filtered = options.filter(o =>
    o.value.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    o.label.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => { setOpen(!open); setSearch(""); setDebouncedSearch(""); }}
        disabled={disabled}
        className="w-full flex items-center justify-between bg-[rgba(0,255,157,0.05)] border border-[rgba(0,255,157,0.2)] rounded px-3 py-2 text-xs outline-none focus:border-[#00ff9d] text-[#00ff9d] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className={value ? "text-[#00ff9d]" : "text-[rgba(200,255,232,0.45)]"}>
          {selected ? selected.label : value || placeholder}
        </span>
        <ChevronDown size={14} className={`text-[#00ff9d] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-[#0d0d1a] border border-[rgba(0,255,157,0.3)] rounded max-h-64 flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-[rgba(0,255,157,0.15)]">
            <Search size={14} className="text-[rgba(200,255,232,0.35)] shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Type to filter..."
              className="w-full bg-transparent outline-none text-xs text-[#00ff9d] placeholder:text-[rgba(200,255,232,0.25)]"
              autoFocus
            />
          </div>
          <div className="overflow-y-auto flex-1">
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-xs text-[rgba(200,255,232,0.35)] text-center">
                No departments found
              </div>
            ) : (
              filtered.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-[rgba(0,255,157,0.08)] transition-colors ${opt.value === value ? "text-[#00ff9d] bg-[rgba(0,255,157,0.06)]" : "text-[rgba(200,255,232,0.6)]"}`}
                >
                  {opt.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
