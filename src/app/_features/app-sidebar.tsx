"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type HistoryItem = {
  id: string;
  title: string;
  createdAt: string;
};

function groupByDate(items: HistoryItem[]) {
  const today: HistoryItem[] = [];
  const yesterday: HistoryItem[] = [];
  const last7Days: HistoryItem[] = [];
  const last30Days: HistoryItem[] = [];
  const older: HistoryItem[] = [];

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  const sevenDaysAgo = new Date(startOfToday);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const thirtyDaysAgo = new Date(startOfToday);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  items.forEach((item) => {
    const created = new Date(item.createdAt);

    if (created >= startOfToday) {
      today.push(item);
    } else if (created >= startOfYesterday) {
      yesterday.push(item);
    } else if (created >= sevenDaysAgo) {
      last7Days.push(item);
    } else if (created >= thirtyDaysAgo) {
      last30Days.push(item);
    } else {
      older.push(item); // 👈 ЭНЭ Л ЧУХАЛ
    }
  });

  return { today, yesterday, last7Days, last30Days, older };
}

/* ----------------------------------------
   Sidebar
----------------------------------------- */
export function AppSidebar() {
  const [open, setOpen] = React.useState(false);
  const [history, setHistory] = React.useState<HistoryItem[]>([]);
  const [loading, setLoading] = React.useState(false);

  const router = useRouter();

  React.useEffect(() => {
    if (!open) return;

    setLoading(true);

    fetch("/api/history")
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .finally(() => setLoading(false));
  }, [open]);

  const grouped = React.useMemo(() => groupByDate(history), [history]);

  return (
    <div
      className={`h-full py-5 flex flex-col transition-all duration-200
        ${open ? "w-72 px-4 bg-white" : "w-16 items-center bg-background"}`}
    >
      {!open && (
        <button onClick={() => setOpen(true)} className="mb-4">
          <LuPanelLeftOpen size={24} />
        </button>
      )}

      {open && (
        <div className="flex flex-col flex-1 overflow-auto w-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-semibold text-xl">History</h1>
            <button onClick={() => setOpen(false)}>
              <LuPanelLeftClose size={24} />
            </button>
          </div>

          {loading && (
            <>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex flex-col gap-4 mb-3">
                  <Skeleton className="h-4 w-24" />
                  {[...Array(3)].map((_, j) => (
                    <Skeleton key={j} className="h-8 w-full rounded-md" />
                  ))}
                </div>
              ))}
            </>
          )}

          {!loading && (
            <div className="flex flex-col gap-4">
              {grouped.today.length > 0 && (
                <Section
                  title="Today"
                  items={grouped.today}
                  onClick={router.push}
                />
              )}

              {grouped.yesterday.length > 0 && (
                <Section
                  title="Yesterday"
                  items={grouped.yesterday}
                  onClick={router.push}
                />
              )}

              {grouped.last7Days.length > 0 && (
                <Section
                  title="Last 7 days"
                  items={grouped.last7Days}
                  onClick={router.push}
                />
              )}

              {grouped.last30Days.length > 0 && (
                <Section
                  title="Last 30 days"
                  items={grouped.last30Days}
                  onClick={router.push}
                />
              )}
              {grouped.older.length > 0 && (
                <Section
                  title="Older"
                  items={grouped.older}
                  onClick={router.push}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------
   Section component
----------------------------------------- */
function Section({
  title,
  items,
  onClick,
}: {
  title: string;
  items: HistoryItem[];
  onClick: (path: string) => void;
}) {
  return (
    <section className="flex flex-col gap-1">
      <p className="text-xs text-muted-foreground px-2">{title}</p>

      {items.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          onClick={() => onClick(`/article/${item.id}`)}
          className="w-full justify-start truncate"
        >
          {item.title}
        </Button>
      ))}
    </section>
  );
}
