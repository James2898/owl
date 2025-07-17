import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

import Sidebar from "@/app/components/Sidebar";

type Props = {
  children: React.ReactNode;
};

const StudentLayout = async ({ children }: Props) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-gray-500">
      <Sidebar />
      <main className="flex-1 p-3">{children}</main>
    </div>
  );
};

export default StudentLayout;
