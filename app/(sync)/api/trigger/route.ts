import { userWithToken } from "@/app/(auth)/auth";
import { createActivity, getUser } from "@/db/queries";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const integration = request.nextUrl.searchParams.get("integration");
	const session = await userWithToken();

	if (!session || !session.user) {
		return Response.json("Unauthorized!", { status: 401 });
	}

	const user = await getUser(session.user.email);
	if (user.length === 0) {
		return Response.json("No user found", { status: 500 });
	}

	try {
		const request = await fetch(`${process.env.MANAGED_SYNC_URL}/sync`, {
			headers: {
				"Authorization": `Bearer ${process.env.MANAGED_SYNC_JWT}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				integration: integration,
				//FIX:hardcoded for now
				pipeline: "files",
				configuration: {},
			}),
		});

		const response = await request.json();

		const activity = await createActivity({
			event: "sync_triggered",
			source: integration ?? "",
			// TODO: Check that synced_at is the time of webhook OR time of initial sync
			receivedAt: new Date(),
			data: "{}",
			userId: session.user.id,
		});
		console.log(`[SYNC TRIGGER] successfully logged activity ${activity}`);
		return Response.json({ message: response.status });
	} catch (error) {
		console.error("[WEBHOOK] failed to create activity");
		return Response.json({ message: error });
	}

}
