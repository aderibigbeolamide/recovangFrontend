import { type ReactNode, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Filter, Search, Inbox } from "lucide-react";
import { cn } from "@/lib/cn";

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => ReactNode;
  searchValue?: (row: T) => string;
}

export interface FilterOption {
  label: string;
  value: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  searchPlaceholder?: string;
  filterKey?: string;
  filterOptions?: FilterOption[];
  filterPredicate?: (row: T, value: string) => boolean;
  empty?: ReactNode;
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  rightActions?: ReactNode;
}

export function DataTable<T>({
  data,
  columns,
  pageSize = 8,
  searchPlaceholder = "Search…",
  filterOptions,
  filterPredicate,
  empty,
  rowKey,
  onRowClick,
  rightActions,
}: DataTableProps<T>) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let rows = data;
    if (filter !== "all" && filterPredicate) {
      rows = rows.filter((r) => filterPredicate(r, filter));
    }
    if (q.trim()) {
      const needle = q.toLowerCase();
      rows = rows.filter((r) =>
        columns.some((c) => {
          const v = c.searchValue ? c.searchValue(r) : "";
          return v.toLowerCase().includes(needle);
        })
      );
    }
    return rows;
  }, [data, q, filter, columns, filterPredicate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const slice = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div>
      <div className="flex flex-col gap-3 border-b border-bordergray p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-textgray" />
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              placeholder={searchPlaceholder}
              className="input h-10 pl-9 text-sm"
            />
          </div>
          {filterOptions && filterOptions.length > 0 && (
            <div className="relative">
              <Filter size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-textgray" />
              <select
                value={filter}
                onChange={(e) => { setFilter(e.target.value); setPage(1); }}
                className="input h-10 appearance-none pl-9 pr-8 text-sm font-bold"
              >
                <option value="all">All</option>
                {filterOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        {rightActions && <div className="flex items-center gap-2">{rightActions}</div>}
      </div>

      <div className="overflow-x-auto">
        <table className="tbl">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} className={c.className}>{c.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center">
                  {empty ?? (
                    <div className="flex flex-col items-center gap-2 text-textgray">
                      <Inbox size={28} />
                      <div className="text-sm font-bold">No matching results</div>
                      <div className="text-xs">Try a different search or filter.</div>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              slice.map((row) => (
                <tr
                  key={rowKey(row)}
                  className={onRowClick ? "cursor-pointer hover:bg-cream/70" : undefined}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((c) => (
                    <td key={c.key} className={c.className}>{c.render(row)}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 border-t border-bordergray p-4 text-xs text-textgray sm:flex-row sm:p-5">
        <div className="font-medium">
          Showing <span className="font-bold text-charcoal">{slice.length}</span> of{" "}
          <span className="font-bold text-charcoal">{filtered.length}</span>
          {filtered.length !== data.length && <> · filtered from {data.length}</>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            className={cn(
              "grid h-8 w-8 place-items-center rounded-lg border border-bordergray bg-white",
              safePage <= 1 ? "text-textgray/40" : "hover:border-charcoal/30 text-charcoal"
            )}
            aria-label="Previous page"
          >
            <ChevronLeft size={14} />
          </button>
          <div className="font-mono font-bold text-charcoal">
            {safePage} / {totalPages}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            className={cn(
              "grid h-8 w-8 place-items-center rounded-lg border border-bordergray bg-white",
              safePage >= totalPages ? "text-textgray/40" : "hover:border-charcoal/30 text-charcoal"
            )}
            aria-label="Next page"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
