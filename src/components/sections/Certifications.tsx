import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getCertifications } from "@/lib/content";

export async function Certifications() {
  const certifications = await getCertifications();
  if (certifications.length === 0) return null;

  return (
    <section id="certifications" className="section-padding">
      <div className="container-wide py-20 sm:py-28">
        <FadeIn>
          <SectionHeading label="Certifications" title="Credentials" />
        </FadeIn>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((item, i) => (
            <FadeIn key={item.id} delay={i * 0.06}>
              <Card hover className="h-full">
                <h3 className="text-base font-semibold text-foreground">{item.name}</h3>
                <p className="mt-2 text-sm text-muted">
                  {item.issuer} · {item.issueDate}
                </p>
                {item.credentialUrl && (
                  <Button href={item.credentialUrl} variant="secondary" size="sm" external className="mt-4">
                    Verify
                  </Button>
                )}
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
