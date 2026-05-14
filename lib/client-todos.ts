import type { Todo } from "@/types/todo";

export async function listTodos(params?: {
  limit?: number;
  offset?: number;
  search?: string;
}): Promise<Todo[]> {
  const qs = new URLSearchParams();
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.offset) qs.set("offset", String(params.offset));
  if (params?.search) qs.set("search", params.search);

  const res = await fetch(`/api/todos?${qs.toString()}`, { cache: "no-store" });
  const json = await res.json();
  return json.data as Todo[];
}

export async function createTodo(title: string): Promise<Todo> {
  const res = await fetch(`/api/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  const json = await res.json();
  return json.data as Todo;
}

export async function updateTodo(
  id: string,
  patch: Partial<Pick<Todo, "title" | "done">>,
): Promise<Todo> {
  const res = await fetch(`/api/todos?id=${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  const json = await res.json();
  return json.data as Todo;
}

export async function deleteTodo(id: string): Promise<void> {
  await fetch(`/api/todos?id=${id}`, { method: "DELETE" });
}
