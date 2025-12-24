import React, { useMemo, useState, useEffect } from "react";

export default function TableWidget({ widget, data = [] }) {
  const {
    columns = [],
    sortBy = "asc",
    pagination = "",
    applyFilter,
    filter,
    fontSize = 14,
    headerBg = "#D8D8D8",
  } = widget || {};

  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [pagination, sortBy, applyFilter, filter, columns]);

 
  const filteredData = useMemo(() => {
    if (!applyFilter || !filter || !filter.attribute || !filter.value)
      return data;

    const { attribute, operator, value } = filter;
    const filterValue = String(value).toLowerCase().trim();

    return data.filter((row) => {
      if (!(attribute in row)) return false;

      const cell = String(row[attribute] ?? "")
        .toLowerCase()
        .trim();

      switch (operator) {
        case "=":
          return cell === filterValue;
        case "!=":
          return cell !== filterValue;
        case "contains":
          return cell.includes(filterValue);
        case "starts":
          return cell.startsWith(filterValue);
        case "ends":
          return cell.endsWith(filterValue);
        default:
          return true;
      }
    });
  }, [data, applyFilter, filter]);

  //  Sorting
  const sortedData = useMemo(() => {
    if (!columns.length) return filteredData;

    const firstCol = columns[0];
    return [...filteredData].sort((a, b) => {
      if (!firstCol) return 0;

      const valA = String(a[firstCol] ?? "").toLowerCase();
      const valB = String(b[firstCol] ?? "").toLowerCase();

      return sortBy === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });
  }, [filteredData, columns, sortBy]);

  const pageSize =
    pagination && Number(pagination) > 0
      ? Number(pagination)
      : sortedData.length;

  // Pagination
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
        <p className="animate-pulse text-gray-400">Loading data…</p>
      </div>
    );
  }

  const totalPages = Math.ceil(sortedData.length / pageSize);

  if (!columns.length) {
    return <div className="text-sm text-gray-400 p-4">No columns selected</div>;
  }

  return (
    <div className="w-full h-full bg-white border rounded-md">
      <div className="overflow-x-auto">
        <table className="w-full" style={{ fontSize: `${fontSize}px` }}>
          <thead>
            <tr className="border-b">
              {columns.map((col) => (
                <th
                  key={col}
                  className="text-left font-medium text-gray-700 px-4 py-3"
                  style={{
                    backgroundColor: headerBg,
                    fontSize: `${fontSize}px`,
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, idx) => (
              <tr key={idx} className="border-b last:border-b-0">
                {columns.map((col) => (
                  <td key={col} className="px-4 py-4 text-gray-800">
                    {row[col] ?? "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {pagination && totalPages > 1 && (
          <div className="flex justify-end gap-2 p-2">
            Page {page} of {totalPages}
          </div>
        )}
      </div>
    </div>
  );
}

