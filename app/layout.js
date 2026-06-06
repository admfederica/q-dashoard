export const metadata = {
  title: "Q Dashboard",
  description: "Dashboard de proyectos Q2",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
