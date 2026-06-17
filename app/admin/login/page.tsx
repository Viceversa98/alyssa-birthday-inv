import { Button, Card, Container, Input, Label } from "@/components/ui";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { signIn } from "@/lib/actions/invitation";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const t = dict.admin.login;

  const errorMessage =
    params.error === "invalid_password" ? t.invalidPassword : null;

  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-blush px-4 py-12">
      <Container className="max-w-md">
        <Card>
          <Card.Header>
            <h1 className="font-display text-2xl font-semibold text-gold">
              {t.title}
            </h1>
            <p className="mt-1 text-base text-ink/70">{t.subtitle}</p>
          </Card.Header>
          <Card.Content>
            <form action={signIn} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="password">{t.password}</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                />
              </div>
              {errorMessage && (
                <p className="text-sm text-red-700">{errorMessage}</p>
              )}
              <Button type="submit" fullWidth className="w-full">
                {t.signIn}
              </Button>
            </form>
          </Card.Content>
        </Card>
      </Container>
    </div>
  );
}
