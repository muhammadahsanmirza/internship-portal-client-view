import { NavLink } from 'react-router-dom'

function PageNotFound() {
    return (
        <div className="flex flex-col items-center mx-auto justify-center h-screen w-full z-0">
            <h1 className="mb-4 text-6xl font-semibold text-red-500">404</h1>
            <p className="mb-4 text-lg text-gray-600">Oops! Looks like you are lost.</p>
            <div className="animate-bounce">
                <svg
                    className="mx-auto h-16 w-16 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                </svg>
            </div>
            <p className="mt-4 text-gray-600">
                Visit
                <NavLink
                    to="/"
                    className="text-blue-500 ml-2 hover:text-blue-700"
                    activeClassName="text-blue-700"
                >
                    Home
                </NavLink>
                .
            </p>
        </div>
    )
}

export default PageNotFound
