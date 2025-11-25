import { NextResponse } from "next/server";
import { ResendService } from "@/infrastructure/email/ResendService";
import { supportSchema } from "@/shared/validations/supportSchema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = supportSchema.parse(body);

    await ResendService.sendSupportEmail(data);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error interno del servidor";

    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
