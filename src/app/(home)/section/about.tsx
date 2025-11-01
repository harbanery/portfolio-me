import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/ui/card";
import abouts from "@/data/about.json";

const AboutSection = () => {
  return (
    <section
      id="about"
      className="bg-gradient-to-b from-transparent from-0% to-slate-900 to-100% w-full h-auto relative p-20"
    >
      <Card className="w-full rounded-2xl px-10 py-7 bg-gradient-to-br from-[#008cff] from-5% via-[#3a52dc] via-40% to-[#0051a7] to-95%">
        <CardHeader className="gap-3">
          <CardTitle className="text-white text-center font-bebas tracking-wide font-bold text-7xl">
            About
          </CardTitle>
          {abouts?.map((about, index) => (
            <CardDescription
              key={index}
              className="text-white text-justify font-inter font-light text-2xl indent-14"
            >
              {about}
            </CardDescription>
          ))}
        </CardHeader>
      </Card>
    </section>
  );
};

export default AboutSection;
