"use client";
import { useEffect } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { SyncedObject } from "@/db/schema";
import { ChevronDown } from "lucide-react";

export function SyncedObjectsView({ user, selectedSource }: { user: object | undefined | null, selectedSource: { name: string, type: string, icon: string | undefined } }) {
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
  console.log(syncedObjects);

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
                <tr className="border-b">
                  <td className="text-sm p-2 text-center flex flex-row space-x-1"><ChevronDown />{syncedObject.id}</td>
                  <td className="text-sm p-2 text-center overflow-clip">{syncedObject.externalId}</td>
                  <td className="p-2 text-center">{new Date(syncedObject.createdAt.toString()).toString().split("GMT")[0]}</td>
                  <td className="p-2 text-center">{new Date(syncedObject.updatedAt.toString()).toString().split("GMT")[0]}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  );
}
