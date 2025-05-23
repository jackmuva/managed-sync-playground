import { userWithToken } from "@/app/(auth)/auth";
import { getSyncedObjectByUserIdAndSource, getUser } from "@/db/queries";

export async function GET() {
	//TODO: get source from request
	const session = await userWithToken();
	if (!session || !session.user) {
		return Response.json("Unauthorized!", { status: 401 });
	}

	const user = await getUser(session.user.email);
	if (user.length === 0) {
		return Response.json("No user found", { status: 500 });
	}

	const records = await getSyncedObjectByUserIdAndSource({ id: user[0].id, source: "googledrive" });
	return Response.json(records);
}
