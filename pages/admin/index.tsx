import { withIronSessionSsr } from "iron-session/next";
import { InferGetServerSidePropsType } from "next";

import { isLoggedIn } from "../../lib/auth";
import { sessionOptions } from "../../lib/session";

export default function Admin({
  userId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <h1 className="text-3xl font-bold text-center mt-8">Profile</h1>
      <div className="mt-6 max-w-md mx-auto">
        <span className="block text-center text-gray-700 text-xl mt-4">
          User ID: {userId}
        </span>
        <form
          className="mt-4 text-center"
          method="POST"
          action="/api/auth/logout"
        >
          <button
            type="submit"
            className="bg-red-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </form>
      </div>
    </>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async ({ req: request, res: response }) => {
    if (!isLoggedIn(request)) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    return {
      props: {
        userId: request.session.userId ?? null,
      },
    };
  },
  sessionOptions
);
