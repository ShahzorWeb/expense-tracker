"use client";

import dynamic from "next/dynamic";

const InsightsChart = dynamic(() => import("./InsightsChart"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[320px]">
      <p className="text-sm text-neutral-500">Loading chart...</p>
    </div>
  ),
});

interface ChartDataItem {
  name: string;
  value: number;
}

export default function InsightsChartWrapper({ data }: { data: ChartDataItem[] }) {
  return <InsightsChart data={data} />;
}
