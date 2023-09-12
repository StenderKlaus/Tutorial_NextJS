import type { Metadata } from 'next'
import getAllUsers from '@/lib/getAllUsers'
import Link from "next/link"

export const metadata: Metadata = {
    title: 'Users',
}

  /// since this is a server Component so it won't need to fetch dynamically but the fetch that is Happening in lib/getAllUsers file will be fetched and used automatically during the build of the App 
  /// the type of User is in the types.d.ts file

  /// da es sich um eine Serverkomponente handelt, muss sie nicht dynamisch abgerufen werden, sondern der Abruf, der in der Datei lib/getAllUsers stattfindet, wird automatisch während der Erstellung der App abgerufen und verwendet 
  /// der Typ des Benutzers ist in der Datei types.d.ts

export default async function UsersPage() {
    const usersData: Promise<User[]> = getAllUsers()

    const users = await usersData

    //console.log('Hello') 
    // Did you find where this appears?
    // the clg result will show in the terminal because it's a server Component just like if we were working in the Backend

    // Haben Sie herausgefunden, wo dies erscheint?
    // das clg-Ergebnis wird im Terminal angezeigt, da es sich um eine Serverkomponente handelt, genau wie wenn wir im Backend arbeiten würden.
    
    const content = (
        <section>
            <h2>
                <Link href="/">Back to Home</Link>
            </h2>
            <br />
            {users.map(user => {
                return (
                    <>
                        <p key={user.id}>
                            <Link href={`/users/${user.id}`}>{user.name}</Link>
                        </p>
                        <br />
                    </>
                )
            })}
        </section>
    )

    return content
}