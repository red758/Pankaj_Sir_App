//SSG test

import Link from "next/link";
interface Post{
    id:string;
    title:string;
}

function getPosts():Post[]{
    const val = [{id:"1", title:"Hello"}, {id:"2", title:"Bye"}, {id:"3", title:"Good"}];
    return val;
}

export default function BlogPage(){
    const posts = getPosts();
    
    return(
        <main className="flex flex-col justify-center items-center gap-4">
            <h1>Our Blog</h1>
            <ul className="font-bold border-2 p-4">
                {posts.map((post)=>(
                    <li className="border-1 m-2 p-2" key={post.id}>{post.title}</li>
                ))}
            </ul>

        <Link href="/">
            <button className="border border-red-500 rounded-xl p-4 mt-5">Click to go at default page</button>
        </Link>
        </main>
    );
}