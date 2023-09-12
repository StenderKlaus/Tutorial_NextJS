export default async function getAllUsers() {
    const res = await fetch('https://jsonplaceholder.typicode.com/users')

    if (!res.ok) throw new Error('failed to fetch data')

    return res.json()
}

/// we didn't put a try and catch Blocks because we will be using Error Boundary Later
/// Wir haben keine try- und catch-Blöcke eingefügt, weil wir später Error Boundary verwenden werden.