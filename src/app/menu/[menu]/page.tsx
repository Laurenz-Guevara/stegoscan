import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export default async function Home() {
  return (
    <section className="flex flex-1 flex-col">
      <MaxWidthWrapper className="relative h-full flex flex-1 flex-col mt-4 pb-4">
        <h1 className="text-2xl font-semibold">Menu</h1>
      </MaxWidthWrapper>
    </section>
  );
}
