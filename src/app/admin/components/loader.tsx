import { Spin } from "antd";

const LoaderPage = () => {
  return (
    <section className="flex flex-col gap-8 items-center justify-center min-h-[300px]">
      <Spin size="large" />
    </section>
  );
};

export default LoaderPage;
