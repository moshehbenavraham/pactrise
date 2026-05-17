import { Task, useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar, LinkIcon } from "lucide-react";
import { formatDistanceToNow, isPast, parseISO } from "date-fns";

interface TaskItemProps {
  task: Task;
  onClick?: () => void;
}

const priorityColors: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  low: "bg-muted text-muted-foreground border-border",
};

export function TaskItem({ task, onClick }: TaskItemProps) {
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const overdue = task.due_date && !task.completed && isPast(parseISO(task.due_date));

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 focus-within:bg-muted/50 ${
        task.completed ? "opacity-60" : ""
      }`}
    >
      <Checkbox
        checked={task.completed}
        onCheckedChange={(checked) =>
          updateTask.mutate({ id: task.id, completed: !!checked })
        }
        aria-label={
          task.completed
            ? `Mark "${task.title}" as not done`
            : `Mark "${task.title}" as done`
        }
        className="mt-0.5"
      />
      <button
        type="button"
        onClick={onClick}
        aria-label={`Open task: ${task.title}`}
        className="flex-1 min-w-0 text-left rounded-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <p className={`text-sm font-medium ${task.completed ? "line-through" : ""}`}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {task.description}
          </p>
        )}
        <span className="flex items-center gap-2 mt-1.5 flex-wrap">
          <Badge
            variant="outline"
            className={`text-[10px] ${priorityColors[task.priority] || ""}`}
          >
            {task.priority}
          </Badge>
          {task.due_date && (
            <span
              className={`flex items-center gap-1 text-[11px] ${
                overdue ? "text-destructive font-medium" : "text-muted-foreground"
              }`}
            >
              <Calendar aria-hidden="true" className="h-3 w-3" />
              {formatDistanceToNow(parseISO(task.due_date), { addSuffix: true })}
            </span>
          )}
          {(task.deals || task.contacts) && (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <LinkIcon aria-hidden="true" className="h-3 w-3" />
              {task.deals?.title ||
                `${task.contacts?.first_name} ${task.contacts?.last_name}`}
            </span>
          )}
        </span>
      </button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0"
        onClick={() => deleteTask.mutate(task.id)}
        aria-label={`Delete task: ${task.title}`}
      >
        <Trash2 aria-hidden="true" className="h-3.5 w-3.5 text-muted-foreground" />
      </Button>
    </div>
  );
}
