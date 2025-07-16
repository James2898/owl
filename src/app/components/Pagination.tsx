import * as React from "react";

import { Table } from "@tanstack/react-table";
import { Student } from "@/app/interface/Student";
import { Style } from "@/lib/Styles";

export const Pagination = (table: Table<Student>) => {
  return (
    <div className="mt-4 flex items-center inline-block w-full justify-center">
      <div>
        <div className="w-full flex items-center justify-center mb-2">
          <span className="text-sm text-gray-700">
            Page{" "}
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </span>
        </div>
        <nav className="isolate inline-flex justify-center w-full">
          <button
            type="button"
            className={
              table.getCanPreviousPage() ? Style.btnDefault : Style.btnDisabled
            }
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            First
          </button>
          <button
            type="button"
            className={
              table.getCanPreviousPage() ? Style.btnDefault : Style.btnDisabled
            }
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>
          <button
            type="button"
            className={
              table.getCanNextPage() ? Style.btnDefault : Style.btnDisabled
            }
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
          <button
            type="button"
            className={
              table.getCanNextPage() ? Style.btnDefault : Style.btnDisabled
            }
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            Last
          </button>
        </nav>
      </div>
    </div>
  );
};
