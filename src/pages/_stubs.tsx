import { PageHeader, Section, Empty } from "@/components/ui";
import type { ReactNode } from "react";
import { Construction } from "lucide-react";

export function StubPage({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      {children ?? (
        <Section>
          <Empty
            icon={<Construction size={20} />}
            title="Coming together nicely"
            description="This screen wires into the matching backend endpoint listed in the API guide. Drop in real data when the API is connected."
          />
        </Section>
      )}
    </>
  );
}
