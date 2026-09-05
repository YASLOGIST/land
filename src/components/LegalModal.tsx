'use client'

/**
 * LegalModal — Terms / Privacy / Security for the land surface.
 *
 * Land shipped with no legal disclosure of any kind while writing a language
 * preference to localStorage. This closes that gap and brings the surface into
 * line with ocean's footer modals and main's /legal page.
 *
 * Built on the project's existing Radix dialog rather than a bespoke overlay,
 * so focus trapping, Escape dismissal, scroll locking and aria wiring come
 * from the primitive instead of being re-implemented here.
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useLanguage } from '@/hooks/use-language'
import { t } from '@/lib/i18n'
import type { BilingualText } from '@/types/land-logistics'

export type LegalKey = 'terms' | 'privacy' | 'security'

const LEGAL: Record<LegalKey, { title: BilingualText; body: BilingualText[] }> = {
  terms: {
    title: t('Terms of Service', 'الشروط والأحكام'),
    body: [
      t(
        'YASLOGIST is a supply-chain intelligence platform operated from its corporate branch in New Cairo, Cairo, Egypt.',
        'YASLOGIST منصة لذكاء سلاسل الإمداد تُدار من فرعها المؤسسي في القاهرة الجديدة، القاهرة، مصر.',
      ),
      t(
        'All fleet telemetry, corridor figures, throughput dashboards and dispatch outputs shown on this site are illustrative digital-twin models presented for demonstration purposes. They are not live operational data and must not be relied on for routing, contracting or compliance decisions.',
        'جميع بيانات الأسطول وأرقام الممرات ولوحات الإنتاجية ومخرجات الإرسال المعروضة على هذا الموقع نماذج توضيحية لتوأم رقمي تُقدَّم لأغراض العرض فقط. وهي ليست بيانات تشغيلية مباشرة، ولا يجوز الاعتماد عليها في قرارات التوجيه أو التعاقد أو الامتثال.',
      ),
      t(
        'YASLOGIST is not a freight forwarder, a transport operator or a customs broker. We do not move cargo, hold goods or file declarations; those are licensed activities and they belong to your carrier and your broker.',
        'YASLOGIST ليست وكيل شحن ولا شركة نقل ولا مخلّصاً جمركياً. نحن لا ننقل البضاعة ولا نحتجزها ولا نقدّم الإقرارات الجمركية؛ فهذه أنشطة مرخّصة تخص الناقل والمخلّص الجمركي.',
      ),
      t(
        'The YASLOGIST name, mark and interface are the work of the platform founder. Please request permission before reproducing them.',
        'اسم YASLOGIST وعلامته وواجهته من عمل مؤسس المنصة. يُرجى طلب الإذن قبل إعادة استخدامها.',
      ),
    ],
  },
  privacy: {
    title: t('Privacy Policy', 'سياسة الخصوصية'),
    body: [
      t(
        'This site collects nothing. There are no analytics scripts, no advertising trackers, no cookies and no third-party embeds that profile you.',
        'هذا الموقع لا يجمع أي بيانات. لا توجد أدوات تحليل، ولا متتبعات إعلانية، ولا ملفات ارتباط، ولا عناصر خارجية تتعقّبك.',
      ),
      t(
        'The only values stored on your device are two local preferences — your chosen theme and language — kept in your browser’s local storage so the site remembers them on your next visit. They never leave your device and are cleared when you clear site data.',
        'القيمتان الوحيدتان المحفوظتان على جهازك هما تفضيلا المظهر واللغة، وتُخزَّنان في متصفحك ليتذكّرهما الموقع في زيارتك القادمة. لا تغادران جهازك أبداً، وتُمحيان عند مسح بيانات الموقع.',
      ),
      t(
        'No account is required and no personal information is requested at any point. An address entered into the bulletin form opens a pre-addressed draft in your own mail application; nothing is transmitted to a server from this page.',
        'لا يلزم إنشاء حساب، ولا تُطلب أي معلومات شخصية. البريد الذي تُدخله في نموذج النشرة يفتح رسالة مُعدّة مسبقاً في تطبيق البريد لديك؛ ولا يُرسل أي شيء إلى خادم من هذه الصفحة.',
      ),
    ],
  },
  security: {
    title: t('Security', 'الأمان'),
    body: [
      t(
        'The platform is a static front-end. There is no backend, no database and no user session, so there is no stored personal data to breach.',
        'المنصة واجهة أمامية ثابتة بالكامل: لا خادم خلفي، ولا قاعدة بيانات، ولا جلسات مستخدم — لذا لا توجد بيانات شخصية مخزَّنة يمكن اختراقها.',
      ),
      t(
        'All assets are served over HTTPS in production. The interface runs entirely in your browser and performs no privileged operations on your device.',
        'تُقدَّم جميع الملفات عبر HTTPS في بيئة الإنتاج. تعمل الواجهة داخل متصفحك فقط ولا تنفّذ أي عمليات ذات صلاحيات على جهازك.',
      ),
      t(
        'The telemetry, dispatch and disruption visuals are presentation models illustrating how an instrumented land corridor would behave. They connect to no live fleet and command no real vehicle.',
        'عناصر القياس والإرسال ومعالجة الاختناقات نماذج عرضية توضّح سلوك ممر بري مزوّد بأجهزة قياس. وهي لا تتصل بأي أسطول فعلي ولا تتحكم في أي مركبة حقيقية.',
      ),
      t(
        'If you believe you have found a genuine security issue, please report it to contact@yaslogist.me.',
        'إذا اعتقدت أنك وجدت ثغرة أمنية حقيقية، فيُرجى إبلاغنا على contact@yaslogist.me.',
      ),
    ],
  },
}

export default function LegalModal({
  open,
  section,
  onClose,
}: {
  open: boolean
  section: LegalKey | null
  onClose: () => void
}) {
  const { language, direction } = useLanguage()

  if (!section) return null
  const doc = LEGAL[section]

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose() }}>
      <DialogContent
        dir={direction}
        className="max-w-2xl border-white/10 bg-slate-950/95 backdrop-blur-2xl text-slate-200 sm:max-w-2xl"
      >
        <DialogHeader className={direction === 'rtl' ? 'text-right' : 'text-left'}>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-gold-500">
            YASLOGIST · NEW CAIRO, CAIRO
          </p>
          <DialogTitle className="mt-2 text-xl font-extrabold text-white sm:text-2xl">
            {doc.title[language]}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {doc.title[language]}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[58vh] space-y-4 overflow-y-auto pr-1">
          {doc.body.map((p) => (
            <p key={p.en.slice(0, 40)} className="text-sm leading-relaxed text-slate-300">
              {p[language]}
            </p>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
