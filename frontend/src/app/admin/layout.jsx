import AdminLayoutClient from './AdminLayoutClient';
import ProtectedRoute from '@/components/ProtectedRoute';

export const metadata = {
  title: "Admin Panel | uniforms.ae",
  description: "Next-generation e-commerce management dashboard",
};

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute adminOnly={true}>
      <AdminLayoutClient>
        {children}
      </AdminLayoutClient>
    </ProtectedRoute>
  );
}

