"use client";

import { useEffect, useState } from "react";
import { ActionItem } from "@/lib/data";
import { StatusBadge } from "@/app/components/StatusBadge";

const completedTaskStorageKey = "meeting-hub-completed-task-ids";

function readCompletedIds() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(completedTaskStorageKey);
    return storedValue ? (JSON.parse(storedValue) as string[]) : [];
  } catch {
    return [];
  }
}

export function CompletableTaskList({ tasks }: { tasks: ActionItem[] }) {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const visibleTasks = tasks.filter((task) => !completedIds.includes(task.id));
  const completedCount = tasks.length - visibleTasks.length;

  useEffect(() => {
    setCompletedIds(readCompletedIds());
    setIsLoaded(true);
  }, []);

  function completeTask(taskId: string) {
    setCompletedIds((currentIds) => {
      const nextIds = currentIds.includes(taskId) ? currentIds : [...currentIds, taskId];
      window.localStorage.setItem(completedTaskStorageKey, JSON.stringify(nextIds));
      return nextIds;
    });
  }

  return (
    <div className="completable-tasks">
      <div className="task-progress">
        <span>未完了 {isLoaded ? visibleTasks.length : tasks.length}件</span>
        <span>完了 {isLoaded ? completedCount : 0}件</span>
      </div>

      {visibleTasks.length > 0 ? (
        <div className="task-list">
          {visibleTasks.map((task) => (
            <div className="task-row completable-task-row" key={task.id}>
              <span>
                <strong>{task.title}</strong>
                <small>担当者: {task.owner} / 期限: {task.dueDate}</small>
              </span>
              <StatusBadge status={task.status} />
              <button
                type="button"
                className="complete-button"
                onClick={() => completeTask(task.id)}
              >
                完了にする
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-task-state">
          <strong>すべて完了しました</strong>
          <span>この会議の次のアクションは残っていません。</span>
        </div>
      )}
    </div>
  );
}
