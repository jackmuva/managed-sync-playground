"use client";
import { useEffect } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";

export function RecordView({ user, selectedSource }: { user: object | undefined | null, selectedSource: { name: string, type: string, icon: string | undefined } }) {
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
  );
}
