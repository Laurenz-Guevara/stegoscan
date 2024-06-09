import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export default function MenuPage({ slug }: { slug: any }) {
  return (
    <MaxWidthWrapper>
      <h1>{slug} Menu</h1>
    </MaxWidthWrapper>
  );
}
