import { NextResponse } from "next/server";
import { ZodError } from "zod";

export type ApiErrorBody = {
  error: string;
  fields?: Record<string, string[]>;
};

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function jsonError(
  status: number,
  error: string,
  fields?: Record<string, string[]>
) {
  const body: ApiErrorBody = fields ? { error, fields } : { error };
  return NextResponse.json(body, { status });
}

export function fromZodError(error: ZodError) {
  const fields: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_form";
    fields[key] ??= [];
    fields[key].push(issue.message);
  }
  return jsonError(400, "Validation failed", fields);
}
