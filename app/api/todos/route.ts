import { NextResponse, type NextRequest } from "next/server";
import { CreateTodoSchema } from "@/lib/validation";
import type { Todo } from "@/types/todo";
import { db } from "@/lib/db";
import { todos } from "@/lib/db/schema";
import { desc, ilike, eq, sql } from "drizzle-orm";

// [GET] /api/todos?search=&limit=20&offset=0
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = (searchParams.get("search") || "").trim();
  const limit = Number(searchParams.get("limit") || 20);
  const offset = Number(searchParams.get("offset") || 0);

  try {
    const where = search ? ilike(todos.title, `%${search}%`) : undefined;

    const [rows, countResult] = await Promise.all([
      db
        .select()
        .from(todos)
        .where(where)
        .orderBy(desc(todos.created_at))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(todos)
        .where(where),
    ]);

    return NextResponse.json<{
      data: Todo[];
      count: number;
      limit: number;
      offset: number;
    }>({
      data: rows as Todo[],
      count: countResult[0].count,
      limit,
      offset,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// [POST] /api/todos
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const parsed = CreateTodoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { title, done = false } = parsed.data;

  try {
    const [row] = await db.insert(todos).values({ title, done }).returning();
    return NextResponse.json<{ data: Todo }>({ data: row as Todo }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// [PATCH] /api/todos?id=<todo_id>
export async function PATCH(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing todo id" }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = CreateTodoSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { title, done } = parsed.data;

  try {
    const [row] = await db
      .update(todos)
      .set({ title, done })
      .where(eq(todos.id, id))
      .returning();

    if (!row) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json<{ data: Todo }>({ data: row as Todo });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// [DELETE] /api/todos?id=<todo_id>
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing todo id" }, { status: 400 });
  }

  try {
    const [row] = await db
      .delete(todos)
      .where(eq(todos.id, id))
      .returning({ id: todos.id });

    if (!row) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
