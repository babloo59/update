import PrivateRoute from "@/components/privateRoute";

export default function Home() {
    return (
        <PrivateRoute>
        <div className="p-4">
          <h1>Home</h1>
          <p>Welcome to your private dashboard!</p>
        </div>
        </PrivateRoute>
    );
  }
  