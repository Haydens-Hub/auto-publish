import Post from "@/models/Post";
import { ConnectToDB } from "@/lib/dbConn";

const getPosts = async () => {
  await ConnectToDB();
  const posts = await Post.find();
  // returns the posts while turning the dates into strings
  return posts.map((post) => ({
    ...post.toObject(),
    date: post.date instanceof Date ? post.date.toISOString() : post.date,
  }));
};
export default async function Overview() {
  const posts = await getPosts();
  console.log(posts);
  return (
    <div className="min-h-full">
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16"></div>
      </nav>
      {/* Placeholder for header*/}
      <header className="relative bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Overview
          </h1>
        </div>
      </header>
      <main>
        {/*Main content*/}
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {
            <section className="text-gray-600 body-font overflow-hidden">
              <div className="container px-5 py-24 mx-auto">
                <div className="-my-8 divide-y-2 divide-gray-100">
                  {/*maps through posts to display the authors name, the post category, date and idea description*/}
                  {posts.map((post) => (
                    <div
                      key={post._id}
                      className="py-8 flex flex-wrap md:flex-nowrap"
                    >
                      <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                        <span className="font-semibold title-font text-gray-700">
                          {post.name}
                        </span>
                        <span className="mt-1 text-gray-500 text-sm">
                          {post.category}
                        </span>
                        <span className="mt-1 text-gray-500 text-sm">
                          {post.date}
                        </span>
                      </div>
                      <div className="md:flex-grow">
                        <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">
                          {}
                        </h2>
                        <p className="leading-relaxed">
                          {post.ideaDescription}
                        </p>
                        <a
                          className="text-indigo-500 inline-flex items-center mt-4"
                          href={`/overview/${post._id}`}
                        >
                          More details
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          }
        </div>
      </main>
      {/* End of main content*/}
    </div>
  );
}
