"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { AssetCard } from "@/components/assets/AssetCard";
import { Chips } from "@/components/ui/Chips";
import { Input } from "@/components/ui/FormField";
import { calcMarketValue } from "@/lib/utils";

export default function AdminRegistryPage() {
  const { db, reportByAsset } = useApp();
  const router = useRouter();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  let list = db.assets.slice();
  if (filter !== "All") list = list.filter((a) => a.metal.toLowerCase().includes(filter.toLowerCase()));
  if (search) list = list.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()) || a.asset_id.toLowerCase().includes(search.toLowerCase()));
  list.sort((a, b) => calcMarketValue(b) - calcMarketValue(a));

  return (
    <div>
      <h3 className="font-serif text-[22px] mb-4">Asset Registry</h3>
      <div className="flex gap-4 flex-wrap items-center mb-5">
        <Chips options={["All", "Gold", "Silver", "Platinum", "Diamond"].map((v) => ({ label: v, value: v }))} active={filter} onChange={setFilter} />
        <Input className="w-auto flex-1 min-w-[160px] max-w-[280px]" placeholder="🔍 Search assets…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {list.length ? (
        <div className="grid grid-cols-4 gap-5 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
          {list.map((a) => {
            const rep = reportByAsset(a.asset_id);
            return (
              <AssetCard key={a.asset_id} asset={a} appraisedValue={rep?.appraised_value}
                showCta={false} onClick={() => router.push(`/admin/customers`)} />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-[var(--muted)]">
          <div className="text-[54px] mb-3.5 opacity-50">💎</div>
          <p>No assets match your filters.</p>
        </div>
      )}
    </div>
  );
}
