import DashboardLayout from "../layouts/dashboardLayout/DashboardLayout";

export default function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <DashboardLayout>{children}</DashboardLayout>;
}
