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
    logger.info("Secure contact form submission attempted", {
      subject: data.subject,
      emailDomain: data.email.split("@")[1],
    });
    
    // محاكاة طلب خادم (API) لمدة 1.2 ثانية
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);
    
    // جلب نص نجاح الإرسال المترجم وإظهاره للمستخدم
    const successMsg = t("contact.successToast") !== "contact.successToast"
      ? t("contact.successToast")
      : "Thank you! Your message has been received.";
    toast.success(successMsg);
    
    // إعادة تعيين حقول النموذج إلى قيمها الافتراضية الفارغة
    reset();
  };

  return (
    <div className="bg-cream/20 min-h-screen py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ترويسة الصفحة (العنوان والوصف) */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-golden">
            {t("contact.tag")}
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-black mt-3">
            {t("contact.title")}
          </h1>
          <p className="mt-4 text-muted-foreground">
            {t("contact.description")}
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-12 max-w-5xl mx-auto">
          {/* القسم الأيمن (معلومات الاتصال المباشر والواتساب) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="rounded-3xl border border-beige bg-white p-8 shadow-sm space-y-6">
              <h2 className="font-bold text-xl mb-4 border-b border-beige pb-4">
                {t("contact.infoTitle")}
              </h2>

              {/* البريد الإلكتروني */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cream text-golden">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{t("contact.email.title")}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">[EMAIL_ADDRESS]</p>
                  <p className="text-xs text-muted-foreground">{t("contact.email.desc")}</p>
                </div>
              </div>

              {/* رقم الهاتف */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cream text-golden">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{t("contact.call.title")}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">+973 00000000</p>
                  <p className="text-xs text-muted-foreground">{t("contact.call.desc")}</p>
                </div>
              </div>

              {/* العنوان الفعلي */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cream text-golden">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{t("contact.address.title")}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5 whitespace-pre-line">
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
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] text-white px-4 py-3 text-sm font-semibold shadow-md shadow-[#25D366]/20 transition-all hover:scale-[1.02] hover:shadow-lg"
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
                  <label htmlFor="name" className="block text-sm font-semibold mb-1">
                    {t("contact.form.name")}
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register("name")}
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-golden placeholder:text-muted-foreground ${
                      errors.name ? "border-red-400 focus:border-red-400" : "border-beige"
                    }`}
                    placeholder={t("contact.form.namePlaceholder")}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500 font-semibold">{errors.name.message}</p>
                  )}
                </div>

                {/* حقل البريد الإلكتروني */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-1">
                    {t("contact.form.email")}
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-golden placeholder:text-muted-foreground ${
                      errors.email ? "border-red-400 focus:border-red-400" : "border-beige"
                    }`}
                    placeholder={t("contact.form.emailPlaceholder")}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500 font-semibold">{errors.email.message}</p>
                  )}
                </div>

                {/* حقل عنوان الرسالة (الموضوع) */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold mb-1">
                    {t("contact.form.subject")}
                  </label>
                  <input
                    id="subject"
                    type="text"
                    {...register("subject")}
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-golden placeholder:text-muted-foreground ${
                      errors.subject ? "border-red-400 focus:border-red-400" : "border-beige"
                    }`}
                    placeholder={t("contact.form.subjectPlaceholder")}
                  />
                  {errors.subject && (
                    <p className="mt-1 text-xs text-red-500 font-semibold">{errors.subject.message}</p>
                  )}
                </div>

                {/* حقل نص الرسالة */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold mb-1">
                    {t("contact.form.message")}
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    {...register("message")}
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-golden placeholder:text-muted-foreground resize-none ${
                      errors.message ? "border-red-400 focus:border-red-400" : "border-beige"
                    }`}
                    placeholder={t("contact.form.messagePlaceholder")}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-500 font-semibold">{errors.message.message}</p>
                  )}
                </div>

                {/* زر الإرسال التفاعلي */}
                <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
                  <Send className="h-4.5 w-4.5 mr-2" />
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
