import { ConnectToDB, getPostById } from "@/lib/dbConn";
{
  /*Set up Parameters, connnect to DB and fetch specific post*/
}
import { DeletePostButton } from "@/components/DeletePostButton";
import { BackButton } from "@/components/BackButton";
import { DownloadArticle } from "@/components/DownloadArticle";
import { PublishPostButton } from "@/components/PublishPostButton";
type Params = { id: string };

export default async function DetailsPage({ params }: { params: Params }) {
  await ConnectToDB();
  const { id } = await params;
  
  const post = await getPostById(id);
  
  if (!post) {
    return (
      <div>
        <h1>Post not found</h1>
      </div>
    );
  }

  type Field = {
    label: string;
    value: string; //needs to be updated for file support
  };

  const fields: Field[] = [
    { label: "Name", value: post.name },
    { label: "Email Address", value: post.email },
    { label: "Author Title", value: post.authorTitle },
    { label: "Submission Type", value: post.submissionType },
    { label: "Idea Description", value: post.ideaDescription },
    { label: "Motivation", value: post.motivation },
    { label: "Draft File", value: "draft file placeholder" },
    { label: "Category", value: post.category },
    { label: "Article File", value: "article file placeholder" },
    { label: "Title", value: post.title },
    { label: "References", value: post.references },
    { label: "Abstract", value: post.abstract },
    { label: "Summary", value: post.summary },
    { label: "Reflection", value: post.reflection },
    { label: "Short Blurb", value: post.shortblurb },
    { label: "Signature", value: post.signature },
    { label: "Additional Questions", value: post.questions },
  ];


  return (
    <div className="min-h-full">
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16"></div>
      </nav>
      {/* Placeholder for header*/}
      <header className="relative bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Post Details
          </h1>
        </div>
      </header>
      <main>
        {/* main content*/}
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {
            <section className="text-gray-600 body-font overflow-hidden">
              <div className="container px-5 py-24 mx-auto">
                <div>
                  <div className="px-4 sm:px-0">
                    <h2 className="text-base/7 font-semibold text-gray-900">
                      Post Information
                    </h2>
                    <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">
                      Date: {post.date}
                    </p>
                  </div>
                  <div className="mt-6 border-t border-gray-100">
                    <dl className="divide-y divide-gray-100">
                      {fields.map(({ label, value }) => {
                        if (label === "Article File") {
                          // handle downloading for articleFile
                          return (
                            <div
                              key={label}
                              className="x-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
                            >
                              <dt className="text-sm font-medium text-gray-900">
                                {label}
                              </dt>
                              <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                                <DownloadArticle
                                  id={post._id.toString()}
                                  filetype="articleFile"
                                />
                              </dd>
                            </div>
                          );
                        } else if (label === "Draft File") {
                          // handle downloading for draftFile
                          return (
                            <div
                              key={label}
                              className="x-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
                            >
                              <dt className="text-sm font-medium text-gray-900">
                                {label}
                              </dt>
                              <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                                <DownloadArticle
                                  id={post._id.toString()}
                                  filetype="draftFile"
                                />
                              </dd>
                            </div>
                          );
                        }

                        // Default render for other fields
                        return (
                          <div
                            key={label}
                            className="x-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
                          >
                            <dt className="text-sm font-medium text-gray-900">
                              {label}
                            </dt>
                            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                              {value}
                            </dd>
                          </div>
                        );
                      })}
                    </dl>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex justify-end gap-x-6">
                    <BackButton />
                    <DeletePostButton id={post._id.toString()} />
                    <PublishPostButton id={post._id.toString()} />
                  </div>
                </div>
              </div>
            </section>
          }
        </div>
      </main>
      {/* end of main content*/}
    </div>
  );
}
