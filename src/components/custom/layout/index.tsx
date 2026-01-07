import Footer from "../footer";
import Navbar from "../navbar";

const BaseLayout = ({
  navbar = false,
  children,
  footer = true,
}: {
  navbar?: boolean;
  children: React.ReactNode;
  footer?: boolean;
}) => {
  return (
    <main className="w-full overflow-hidden hide-scrollbar select-none">
      {navbar && <Navbar />}
      {children}
      {footer && <Footer />}
    </main>
  );
};

export default BaseLayout;
