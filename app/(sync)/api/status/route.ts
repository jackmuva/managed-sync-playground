import { userWithToken } from "@/app/(auth)/auth";
import { getSyncTriggerByUserIdAndSource, getUser } from "@/db/queries";
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
	if (!integration) {
		return Response.json("Integration Needed", { status: 500 });
	}

	try {
		const trigger = await getSyncTriggerByUserIdAndSource({ id: user[0].id, source: integration });
		const request = await fetch(`${process.env.MANAGED_SYNC_URL}/sync/${trigger[0].id}`, {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${process.env.MANAGED_SYNC_JWT}`,
			},
		});

		const response = await request.json();
		console.log(response);

		console.log(`[SYNC_STATUS] successfully checked: ${trigger[0].id}`);
		return Response.json({ status: response });
	} catch (error) {
		console.error("[SYNC_TRIGGER] failed to create activity");
		return Response.json({ message: error });
	}

}
