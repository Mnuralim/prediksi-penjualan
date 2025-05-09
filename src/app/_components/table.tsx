"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";

export interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  sortable?: boolean;
  className?: string;
  render?: (item: T) => React.ReactNode;
}

export interface TableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: TableColumn<T>[];
  className?: string;
  title?: string;
  description?: string;
  searchable?: boolean;
  pagination?: boolean;
  rowsPerPageOptions?: number[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  striped?: boolean;
  hovered?: boolean;
  bordered?: boolean;
  compact?: boolean;
}

const getValue = <T extends Record<string, unknown>>(
  item: T,
  accessor: keyof T | ((item: T) => React.ReactNode)
): unknown => {
  if (typeof accessor === "function") {
    return accessor(item);
  }
  return item[accessor];
};

const sortData = <T extends Record<string, unknown>>(
  data: T[],
  sortField: keyof T | ((item: T) => React.ReactNode) | null,
  sortDirection: "asc" | "desc"
): T[] => {
  if (!sortField) return data;

  return [...data].sort((a, b) => {
    const valueA = getValue(a, sortField);
    const valueB = getValue(b, sortField);

    if (valueA === valueB) return 0;

    if (valueA === null || valueA === undefined) return 1;
    if (valueB === null || valueB === undefined) return -1;

    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortDirection === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    if (typeof valueA === "number" && typeof valueB === "number") {
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    }

    const stringA = String(valueA);
    const stringB = String(valueB);

    return sortDirection === "asc"
      ? stringA.localeCompare(stringB)
      : stringB.localeCompare(stringA);
  });
};

export default function Table<T extends Record<string, unknown>>({
  data,
  columns,
  className = "",
  title,
  description,
  searchable = true,
  pagination = true,
  rowsPerPageOptions = [10, 25, 50, 100],
  onRowClick,
  emptyMessage = "Tidak ada data yang tersedia",
  striped = true,
  hovered = true,
  bordered = false,
  compact = false,
}: TableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<T[]>(data);

  const [sortField, setSortField] = useState<
    keyof T | ((item: T) => React.ReactNode) | null
  >(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  useEffect(() => {
    let result = [...data];

    if (searchTerm) {
      result = result.filter((item) =>
        columns.some((column) => {
          const value = getValue(item, column.accessor);
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    if (sortField) {
      result = sortData(result, sortField, sortDirection);
    }

    setFilteredData(result);
  }, [data, searchTerm, sortField, sortDirection, columns]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = pagination
    ? filteredData.slice(startIndex, startIndex + rowsPerPage)
    : filteredData;

  const handleSort = (column: TableColumn<T>) => {
    if (!column.sortable) return;

    const accessor = column.accessor;

    if (sortField === accessor) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(accessor);
      setSortDirection("asc");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const tableClasses = `
    w-full text-left text-sm border-collapse
    ${bordered ? "border border-gray-200 dark:border-gray-700" : ""}
    ${compact ? "table-compact" : ""}
    ${className}
  `;

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-sm bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
      {(title || description) && (
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          {title && (
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
      )}

      {(searchable || pagination) && (
        <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {searchable && (
              <div className="relative w-full sm:w-64 md:w-80">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-10 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800/50 dark:border-gray-700 dark:text-white"
                  placeholder="Cari..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={clearSearch}
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                )}
              </div>
            )}
          </div>

          {pagination && (
            <div className="flex items-center gap-2 text-sm w-full sm:w-auto justify-end">
              <span className="text-gray-500 dark:text-gray-400 whitespace-nowrap">
                Tampilkan
              </span>
              <select
                className="text-sm border border-gray-200 rounded-lg bg-gray-50 py-1.5 px-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white appearance-none pr-8 bg-no-repeat bg-right"
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundSize: "16px",
                  backgroundPosition: "right 0.5rem center",
                }}
              >
                {rowsPerPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <span className="text-gray-500 dark:text-gray-400 whitespace-nowrap">
                per halaman
              </span>
            </div>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className={tableClasses}>
          <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-6 py-3.5 font-medium text-xs uppercase tracking-wider select-none ${
                    column.className || ""
                  } ${
                    column.sortable
                      ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/70"
                      : ""
                  }`}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable && (
                      <div className="flex flex-col ml-1">
                        <ChevronUp
                          className={`w-3 h-3 -mb-1 ${
                            sortField === column.accessor &&
                            sortDirection === "asc"
                              ? "text-blue-600"
                              : "text-gray-400"
                          }`}
                        />
                        <ChevronDown
                          className={`w-3 h-3 ${
                            sortField === column.accessor &&
                            sortDirection === "desc"
                              ? "text-blue-600"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`
                    border-b border-gray-100 dark:border-gray-800 
                    ${
                      striped && rowIndex % 2 === 1
                        ? "bg-gray-50 dark:bg-gray-800/30"
                        : ""
                    } 
                    ${
                      hovered
                        ? "hover:bg-blue-50 dark:hover:bg-blue-900/10"
                        : ""
                    }
                    ${onRowClick ? "cursor-pointer" : ""}
                  `}
                  onClick={() => onRowClick && onRowClick(item)}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-6 py-4 text-gray-700 dark:text-gray-300 ${
                        column.className || ""
                      }`}
                    >
                      {column.render
                        ? column.render(item)
                        : (getValue(item, column.accessor) as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                      <Search className="w-7 h-7 text-gray-400" />
                    </div>
                    <p className="font-medium">{emptyMessage}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Coba ubah kriteria pencarian
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 0 && (
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-300 order-2 sm:order-1">
            Menampilkan {startIndex + 1} hingga{" "}
            {Math.min(startIndex + rowsPerPage, filteredData.length)} dari{" "}
            {filteredData.length} entri
          </div>

          <div className="flex items-center order-1 sm:order-2">
            <button
              className="flex items-center justify-center h-9 w-9 rounded-lg text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 mr-1 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none transition-colors"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center overflow-x-auto gap-1 px-1 py-1 max-w-xs scrollbar-hide">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const showPage =
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);

                if (!showPage) {
                  if (pageNum === 2 || pageNum === totalPages - 1) {
                    return (
                      <span
                        key={i}
                        className="flex items-center justify-center h-9 w-9 text-gray-500 dark:text-gray-400"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                }

                return (
                  <button
                    key={i}
                    className={`
                      flex items-center justify-center h-9 min-w-9 px-3 rounded-lg text-sm font-medium transition-colors
                      ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }
                    `}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              className="flex items-center justify-center h-9 w-9 rounded-lg text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 ml-1 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none transition-colors"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
