"use client";
import { useEffect } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";

export function RecordView({ user, selectedSource }: { user: object | undefined | null, selectedSource: {name: string, type: string, icon: string | undefined} }) {
  const {
    data: history,
    isLoading,
    mutate,
  } = useSWR<Array<File>>(user ? "/api/records" : null, fetcher, {
    fallbackData: [],
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  return (
    <div>
      <div className="font-semibold text-lg flex items-center">Synced Records: 
        {selectedSource.icon ? <img src={selectedSource.icon} className="ml-2 w-5 h-5 mr-2" /> : null}
        {selectedSource.name}
      </div>
      <div className="py-3">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted">
            <tr>
              <th className="p-2 rounded-tl-md">id</th>
              <th className="p-2">external id</th>
              <th className="p-2">created at</th>
              <th className="p-2 rounded-tr-md">updated at</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
}
