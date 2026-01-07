import { DotIcon } from "lucide-react";

const Footer = () => {
  return (
    <footer
      className={`py-4 flex justify-center items-center gap-2 font-bebas tracking-wide text-lg text-white bg-slate-950`}
    >
      <h1>Raihan Yusuf @ 2025</h1>
      <DotIcon />
      <h1>All rights reserved</h1>
    </footer>
  );
};

export default Footer;
