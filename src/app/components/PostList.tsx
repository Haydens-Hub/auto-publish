export default async function PostList() {

    return (
      {posts.map((post:any)=>(
        <div className="py-8 flex flex-wrap md:flex-nowrap">
        <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
          <span className="font-semibold title-font text-gray-700">{post.name}</span>
          <span className="mt-1 text-gray-500 text-sm">{post.category}</span>
          <span className="mt-1 text-gray-500 text-sm">{post.date}</span>
        </div>
        <div className="md:flex-grow">
          <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">{}</h2>
          <p className="leading-relaxed">{post.ideaDescription}</p>
          <a className="text-indigo-500 inline-flex items-center mt-4">More details
          </a>
        </div>
      </div>
      ))}  
  )
}