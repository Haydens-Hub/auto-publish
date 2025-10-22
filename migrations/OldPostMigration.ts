import { ConnectToDB, CloseConnection } from "@/lib/dbConn";
import Post from "@/models/Post";

//This script will initialize a Post Collection on your local MongoDB connection
//with one dummy post
const PostMigration = async () => {
  await ConnectToDB();

  // Insert a dummy document
  const dummy = new Post({
    AuthorName: "temp",
    email: "temp@example.com",
    Title: "temp",
    Category: "temp",
    Abstract: "temp",
    Body: "temp",
    Conclusion: "temp",
    Author_Background: "temp",
  });
  console.log("added");
  await dummy.save();
  await Post.init();

  await CloseConnection();
};

PostMigration();
