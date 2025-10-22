import Post from "@/models/Post";
import { ConnectToDB } from "@/lib/dbConn";

export async function POST(request: Request) {
  const data = await request.json();
  console.log(data);

  ConnectToDB();

  const dummy = new Post(data);
  console.log("added");
  await dummy.save();
}
