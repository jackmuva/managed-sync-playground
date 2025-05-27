"use client";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { SyncedObject } from "@/db/schema";
import { ChevronDown } from "lucide-react";
import { formatJson } from "@/lib/utils";
import { Button } from "../ui/button";

export function SyncedObjectsView({ user, selectedSource }: { user: object | undefined | null, selectedSource: { name: string, type: string, icon: string | undefined } }) {
  const [expandedRow, setExpandedRows] = useState<Set<string>>(new Set());
  const {
    data: syncedObjects,
    isLoading,
    mutate,
  } = useSWR<Array<SyncedObject>>(user ? "/api/records" : null, fetcher, {
    fallbackData: [],
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  const toggleRow = (rowId: string) => {
    const newExpandedRows = new Set(expandedRow);
    if (newExpandedRows.has(rowId)) {
      newExpandedRows.delete(rowId);
    } else {
      newExpandedRows.add(rowId);
    }
    setExpandedRows(newExpandedRows);
  }


  return (
    <div className="py-3">
      <table className="w-full text-sm table-fixed">
        <thead className="border-b bg-muted">
          <tr>
            <th className="p-2 rounded-tl-md">id</th>
            <th className="p-2">external id</th>
            <th className="p-2">created at</th>
            <th className="p-2 rounded-tr-md">updated at</th>
          </tr>
        </thead>
        <tbody>
          {
            syncedObjects?.map((syncedObject) => {
              return (
                <>
                  <tr className={expandedRow.has(syncedObject.id) ? "" : "border-b"} key={syncedObject.id}>
                    <td className="text-sm p-2 text-center flex flex-row space-x-1">
                      <ChevronDown className={expandedRow.has(syncedObject.id) ? "rotate-180" : ""} onClick={() => toggleRow(syncedObject.id)} />
                      {syncedObject.id}
                    </td>
                    <td className="text-sm p-2 text-center overflow-clip">{syncedObject.externalId}</td>
                    <td className="p-2 text-center">{new Date(syncedObject.createdAt.toString()).toString().split("GMT")[0]}</td>
                    <td className="p-2 text-center">{new Date(syncedObject.updatedAt.toString()).toString().split("GMT")[0]}</td>
                  </tr>
                  {expandedRow.has(syncedObject.id) &&
                    <tr key={syncedObject.id + "data"} className="border-b">
                      <td colSpan={4}>
                        <div className="flex space-x-0">
                          <div className="basis-2/3">
                            <div className="font-semibold">Data: </div>
                            <pre className="outline outline-offset-4 rounded-md m-4 p-2 whitespace-pre-wrap break-all text-xs bg-muted border-b">
                              {formatJson(syncedObject.data?.toString() ?? "no data")}
                            </pre>
                          </div>
                          <div className="flex flex-col basis-1/3">
                            <div className="font-semibold">Permissions: </div>
                            <Button
                              variant="outline"
                              size={"sm"}
                              className="ml-4 mt-2 bg-indigo-700"
                            >
                              Check Permissions
                            </Button>
                            <pre className="w-full h-full outline outline-offset-4 rounded-md m-4 p-2 whitespace-pre-wrap break-all text-xs bg-muted border-b">
                            </pre>
                          </div>
                        </div>
                      </td>
                    </tr >
                  }
                </>
              )
            })
          }
        </tbody>
      </table>
    </div >
  );
}
