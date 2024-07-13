import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SigninForm from "@/components/forms/SigninForm";

const LoginPage: React.FC = async () => {
  return (
    <Card className="w-full max-w-lg p-2">
      <CardHeader>
        <CardTitle className="text-xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SigninForm />
      </CardContent>
    </Card>
  );
};

export default LoginPage;
