import { Deal } from "@/hooks/useDeals";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { Calendar, DollarSign, GripVertical } from "lucide-react";

interface DealCardProps {
  deal: Deal;
  stageColor: string;
  onClick: () => void;
}

export function DealCard({ deal, stageColor, onClick }: DealCardProps) {
  return (
    <button
      type="button"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("dealId", deal.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      onClick={onClick}
      aria-label={`Open deal: ${deal.title}${deal.companies ? ` at ${deal.companies.name}` : ""}`}
      className="group relative block w-full cursor-pointer rounded-lg border bg-card p-3 text-left shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 h-full w-1 rounded-l-lg"
        style={{ backgroundColor: stageColor }}
      />
      <span className="block ml-2 space-y-2">
        <span className="flex items-start justify-between">
          <span className="block text-sm font-semibold leading-tight">{deal.title}</span>
          <GripVertical
            aria-hidden="true"
            className="h-4 w-4 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </span>
        {deal.companies && (
          <span className="block text-xs text-muted-foreground">{deal.companies.name}</span>
        )}
        <span className="flex items-center gap-3 text-xs text-muted-foreground">
          {deal.value > 0 && (
            <span className="flex items-center gap-1 font-medium text-foreground">
              <DollarSign aria-hidden="true" className="h-3 w-3" />
              {formatCurrency(deal.value)}
            </span>
          )}
          {deal.close_date && (
            <span className="flex items-center gap-1">
              <Calendar aria-hidden="true" className="h-3 w-3" />
              {formatDate(deal.close_date)}
            </span>
          )}
        </span>
        {deal.contacts && (
          <span className="block text-xs text-muted-foreground">
            {deal.contacts.first_name} {deal.contacts.last_name}
          </span>
        )}
      </span>
    </button>
  );
}
