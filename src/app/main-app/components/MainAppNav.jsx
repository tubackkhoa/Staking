import Link from 'next/link'

const MainAppNav = () => {
    return (
        <nav className="bg-hwl-gray-1">
            <ul>
                <li>
                    <Link href="/">
                        <a className="text-red-500">HowlCity</a>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default MainAppNav
