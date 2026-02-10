"use client";
import {
  CardBody,
  CardContainer,
  CardItem,
} from "@/components/aceternity/ui/3d-card";
import Image from "next/image";
import Link from "next/link";
import { MdArrowCircleRight } from "react-icons/md";
import { FaGithub } from "react-icons/fa";
import { logoMap } from "@/utils/helpers/icon";
import { getGithubRepoName } from "@/utils/helpers";

const CardProject = ({ data }: any) => {
  const sourceList = data?.source?.map((item: any) => item) || [];
  const skillList = data?.tools
    ?.filter((tool: string) => logoMap[tool])
    .map((tool: string) => ({
      key: tool,
      icon: logoMap[tool],
    }));

  const renderSkillList = (list: any[]) => {
    if (list?.length === 0)
      return (
        <CardItem translateZ={50}>
          <div className="h-10"></div>
        </CardItem>
      );

    return list?.map((item) => (
      <CardItem key={item.key} translateZ={50}>
        <item.icon size={40} />
      </CardItem>
    ));
  };

  const renderSourceList = (list: any[]) => {
    if (list.length === 0)
      return (
        <CardItem translateZ={50}>
          <div className="h-9"></div>
        </CardItem>
      );

    return list.map((item: any) => (
      <CardItem
        key={item.name}
        translateZ={50}
        as={Link}
        href={item?.link ?? "#"}
        target="__blank"
        className="px-4 py-2 truncate rounded-xl text-sm font-semibold bg-black text-white dark:bg-white dark:text-white flex justify-start items-center gap-2"
      >
        <FaGithub size={16} /> {getGithubRepoName(item?.link) || item?.name}
      </CardItem>
    ));
  };

  return (
    <CardContainer className="font-inter relative">
      <CardBody className="bg-[#1C1C1C] relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border-[0.1px] border-white space-y-4">
        <CardBody className="h-full w-full flex justify-between items-center">
          <div className="flex flex-col">
            <CardItem
              translateZ={20}
              className="text-xl font-black uppercase text-white dark:text-white"
            >
              {data?.title}
            </CardItem>
            <CardItem
              translateZ={20}
              className="text-base font-bebas font-medium tracking-wider text-[#8d9bea] dark:text-white"
            >
              {data?.role}
            </CardItem>
          </div>
          {data?.link && (
            <CardItem
              translateZ={50}
              as={Link}
              href={data.link}
              target="__blank"
              className="px-4 py-2 rounded-xl text-xs font-normal bg-[#3a52dc] text-white dark:bg-white dark:text-white flex gap-2"
            >
              View <MdArrowCircleRight size={16} />
            </CardItem>
          )}
        </CardBody>
        <CardItem translateZ="200" className="w-full">
          <Image
            src={data?.image}
            height="1000"
            width="1000"
            className="h-60 w-full object-cover object-top rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>
        <CardItem
          as="p"
          translateZ="20"
          className="text-white h-20 line-clamp-4 text-sm max-w-sm text-justify dark:text-neutral-300"
        >
          {data?.description}
        </CardItem>
        <div className="flex justify-start items-center gap-2 text-white">
          {renderSkillList(skillList)}
        </div>
        <div className="flex justify-left items-center gap-2">
          {renderSourceList(sourceList)}
        </div>
      </CardBody>
    </CardContainer>
  );
};

export default CardProject;
