import getUser from "@/lib/getUser"
import getUserPosts from "@/lib/getUserPosts"
import getAllUsers from "@/lib/getAllUsers"
import { Suspense } from "react"
import UserPosts from "./components/UserPosts"
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'


//// the Brackets in the folder Name is to createa dynamic Route for each user based on the id 
/// the user ID will be accessed through the Params of the URL

/// die Klammern im Ordnernamen dienen dazu, eine dynamische Route für jeden Benutzer basierend auf der ID zu erstellen 
/// Die Benutzer-ID wird über die Params der URL abgerufen


type Params = {
    params: {
        userId: string
    }
}

// this function create the meta data for each dynamically routed user page using the params and makes it different for each user 

// diese Funktion erstellt die Metadaten für jede dynamisch weitergeleitete Benutzerseite unter Verwendung der Parameter und macht sie für jeden Benutzer unterschiedlich


export async function generateMetadata({ params: { userId } }: Params): Promise<Metadata> {
    const userData: Promise<User> = getUser(userId)
    const user: User = await userData

    if (!user.name) {
        return {
        title: "User Not Found"
    }
}
    return {
        title: user.name,
        description: `This is the page of ${user.name}`
    }

}

export default async function UserPage({ params: { userId } }: Params) {

    ///// notice that we are't using the await keyword here in both of these two functions, we will use it later to resolve the Promise of each function at the same time using Promise.all to fetch them together, this is  because we want them to fetch in parallel to avoid waterfalls 
    ///// Beachten Sie, dass wir das Schlüsselwort await hier in diesen beiden Funktionen nicht verwenden. Wir werden es später verwenden, um das Versprechen jeder Funktion gleichzeitig aufzulösen, indem wir Promise.all verwenden, um sie zusammen abzurufen, da wir sie parallel abrufen wollen, um Wasserfälle zu vermeiden.

    const userData: Promise<User> = getUser(userId)
    const userPostsData: Promise<Post[]> = getUserPosts(userId)

    // If not progressively rendering with Suspense, use Promise.all
    //const [user, userPosts] = await Promise.all([userData, userPostsData])
        ///this makes the fetching of both functions together and saves the result of the first function userData in the first const of the array IE: user, and saves the result of the second function userPostsData in the second const of the array IE: userPosts
        ///Below is the way we use it with the Suspense
        ///das macht das Abholen der beiden Funktionen zusammen und speichert das Ergebnis der ersten Funktion userData in der ersten Konstante des Arrays IE: user, und speichert das Ergebnis der zweiten Funktion userPostsData in der zweiten Konstante des Arrays IE: userPosts
        ///Nachfolgend sehen Sie, wie wir es mit der Suspense verwenden

        
    const user = await userData

    if (!user.name) {
        return notFound()
    }

    return (
        <>
            <h2>{user.name}</h2>
            <br />

        {/* this is  the one approach in Next  when normally fetching or using Promise.all like above but a second approach is to use suspense  to improve Performance by incrementally rendering a Page and show it to the user while the rest of the page Content loads/}
        Supence applies to a part of a page or a component but when creating a Loading.tsx file it will apply to all the page or the component inside of the component
        {/* <UserPosts posts={userPosts}*/}
        {/* das ist der eine Ansatz in Next, wenn man normalerweise fetching oder Promise.all wie oben verwendet, aber ein zweiter Ansatz ist die Verwendung von Suspence, um die Leistung zu verbessern, indem eine Seite inkrementell gerendert und dem Benutzer angezeigt wird, während der Rest der Seite den Inhalt lädt/}
        Suspence gilt für einen Teil einer Seite oder einer Komponente, aber wenn man eine Loading.tsx Datei erstellt, gilt sie für die gesamte Seite oder die Komponente innerhalb der Komponente
        {/* <UserPosts posts={userPosts}*/}


            <Suspense fallback={<h2>Loading...</h2>}>
                
                <UserPosts promise={userPostsData} />
            </Suspense>
        </>
    )
}

export async function generateStaticParams() {
    const usersData: Promise<User[]> = getAllUsers();
    const users = await usersData

    return users.map(user => ({
         userId: user.id.toString() 
        }
        ))
}