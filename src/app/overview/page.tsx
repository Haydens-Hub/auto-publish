import Post from "@/models/Post";
import { ConnectToDB } from "@/lib/dbConn";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

const POSTS_PER_PAGE = 5;

const getPosts = async (page: number) => {
  await ConnectToDB();
  
  const skip = (page - 1) * POSTS_PER_PAGE;
  
  // Fetch posts with pagination, sorted by date (oldest first)
  const posts = await Post.find()
    .sort({ date: 1 }) // 1 for ascending (oldest first), -1 for descending
    .skip(skip)
    .limit(POSTS_PER_PAGE);
  
  // Get total count for pagination controls
  const totalPosts = await Post.countDocuments();
  
  return {
    posts: posts.map((post) => ({
      ...post.toObject(),
      _id: post._id.toString(),
      date: post.date instanceof Date ? post.date.toISOString() : post.date,
    })),
    totalPages: Math.ceil(totalPosts / POSTS_PER_PAGE),
    currentPage: page,
    totalPosts,
  };
};

export default async function Overview({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = Number(searchParams.page) || 1;
  const { posts, totalPages, totalPosts } = await getPosts(currentPage);
  
  console.log(posts);
  
  return (
    <div className="min-h-full">
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16"></div>
      </nav>
      {/* Placeholder for header*/}
      <header className="relative bg-white shadow-sm w-full">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-stretch w-full">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Overview
          </h1>
          <LogoutButton />
        </div>
      </header>
      <main>
        {/*Main content*/}
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <section className="text-gray-600 body-font overflow-hidden">
            <div className="container px-5 py-24 mx-auto">
              <div className="-my-8 divide-y-2 divide-gray-100">
                {posts.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    No posts found.
                  </div>
                ) : (
                  posts.map((post) => (
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
                          {new Date(post.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="md:flex-grow">
                        <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">
                          {post.title}
                        </h2>
                        <p className="leading-relaxed">
                          {post.ideaDescription}
                        </p>
                        <Link
                          className="text-indigo-500 inline-flex items-center mt-4 hover:text-indigo-600"
                          href={`/overview/${post._id}`}
                        >
                          More details
                          <svg
                            className="w-4 h-4 ml-2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 12h14"></path>
                            <path d="M12 5l7 7-7 7"></path>
                          </svg>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-8">
                  <div className="flex flex-1 justify-between sm:hidden">
                    {/* Mobile pagination */}
                    {currentPage > 1 ? (
                      <Link
                        href={`/overview?page=${currentPage - 1}`}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Previous
                      </Link>
                    ) : (
                      <span className="relative inline-flex items-center rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
                        Previous
                      </span>
                    )}
                    {currentPage < totalPages ? (
                      <Link
                        href={`/overview?page=${currentPage + 1}`}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Next
                      </Link>
                    ) : (
                      <span className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
                        Next
                      </span>
                    )}
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{" "}
                        <span className="font-medium">
                          {(currentPage - 1) * POSTS_PER_PAGE + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {Math.min(currentPage * POSTS_PER_PAGE, totalPosts)}
                        </span>{" "}
                        of <span className="font-medium">{totalPosts}</span> posts
                      </p>
                    </div>
                    <div>
                      <nav
                        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                        aria-label="Pagination"
                      >
                        {currentPage > 1 ? (
                          <Link
                            href={`/overview?page=${currentPage - 1}`}
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                          >
                            <span className="sr-only">Previous</span>
                            <svg
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </Link>
                        ) : (
                          <span className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-300 ring-1 ring-inset ring-gray-300 cursor-not-allowed">
                            <span className="sr-only">Previous</span>
                            <svg
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        )}
                        
                        <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300">
                          Page {currentPage} of {totalPages}
                        </span>
                        
                        {currentPage < totalPages ? (
                          <Link
                            href={`/overview?page=${currentPage + 1}`}
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                          >
                            <span className="sr-only">Next</span>
                            <svg
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </Link>
                        ) : (
                          <span className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-300 ring-1 ring-inset ring-gray-300 cursor-not-allowed">
                            <span className="sr-only">Next</span>
                            <svg
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        )}
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      {/* End of main content*/}
    </div>
  );
}