import './globals.css';

export const metadata = {
  title: 'Facebook - log in or sign up',
  description: 'Connect with friends, family and other people you know. Share photos and videos, send messages and get updates.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}