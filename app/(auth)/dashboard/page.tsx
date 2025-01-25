import PrivateRoute from "@/components/privateRoute";

export default function Dashboard() {
  return (
    <PrivateRoute>
      <div className="p-4">
        <h1>Dashboard</h1>
        <p>Welcome to your private dashboard!</p>
      </div>
    </PrivateRoute>
  );
}
