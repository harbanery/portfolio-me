import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/ui/card";

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
          <CardDescription className="text-white text-justify font-inter font-light text-2xl indent-14">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quod magni
            alias eum accusamus libero sunt illo ad nesciunt reiciendis
            blanditiis quae, laudantium natus nam, vero molestias veritatis
            beatae officia nihil a! Recusandae inventore corporis, voluptatum id
            natus consequuntur ipsum. Sed omnis magnam quidem tempore, iste ab
            beatae mollitia voluptas voluptatibus, accusamus eos dicta
            cupiditate dolores voluptates deleniti, alias eveniet necessitatibus
            dignissimos saepe eum provident vero repellat dolore. Provident
            earum repellat dolore accusantium? Accusamus veritatis corrupti enim
            necessitatibus doloribus blanditiis quibusdam sit voluptas?
            Doloribus modi reprehenderit maxime placeat, dolore tempora dolorem
            eaque. Expedita asperiores dolore harum, est voluptas iure
            laboriosam temporibus!
          </CardDescription>
        </CardHeader>
      </Card>
    </section>
  );
};

export default AboutSection;
