import Login from "../components/account/login"
import Home from "../components/home"
import ForgotPassword from "../components/account/forgotpassword"
import SignUp from "../components/account/signup"
import ResetPassword from "../components/account/resetpassword"
import VerifyCode from "../components/account/verifyCode"
import Management from "../components/management/management"
import ContestDetail from "../components/contest/contest-detail"
import PaymentConfirmation from "../components/account/payment-success"
import AttendeesDetail from "../components/contest/attendees-detail"
import ContestPage from "../components/contest/contest-page"
import Evaluation from "../components/contest/evaluation"
import TipsPage from "../components/tips/tips-page"
import TipDetail from "../components/tips/tip-detail"
import RecipesPage from "../components/recipes/recipes-page"
import Approval from "../components/recipes/approval"

const publicRouter = [
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/forgot-password",
        element: <ForgotPassword />
    },
    {
        path: "/confirmcode",
        element: <VerifyCode />
    },
    {
        path: "/resetpassword",
        element: <ResetPassword />
    },
    {
        path: "/sign-up",
        element: <SignUp />
    },
    {
        path: "/contest/:id",
        element: <ContestDetail />
    },
    {
        path: "/contest",
        element: <ContestPage />
    },
    {
        path: "/success",
        element: <PaymentConfirmation />
    },
    {
        path: "/tips",
        element: <TipsPage />
    },
    {
        path: "/tips/:id",
        element: <TipDetail />
    },
    {
        path: "/recipes",
        element: <RecipesPage />
    },
    {
        path: "/recipes/:id",
        element: <TipDetail />
    }
]


const privateRouter = [
    {
        path: "/management",
        element: <Management defaultTab="profile" />,
        roles: ["ADMIN", "SUPERADMIN", "USER"],
        status: true
    }
]

const evaluateRouter = [
    {
        path: "/contest/attendees/:contestId",
        element: <AttendeesDetail />,
        roles: ["ADMIN", "SUPERADMIN"]
    },
    {
        path: "/contest/evaluation/:contestId",
        element: <Evaluation />,
        roles: ["ADMIN", "SUPERADMIN"]
    },
    {
        path: "/recipe/approval",
        element: <Approval />,
        roles: ["ADMIN", "SUPERADMIN"]
    }
]
export {
    publicRouter,
    privateRouter,
    evaluateRouter
}