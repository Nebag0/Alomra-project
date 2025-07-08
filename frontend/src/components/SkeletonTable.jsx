import React from "react";

export default function SkeletonTable({ columns = 4, rows = 10 }) {
  return (
    <table className="min-w-full divide-y divide-indigo-200 animate-pulse">
      <thead className="bg-indigo-700">
        <tr>
          {Array.from({ length: columns }).map((_, i) => (
            <th key={i} className="py-3 px-4">
              <div className="h-4 bg-indigo-400 rounded w-3/4 mx-auto" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-indigo-100">
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i}>
            {Array.from({ length: columns }).map((_, j) => (
              <td key={j} className="py-2 px-4">
                <div className="h-4 bg-gray-200 rounded w-full" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
} 