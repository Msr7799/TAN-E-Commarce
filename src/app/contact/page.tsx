"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations";
import { WHATSAPP_URL } from "@/constants";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import { useTranslation } from "@/utils/i18n";

/**
 * صفحة اتصل بنا (ContactPage)
 * توفر نموذج تواصل متكامل مع التحقق من صحة المدخلات باستخدام Zod و React Hook Form،
 * مع عرض وسائل التواصل المباشرة والربط مع تطبيق الواتساب.
 */
export default function ContactPage() {
  // حالة التحكم في تحميل زر إرسال النموذج لمنع نقرات الإرسال المتكررة
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  // إعداد نموذج التواصل وربطه بمخطط التحقق Zod (contactFormSchema)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  // معالجة إرسال النموذج بعد التحقق من صحة الحقول
  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    // تسجيل محاولة الإرسال بشكل آمن في السجلات
    logger.info("Contact form submission attempted", {
      subject: data.subject,
      emailDomain: data.email.split("@")[1],
    });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      setIsSubmitting(false);

      if (res.ok) {
        const successMsg =
          t("contact.successToast") !== "contact.successToast"
            ? t("contact.successToast")
            : "Thank you! Your message has been received.";
        toast.success(successMsg);
        reset();
        return;
      }

      const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      const note =
        typeof body === "object" && body !== null && "note" in body
          ? (body as Record<string, unknown>)["note"]
          : undefined;
      const errorField =
        typeof body === "object" && body !== null && "error" in body
          ? (body as Record<string, unknown>)["error"]
          : undefined;
      const errMsg =
        (typeof note === "string" && note) ||
        (typeof errorField === "string" && errorField) ||
        t("contact.errorToast") ||
        "Failed to send message.";
      toast.error(errMsg);
    } catch (err) {
      setIsSubmitting(false);
      logger.error("Contact form send failed", { err });
      toast.error(t("contact.errorToast") || "Failed to send message.");
    }
  };

  return (
    <div className="min-h-screen bg-cream/20 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ترويسة الصفحة (العنوان والوصف) */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="text-xs font-semibold tracking-widest text-golden uppercase">
            {t("contact.tag")}
          </span>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-black">
            {t("contact.title")}
          </h1>
          <p className="text-muted-foreground mt-4">{t("contact.description")}</p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-12">
          {/* القسم الأيمن (معلومات الاتصال المباشر والواتساب) */}
          <div className="space-y-8 lg:col-span-5">
            <div className="space-y-6 rounded-3xl border border-beige bg-white p-8 shadow-sm">
              <h2 className="mb-4 border-b border-beige pb-4 text-xl font-bold">
                {t("contact.infoTitle")}
              </h2>

              {/* البريد الإلكتروني */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cream text-golden">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{t("contact.email.title")}</h3>
                  <p className="text-muted-foreground mt-0.5 text-sm">6464ssq@gmail.com</p>
                  <p className="text-muted-foreground text-xs">{t("contact.email.desc")}</p>
                </div>
              </div>

              {/* رقم الهاتف */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cream text-golden">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{t("contact.call.title")}</h3>
                  <p className="text-muted-foreground mt-0.5 text-sm">+973 37925259</p>
                  <p className="text-muted-foreground text-xs">{t("contact.call.desc")}</p>
                </div>
              </div>

              {/* العنوان الفعلي */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cream text-golden">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{t("contact.address.title")}</h3>
                  <p className="text-muted-foreground mt-0.5 text-sm whitespace-pre-line">
                    {t("contact.address.desc")}
                  </p>
                </div>
              </div>

              {/* بطاقة الانتقال للواتساب */}
              <div className="border-t border-beige pt-6">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-[#25D366]/20 transition-all hover:scale-[1.02] hover:shadow-lg"
                >
                  <MessageCircle className="h-5 w-5 fill-white" />
                  {t("contact.whatsapp")}
                </a>
              </div>
            </div>
          </div>

          {/* القسم الأيسر (نموذج إرسال الرسالة الإلكترونية) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-beige bg-white p-8 shadow-sm">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* حقل الاسم */}
                <div>
                  <label htmlFor="name" className="mb-1 block text-sm font-semibold">
                    {t("contact.form.name")}
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register("name")}
                    className={`placeholder:text-muted-foreground w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-golden ${
                      errors.name ? "border-red-400 focus:border-red-400" : "border-beige"
                    }`}
                    placeholder={t("contact.form.namePlaceholder")}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs font-semibold text-red-500">{errors.name.message}</p>
                  )}
                </div>

                {/* حقل البريد الإلكتروني */}
                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-semibold">
                    {t("contact.form.email")}
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    className={`placeholder:text-muted-foreground w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-golden ${
                      errors.email ? "border-red-400 focus:border-red-400" : "border-beige"
                    }`}
                    placeholder={t("contact.form.emailPlaceholder")}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs font-semibold text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* حقل عنوان الرسالة (الموضوع) */}
                <div>
                  <label htmlFor="subject" className="mb-1 block text-sm font-semibold">
                    {t("contact.form.subject")}
                  </label>
                  <input
                    id="subject"
                    type="text"
                    {...register("subject")}
                    className={`placeholder:text-muted-foreground w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-golden ${
                      errors.subject ? "border-red-400 focus:border-red-400" : "border-beige"
                    }`}
                    placeholder={t("contact.form.subjectPlaceholder")}
                  />
                  {errors.subject && (
                    <p className="mt-1 text-xs font-semibold text-red-500">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                {/* حقل نص الرسالة */}
                <div>
                  <label htmlFor="message" className="mb-1 block text-sm font-semibold">
                    {t("contact.form.message")}
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    {...register("message")}
                    className={`placeholder:text-muted-foreground w-full resize-none rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-golden ${
                      errors.message ? "border-red-400 focus:border-red-400" : "border-beige"
                    }`}
                    placeholder={t("contact.form.messagePlaceholder")}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs font-semibold text-red-500">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* زر الإرسال التفاعلي */}
                <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
                  <Send className="mr-2 h-4.5 w-4.5" />
                  {t("contact.form.submit")}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
