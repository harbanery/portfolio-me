import {
  CardBody,
  CardContainer,
  CardItem,
} from "@/components/aceternity/ui/3d-card";
import Image from "next/image";
import Link from "next/link";
import { MdArrowCircleRight } from "react-icons/md";
import cover1 from "@/assets/template/cover-project-1.png";
import { FaCss3Alt, FaGithub, FaReact } from "react-icons/fa";
import { RiNextjsFill } from "react-icons/ri";

const CardProject = () => {
  return (
    <div id="portfolio1">
      <CardContainer className="font-inter relative">
        <CardBody className="bg-[#1C1C1C] relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border-[0.1px] border-white space-y-4">
          <CardBody className="h-full w-full flex justify-between items-center">
            <div className="flex flex-col">
              <CardItem
                translateZ={20}
                className="text-xl font-black uppercase text-white dark:text-white"
              >
                Portfolio1
              </CardItem>
              <CardItem
                translateZ={20}
                className="text-base font-bebas font-medium tracking-wider text-[#8d9bea] dark:text-white"
              >
                Frontend
              </CardItem>
            </div>
            <CardItem
              translateZ={50}
              as={Link}
              href="/"
              target="__blank"
              className="px-4 py-2 rounded-xl text-xs font-normal bg-[#3a52dc] text-white dark:bg-white dark:text-white flex gap-2"
            >
              View <MdArrowCircleRight size={16} />
            </CardItem>
          </CardBody>
          <CardItem translateZ="200" className="w-full">
            <Image
              src={cover1}
              height="1000"
              width="1000"
              className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
              alt="thumbnail"
            />
          </CardItem>
          <CardItem
            as="p"
            translateZ="20"
            className="text-white text-sm max-w-sm text-justify dark:text-neutral-300"
          >
            Developed to showcase my skills in web development, my portfolio
            website exemplifies proficiency in technologies such as ReactJS,
            CSS, and Figma.
          </CardItem>
          <div className="flex justify-start items-center gap-2 text-white">
            <CardItem translateZ={50}>
              <FaReact size={40} />
            </CardItem>
            <CardItem translateZ={50}>
              <RiNextjsFill size={40} />
            </CardItem>
            <CardItem translateZ={50}>
              <FaCss3Alt size={40} />
            </CardItem>
          </div>
          <div className="flex justify-between items-center gap-5">
            <CardItem
              translateZ={50}
              as={Link}
              href="/"
              target="__blank"
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-black text-white dark:bg-white dark:text-white flex justify-start items-center gap-2"
            >
              <FaGithub size={16} /> rehany/project-1
            </CardItem>
            {/* <CardItem
              as="h1"
              translateZ="20"
              className="text-white font-bold dark:text-neutral-300"
            >
              March 1st, 2025
            </CardItem> */}
          </div>
        </CardBody>
      </CardContainer>
    </div>
  );
};

export default CardProject;
