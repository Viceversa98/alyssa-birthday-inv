import { Container, Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <main className="relative z-10 min-h-full flex-1 pb-24">
      <header className="bg-gradient-to-b from-blush via-pink-light/40 to-blush py-16 sm:py-24">
        <Container className="text-center">
          <Skeleton className="mx-auto h-4 w-32" />
          <Skeleton className="mx-auto mt-6 size-40 rounded-full sm:size-48" />
          <Skeleton className="mx-auto mt-6 h-10 w-64 max-w-full" />
          <Skeleton className="mx-auto mt-3 h-6 w-48 max-w-full" />
          <Skeleton className="mx-auto mt-4 h-5 w-72 max-w-full" />
          <div className="mx-auto mt-8 flex w-full max-w-sm flex-col gap-3">
            <Skeleton className="h-11 w-full rounded-full" />
            <Skeleton className="h-11 w-full rounded-full" />
          </div>
        </Container>
      </header>

      <section className="py-10 sm:py-16">
        <Container>
          <div className="mb-8 text-center">
            <Skeleton className="mx-auto h-8 w-48" />
            <Skeleton className="mx-auto mt-2 h-5 w-64 max-w-full" />
          </div>
          <Skeleton className="h-72 w-full rounded-xl sm:h-80" />
        </Container>
      </section>

      <section className="py-10 sm:py-16">
        <Container>
          <div className="mb-8 text-center">
            <Skeleton className="mx-auto h-8 w-40" />
            <Skeleton className="mx-auto mt-2 h-5 w-56 max-w-full" />
          </div>
          <Skeleton className="h-96 w-full rounded-xl" />
        </Container>
      </section>
    </main>
  );
}
