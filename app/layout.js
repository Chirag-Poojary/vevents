
import "./globals.css";


export const metadata = {
  title: "VEvents",
  description: "Events Management System for Vidyalankar Institute of Technology",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
