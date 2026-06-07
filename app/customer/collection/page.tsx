"use client";

import { useState } from "react";
import Link from "next/link";
import { useAssets, useReports } from "@/hooks/useData";
import { AssetCard } from "@/components/assets/AssetCard";
import { Button } from "@/components/ui/Button";
import { Chips } from "@/components/ui/Chips";
import { Input, Select } from "@/components/ui/FormField";
import { calcMarketValue } from "@/lib/utils";

const FILTERS = ["All", "Gold", "Silver", "Platinum", "Diamond"].map((v) => ({ label: v, value: v }));
const SORT_OPTIONS = [
  { value: "value", label: "Sort: By Value" },
  { value: "date", label: "Sort: By Date Added" },
  { value: "name", label: "Sort: By Name" },
];

export default function CollectionPage() {
  const { assets } = useAssets();
  const { reports } = useReports();
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("value");
  const [search, setSearch] = useState("");

  let list = assets.slice();
  if (filter !== "All") list = list.filter((a) => a.metal.toLowerCase().includes(filter.toLowerCase()));
  if (search) list = list.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()));
  if (sort === "value") list.sort((a, b) => calcMarketValue(b) - calcMarketValue(a));
  if (sort === "date") list.sort((a, b) => b.created_at.localeCompare(a.created_at));
  if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h3 className="font-serif text-[22px]">My Collection</h3>
        <Link href="/customer/add-asset"><Button size="sm">➕ Add Asset</Button></Link>
      </div>

      <div className="flex gap-4 flex-wrap items-center mb-5">
        <Chips options={FILTERS} active={filter} onChange={setFilter} />
        <Select className="w-auto" value={sort} onChange={(e) => setSort(e.target.value)}>
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </Select>
        <Input
          className="flex-1 min-w-[160px] max-w-[280px]"
          placeholder="🔍 Search assets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {list.length ? (
        <div className="grid grid-cols-4 gap-5 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
          {list.map((a) => {
            const rep = reports.find((r) => r.asset_id === a.asset_id);
            return (
              <AssetCard
                key={a.asset_id}
                asset={a}
                appraisedValue={rep?.appraised_value}
                onClick={() => {}}
                onRequestService={() => {}}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-[var(--muted)]">
          <div className="text-[54px] mb-3.5 opacity-50">💍</div>
          <p>No assets match your filters.</p>
        </div>
      )}
    </div>
  );
}