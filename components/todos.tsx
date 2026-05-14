"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  listTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "@/lib/client-todos";
import type { Todo } from "@/types/todo";

export default function TodosPage() {
  const [items, setItems] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  async function refresh() {
    setItems(await listTodos({ limit: 50 }));
  }

  useEffect(() => {
    void refresh();
  }, []);

  // ------- Optimistic helpers -------
  function withRollback(
    next: Todo[] | ((prev: Todo[]) => Todo[]),
    action: () => Promise<any>,
  ) {
    const prev = items;
    const nextItems = typeof next === "function" ? (next as any)(prev) : next;
    setItems(nextItems);
    return action().catch((err) => {
      setItems(prev);
      throw err;
    });
  }

  const tempId = () => `optimistic-${Math.random().toString(36).slice(2)}`;

  const findIndex = (arr: Todo[], id: string) =>
    arr.findIndex((t) => t.id === id);

  // ------- Actions (optimistic) -------
  async function onAdd() {
    if (!title.trim()) return;
    const temp: Todo = {
      id: tempId(),
      title: title.trim(),
      done: false,
      created_at: new Date().toISOString(),
    };
    // push temp immediately
    await withRollback(
      (prev) => [temp, ...prev],
      async () => {
        const created = await createTodo(temp.title);
        // swap temp with real row
        setItems((prev) => {
          const idx = findIndex(prev, temp.id);
          if (idx === -1) return prev;
          const copy = [...prev];
          copy[idx] = created;
          return copy;
        });
      },
    );
    setTitle("");
  }

  async function onToggle(id: string, nextDone: boolean) {
    const idx = findIndex(items, id);
    if (idx === -1) return;
    const current = items[idx];
    await withRollback(
      (prev) => {
        const copy = [...prev];
        copy[idx] = { ...current, done: nextDone };
        return copy;
      },
      async () => {
        await updateTodo(id, { done: nextDone });
      },
    );
  }

  function startEdit(t: Todo) {
    setEditingId(t.id);
    setEditTitle(t.title);
  }

  async function saveEdit() {
    if (!editingId) return;
    const idx = findIndex(items, editingId);
    if (idx === -1) return;
    const nextTitle = editTitle.trim();
    if (!nextTitle) return;

    const current = items[idx];
    await withRollback(
      (prev) => {
        const copy = [...prev];
        copy[idx] = { ...current, title: nextTitle };
        return copy;
      },
      async () => {
        await updateTodo(editingId, { title: nextTitle });
      },
    );

    setEditingId(null);
    setEditTitle("");
  }

  async function onDelete(id: string) {
    const idx = findIndex(items, id);
    if (idx === -1) return;
    await withRollback(
      (prev) => prev.filter((t) => t.id !== id),
      async () => {
        await deleteTodo(id);
      },
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-4 p-6">
      {/* Add new */}
      <div className="flex gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add todo..."
          className="flex-1"
          onKeyDown={async (e) => {
            if (e.key === "Enter") await onAdd();
          }}
        />
        <Button onClick={onAdd}>Add</Button>
      </div>

      {/* List */}
      <ul className="space-y-2">
        {items.map((t) => {
          const isEditing = editingId === t.id;
          return (
            <li
              key={t.id}
              className="flex items-center justify-between gap-3 rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                <Switch
                  checked={t.done}
                  onCheckedChange={(v) => onToggle(t.id, v)}
                />
                {isEditing ? (
                  <Input
                    autoFocus
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-[280px]"
                    onKeyDown={async (e) => {
                      if (e.key === "Enter") await saveEdit();
                      if (e.key === "Escape") {
                        setEditingId(null);
                        setEditTitle("");
                      }
                    }}
                  />
                ) : (
                  <span
                    className={
                      t.done ? "text-muted-foreground line-through" : ""
                    }
                  >
                    {t.title}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button onClick={saveEdit}>Save</Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setEditingId(null);
                        setEditTitle("");
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => startEdit(t)}>
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => onDelete(t.id)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
