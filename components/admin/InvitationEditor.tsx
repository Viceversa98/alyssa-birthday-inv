"use client";

import { useState, useTransition } from "react";
import { Button, Card, Input, Label, Textarea } from "@/components/ui";
import { useTranslations } from "@/components/LocaleProvider";
import { updateInvitation } from "@/lib/actions/invitation";
import {
  type InvitationData,
  invitationToFormValues,
} from "@/lib/invitation";
import { GalleryManager } from "./GalleryManager";
import { ImageUpload } from "./ImageUpload";

type InvitationEditorProps = {
  initialData: InvitationData;
};

type FieldGroupProps = {
  title: string;
  children: React.ReactNode;
};

const FieldGroup = ({ title, children }: FieldGroupProps) => (
  <Card>
    <Card.Header>
      <h2 className="font-display text-lg font-medium text-gold">{title}</h2>
    </Card.Header>
    <Card.Content className="space-y-4">{children}</Card.Content>
  </Card>
);

const Field = ({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label htmlFor={id}>{label}</Label>
    {children}
  </div>
);

export const InvitationEditor = ({ initialData }: InvitationEditorProps) => {
  const { dict } = useTranslations();
  const t = dict.admin.editor;
  const values = invitationToFormValues(initialData);
  const [galleryImages, setGalleryImages] = useState(initialData.galleryImages);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateInvitation(formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setMessage(t.saved);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      <FieldGroup title={t.hero}>
        <Field label={t.celebrantName} id="celebrantName">
          <Input
            id="celebrantName"
            name="celebrantName"
            defaultValue={values.celebrantName}
            required
          />
        </Field>
        <ImageUpload currentUrl={initialData.heroImageUrl} label={t.heroPhoto} />
      </FieldGroup>

      <FieldGroup title={t.bahasaMelayu}>
        <Field label={t.eyebrow} id="heroEyebrow">
          <Input
            id="heroEyebrow"
            name="heroEyebrow"
            defaultValue={values.heroEyebrow}
          />
        </Field>
        <Field label={t.tagline} id="tagline">
          <Textarea id="tagline" name="tagline" defaultValue={values.tagline} rows={2} />
        </Field>
        <Field label={t.timeLabel} id="timeLabel">
          <Input id="timeLabel" name="timeLabel" defaultValue={values.timeLabel} />
        </Field>
        <Field label={t.detailsTitle} id="detailsTitle">
          <Input
            id="detailsTitle"
            name="detailsTitle"
            defaultValue={values.detailsTitle}
          />
        </Field>
        <Field label={t.detailsSubtitle} id="detailsSubtitle">
          <Input
            id="detailsSubtitle"
            name="detailsSubtitle"
            defaultValue={values.detailsSubtitle}
          />
        </Field>
        <Field label={t.dressCode} id="dressCode">
          <Textarea
            id="dressCode"
            name="dressCode"
            defaultValue={values.dressCode}
            rows={2}
          />
        </Field>
        <Field label={t.rsvpTitle} id="rsvpTitle">
          <Input id="rsvpTitle" name="rsvpTitle" defaultValue={values.rsvpTitle} />
        </Field>
        <Field label={t.rsvpMessage} id="rsvpMessage">
          <Textarea
            id="rsvpMessage"
            name="rsvpMessage"
            defaultValue={values.rsvpMessage}
            rows={3}
          />
        </Field>
        <Field label={t.pageTitle} id="pageTitle">
          <Input id="pageTitle" name="pageTitle" defaultValue={values.pageTitle} />
        </Field>
        <Field label={t.pageDescription} id="pageDescription">
          <Textarea
            id="pageDescription"
            name="pageDescription"
            defaultValue={values.pageDescription}
            rows={2}
          />
        </Field>
      </FieldGroup>

      <FieldGroup title={t.english}>
        <Field label={t.eyebrow} id="contentEn.heroEyebrow">
          <Input
            id="contentEn.heroEyebrow"
            name="contentEn.heroEyebrow"
            defaultValue={values.contentEn.heroEyebrow}
          />
        </Field>
        <Field label={t.tagline} id="contentEn.tagline">
          <Textarea
            id="contentEn.tagline"
            name="contentEn.tagline"
            defaultValue={values.contentEn.tagline}
            rows={2}
          />
        </Field>
        <Field label={t.timeLabel} id="contentEn.timeLabel">
          <Input
            id="contentEn.timeLabel"
            name="contentEn.timeLabel"
            defaultValue={values.contentEn.timeLabel}
          />
        </Field>
        <Field label={t.detailsTitle} id="contentEn.detailsTitle">
          <Input
            id="contentEn.detailsTitle"
            name="contentEn.detailsTitle"
            defaultValue={values.contentEn.detailsTitle}
          />
        </Field>
        <Field label={t.detailsSubtitle} id="contentEn.detailsSubtitle">
          <Input
            id="contentEn.detailsSubtitle"
            name="contentEn.detailsSubtitle"
            defaultValue={values.contentEn.detailsSubtitle}
          />
        </Field>
        <Field label={t.dressCode} id="contentEn.dressCode">
          <Textarea
            id="contentEn.dressCode"
            name="contentEn.dressCode"
            defaultValue={values.contentEn.dressCode}
            rows={2}
          />
        </Field>
        <Field label={t.rsvpTitle} id="contentEn.rsvpTitle">
          <Input
            id="contentEn.rsvpTitle"
            name="contentEn.rsvpTitle"
            defaultValue={values.contentEn.rsvpTitle}
          />
        </Field>
        <Field label={t.rsvpMessage} id="contentEn.rsvpMessage">
          <Textarea
            id="contentEn.rsvpMessage"
            name="contentEn.rsvpMessage"
            defaultValue={values.contentEn.rsvpMessage}
            rows={3}
          />
        </Field>
        <Field label={t.pageTitle} id="contentEn.pageTitle">
          <Input
            id="contentEn.pageTitle"
            name="contentEn.pageTitle"
            defaultValue={values.contentEn.pageTitle}
          />
        </Field>
        <Field label={t.pageDescription} id="contentEn.pageDescription">
          <Textarea
            id="contentEn.pageDescription"
            name="contentEn.pageDescription"
            defaultValue={values.contentEn.pageDescription}
            rows={2}
          />
        </Field>
      </FieldGroup>

      <FieldGroup title={t.event}>
        <Field label={t.startDate} id="date">
          <Input
            id="date"
            name="date"
            type="datetime-local"
            defaultValue={values.date}
            required
          />
        </Field>
        <Field label={t.endDate} id="endDate">
          <Input
            id="endDate"
            name="endDate"
            type="datetime-local"
            defaultValue={values.endDate}
          />
        </Field>
        <Field label={t.rsvpDeadline} id="rsvpDeadline">
          <Input
            id="rsvpDeadline"
            name="rsvpDeadline"
            type="datetime-local"
            defaultValue={values.rsvpDeadline}
            required
          />
        </Field>
      </FieldGroup>

      <FieldGroup title={t.location}>
        <Field label={t.venueName} id="locationName">
          <Input
            id="locationName"
            name="locationName"
            defaultValue={values.locationName}
          />
        </Field>
        <Field label={t.address} id="address">
          <Input id="address" name="address" defaultValue={values.address} />
        </Field>
      </FieldGroup>

      <FieldGroup title={t.rsvp}>
        <Field label={t.rsvpEmail} id="rsvpEmail">
          <Input
            id="rsvpEmail"
            name="rsvpEmail"
            type="email"
            defaultValue={values.rsvpEmail}
            required
          />
        </Field>
        <Field label={t.rsvpPhone} id="rsvpPhone">
          <Input
            id="rsvpPhone"
            name="rsvpPhone"
            type="tel"
            defaultValue={values.rsvpPhone}
          />
        </Field>
      </FieldGroup>

      <FieldGroup title={t.images}>
        <GalleryManager images={galleryImages} onImagesChange={setGalleryImages} />
      </FieldGroup>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {message && (
        <p className="rounded-xl bg-pink-light px-4 py-3 text-sm text-ink">
          {message}
        </p>
      )}

      <div className="fixed bottom-0 left-0 right-0 border-t border-gold-light/40 bg-blush/95 px-4 py-4 backdrop-blur-sm sm:static sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row">
          <Button type="submit" fullWidth disabled={isPending}>
            {isPending ? t.saving : t.save}
          </Button>
          <Button href="/" variant="secondary" fullWidth>
            {t.viewInvitation}
          </Button>
        </div>
      </div>
    </form>
  );
};
