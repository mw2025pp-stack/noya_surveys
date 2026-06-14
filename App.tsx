import React, { useState, useEffect } from 'react';
import { ChevronLeft, Check, Download, Lock, Eye, Plus, X, Sparkles, Stethoscope, Scissors, Heart, Droplet, AlertCircle, Trash2 } from 'lucide-react';

// ====== TYPES ======
interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
}

interface SurveyPayload {
  doctorId: string;
  doctorName: string;
  doctorTitle: string;
  specialty: string;
  specialtyLabel: string;
  procedures: string[];
  customProcedures: string[];
  devices: string[];
  notes: string;
  submittedAt: string;
}


// ====== BRAND ======
const BRAND = {
  maroon: '#6B2C2C',
  maroonDark: '#4A1F1F',
  peach: '#E8B89A',
  peachLight: '#F5D4BC',
  cream: '#FAF5F0',
  gold: '#C99668',
  text: '#2C1818',
  textLight: '#6B5050',
  border: '#E8D5C4',
};

// ====== PROCEDURES MASTER LISTS ======
const COSMETIC_PROCEDURES = {
  'الحقن (الفيلر والبوتكس)': [
    'فيلر الوجه', 'فيلر الشفايف', 'فيلر الجسم',
    'بوتكس وجه', 'بوتكس تعرق', 'بوتكس الفك', 'بوتكس عضلات الكتف', 'بوتكس الشقيقة'
  ],
  'محفزات الكولاجين': [
    'سالمون', 'الرادييس', 'سكلبترا', 'جوري', 'بروفايلو', 'سكن بوستر',
    'جولدن بلازما', 'ترانكس', 'اكس زوم', 'الهايدروديلوكس', 'انوفيال'
  ],
  'إجراءات أخرى': [
    'تفتيح شفايف', 'تقشير البارد', 'ابرة كرتزون', 'إذابة الفيلر', 'إزالة تاتو',
    'تقطيع الندبات', 'علامات التمدد', 'السيلوليت', 'إزالة الوحمات',
    'إذابة الدهون بالحقن', 'إزالة الثآليل'
  ],
  'إجراءات الشعر': [
    'البلازما', 'الماجلان', 'اكسوزم', 'اكسوزم سمارت', 'الدوداسترايد', 'مينوكسيديل'
  ]
};

const SURGERY_PROCEDURES = {
  'جراحات الثدي': [
    'جراحة تصحيح التثدي للرجال',
    'جراحة تجميل ثدي - تصغير',
    'جراحة تجميل ثدي - تكبير',
    'جراحة تجميل ثدي - شد'
  ],
  'جراحات الجسم': [
    'جراحة نحت القوام', 'شد الفخذين', 'شد الذراعين',
    'تكبير الأرداف البرازيلية', 'رفع الأرداف',
    'شد ونحت البطن', 'شفط الدهون', 'شفط الدهون 360',
    'إزالة الحشوات الدائمة', 'رفع الظهر'
  ],
  'جراحات الوجه': [
    'جراحة شد الوجه', 'جراحة تجميل الوجه', 'جراحة شفط الرقبة وشدها',
    'جراحة الجفن', 'تجميل الجفون السفلية', 'جراحة رفع الحاجبين',
    'جراحة رفع الحاجب بالمنظار', 'جراحة تصحيح الفك', 'جراحة رفع الشفاه',
    'جراحة تجميل الذقن', 'تجميل الأذن', 'تكبير الخد',
    'حقن دهون الوجه', 'شفط دهون الوجه', 'تجميل الندوب',
    'دبل تشن (اللغلوغ)', 'حقن الدهون الذاتية'
  ]
};

const GYN_PROCEDURES = {
  'الحقن للمنطقة الحساسة': [
    'فيلر المنطقة الحساسة',
    'بوتكس التعرق للمنطقة الحساسة',
    'محفزات الكولاجين (انوفيال - بلازما الماجلان - اسكي - اكسزوم)'
  ],
  'إجراءات تجميلية': [
    'تفتيح وتبييض المنطقة الحساسة',
    'تحسين النشوة والجلد',
    'علاج الحبوب بالمنطقة الحساسة',
    'إبر إذابة الدهون',
    'إزالة كيس دهني',
    'إزالة الثآليل',
    'إزالة زوائد جلدية',
    'تركيب/إزالة شريحة حمل',
    'تركيب/إزالة لولب'
  ],
  'إجراءات جراحية': [
    'تجميل الشفرات', 'تصغير غطاء الرأس',
    'جراحة رفع المثانة', 'حقن الدهون الذاتية'
  ]
};

const SKIN_PROCEDURES = {
  'تنظيف وعلاج البشرة': [
    'تنظيف البشرة الكلاسيك',
    'تنظيف البشرة الجاف',
    'تنظيف بشرة حب الشباب',
    'تنظيف البشرة الحساسة والوردية',
    'هيدرافيشيال',
    'تنظيف للظهر'
  ],
  'تفتيح وتوحيد اللون': [
    'معالجات توحيد لون البشرة', 'تقشير', 'نضارة',
    'تفتيح كامل الجسم', 'تفتيح الركب والأكواع', 'تفتيح المناطق الحساسة',
    'تقشير كوزمو ميلان', 'تقشير أكني', 'روز ليب'
  ],
  'علاج مشاكل الجلد': [
    'السيلوليت', 'ستريش مارك', 'علاج آثار العمليات والندبات',
    'ميزوثيرابي بدون إبر', 'جلسات تخسيس وشد الجسم'
  ]
};

// ====== DEVICES MASTER LIST ======
const DEVICES = {
  'أجهزة الليزر': [
    'Picosure Pro (بيكو شور)',
    'SmartXide Touch Fractional CO2',
    'Smart Pico',
    'Derma V (ديرما في)',
    'Endolift (إندولفت)',
    'Fraxel Dual (فراكسل)',
    'Accure (الأكيور)'
  ],
  'أجهزة التردد الحراري': [
    'Potenza (بوتنزا)',
    'Morpheus8 (مورفيس)',
    'Venus Legacy (فينوس ليجاسي)'
  ],
  'أجهزة الموجات فوق الصوتية': [
    'Ulthera (الالثيرا)'
  ],
  'أجهزة التحفيز الصوتي والضغط الجزيئي': [
    'Alma Ted (ألما تيد)',
    'Hydrafacial (هيدرافيشيال)'
  ],
  'أجهزة أخرى': [
    'الكي الكهربائي'
  ]
};

// ====== DOCTORS ======
const DOCTORS = [
  { id: 'yazid', name: 'د. يزيد الحصان', title: 'استشاري جلدية وليزر', specialty: 'cosmetic' },
  { id: 'nayef', name: 'د. نايف النمير', title: 'استشاري طب التجميل والليزر', specialty: 'cosmetic' },
  { id: 'ammar', name: 'د. عمار العلولا', title: 'استشاري طب الجلدية والشعر', specialty: 'cosmetic' },
  { id: 'yasser', name: 'د. ياسر القبيسي', title: 'استشاري طب جلدية وتجميل', specialty: 'cosmetic' },
  { id: 'saleh', name: 'د. صالح الخميس', title: 'استشاري الجلدية والشعر', specialty: 'cosmetic' },
  { id: 'fatima', name: 'د. فاطمة الرشيد', title: 'استشارية تجميل وليزر', specialty: 'cosmetic' },
  { id: 'ibtisam', name: 'د. ابتسام الجريان', title: 'استشارية أمراض جلدية وتجميل وليزر', specialty: 'cosmetic' },
  { id: 'noura', name: 'د. نوره السبيت', title: 'استشارية أمراض جلدية وتجميل وليزر', specialty: 'cosmetic' },
  { id: 'qahtani', name: 'د. محمد القحطاني', title: 'استشاري طب التجميل والليزر', specialty: 'cosmetic' },
  { id: 'omair', name: 'د. عبدالله العمير', title: 'استشاري طب التجميل والليزر', specialty: 'cosmetic' },
  { id: 'khaled', name: 'د. خالد عرب', title: 'استشاري جراحة تجميل', specialty: 'surgery' },
  { id: 'rakkan', name: 'د. محمد الراكان', title: 'استشاري جراحة تجميل', specialty: 'surgery' },
  { id: 'omar', name: 'د. عمر السحيم', title: 'استشاري جراحة الوجه والفكين', specialty: 'surgery' },
  { id: 'weam', name: 'د. وئام بابور', title: 'أخصائية تجميل نسائي', specialty: 'gyn' },
  { id: 'nadhah', name: 'أ. ناضه السبيعي', title: 'أخصائية بشرة', specialty: 'skin' }
];

const SPECIALTY_META = {
  cosmetic: { label: 'طب تجميل وليزر', icon: Sparkles, procedures: COSMETIC_PROCEDURES },
  surgery: { label: 'جراحة تجميل', icon: Scissors, procedures: SURGERY_PROCEDURES },
  gyn: { label: 'تجميل نسائي', icon: Heart, procedures: GYN_PROCEDURES },
  skin: { label: 'أخصائية بشرة', icon: Droplet, procedures: SKIN_PROCEDURES }
};

const ADMIN_PASSWORD = 'noya2026';
const STORAGE_KEY = 'noya:q3:responses';

// ====== ZAPIER WEBHOOK ======
// Paste your Zapier "Catch Hook" URL here:
const ZAPIER_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/25586183/43r9bnx/';

// ====== NOYA LOGO ======
function NoyaLogo({ size = 48 }) {
  return (
    <div style={{ color: BRAND.peach, lineHeight: 1, textAlign: 'center', display: 'inline-block' }}>
      <div
        style={{
          fontFamily: "'Cormorant Garamond', 'Playfair Display', 'Times New Roman', Georgia, serif",
          fontSize: size,
          fontWeight: 500,
          letterSpacing: '0.18em',
          lineHeight: 1,
          paddingRight: '0.18em',
          whiteSpace: 'nowrap'
        }}
      >
        NOYA
      </div>
      <div
        style={{
          fontFamily: "'Cormorant Garamond', 'Playfair Display', 'Times New Roman', Georgia, serif",
          fontSize: Math.max(8, size * 0.2),
          letterSpacing: '0.4em',
          marginTop: size * 0.18,
          opacity: 0.85,
          paddingRight: '0.4em',
          whiteSpace: 'nowrap'
        }}
      >
        COSMETIC CLINIC
      </div>
    </div>
  );
}

// ====== MULTI-SELECT DROPDOWN ======
function MultiSelectDropdown({ groups, selected, onChange, placeholder }: { groups: Record<string, string[]>; selected: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const [open, setOpen] = useState(false);

  const toggle = (item) => {
    if (selected.includes(item)) onChange(selected.filter(i => i !== item));
    else onChange([...selected, item]);
  };

  const removeItem = (item) => onChange(selected.filter(i => i !== item));

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full min-h-[56px] p-3 rounded-xl border-2 text-right flex items-start justify-between gap-2 transition-all hover:border-opacity-80"
        style={{ borderColor: BRAND.border, background: 'white' }}
      >
        <div className="flex flex-wrap gap-2 flex-1 justify-end">
          {selected.length === 0 ? (
            <span style={{ color: BRAND.textLight }} className="text-sm py-2">{placeholder}</span>
          ) : (
            selected.map(item => (
              <span
                key={item}
                className="px-3 py-1 rounded-full text-xs flex items-center gap-1.5"
                style={{ background: BRAND.peachLight, color: BRAND.maroonDark }}
                onClick={(e) => { e.stopPropagation(); removeItem(item); }}
              >
                <X size={12} />
                {item}
              </span>
            ))
          )}
        </div>
        <ChevronLeft
          size={20}
          style={{ color: BRAND.maroon, transform: open ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute top-full mt-2 w-full rounded-xl shadow-xl z-20 max-h-96 overflow-y-auto"
            style={{ background: 'white', border: `2px solid ${BRAND.border}` }}
          >
            {Object.entries(groups).map(([groupName, items]) => (
              <div key={groupName}>
                <div
                  className="px-4 py-2 text-xs font-bold sticky top-0"
                  style={{ background: BRAND.cream, color: BRAND.maroon }}
                >
                  {groupName}
                </div>
                {items.map(item => {
                  const isSelected = selected.includes(item);
                  return (
                    <div
                      key={item}
                      onClick={() => toggle(item)}
                      className="px-4 py-2.5 cursor-pointer flex items-center justify-between gap-2 hover:bg-opacity-50 transition-colors"
                      style={{
                        background: isSelected ? BRAND.peachLight : 'white',
                        color: BRAND.text
                      }}
                    >
                      <div
                        className="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0"
                        style={{
                          borderColor: isSelected ? BRAND.maroon : BRAND.border,
                          background: isSelected ? BRAND.maroon : 'white'
                        }}
                      >
                        {isSelected && <Check size={14} color="white" />}
                      </div>
                      <span className="text-sm flex-1 text-right">{item}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ====== DOCTOR CARD ======
function DoctorCard({ doctor, onClick }) {
  const [hover, setHover] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(`${STORAGE_KEY}:${doctor.id}`, true);
        if (r && r.value) setStatus('done');
      } catch (e) {}
    })();
  }, [doctor.id]);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="text-right p-4 rounded-xl transition-all border-2"
      style={{
        background: hover ? BRAND.maroon : 'white',
        color: hover ? BRAND.cream : BRAND.text,
        borderColor: hover ? BRAND.maroon : BRAND.border,
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hover ? `0 8px 20px ${BRAND.maroon}33` : '0 2px 4px rgba(0,0,0,0.04)'
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="font-bold text-base mb-1">{doctor.name}</div>
          <div className="text-xs" style={{ color: hover ? BRAND.peachLight : BRAND.textLight }}>
            {doctor.title}
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          {status === 'done' && (
            <span
              className="text-[10px] px-2 py-0.5 rounded-full"
              style={{
                background: hover ? BRAND.peach : '#D4F4DD',
                color: hover ? BRAND.maroonDark : '#1A6B2E'
              }}
            >
              ✓ مكتمل
            </span>
          )}
          <ChevronLeft size={20} style={{ color: hover ? BRAND.peach : BRAND.maroon }} />
        </div>
      </div>
    </button>
  );
}

// ====== LANDING PAGE ======
function LandingPage({ onSelectDoctor, onAdminClick }: { onSelectDoctor: (d: Doctor) => void; onAdminClick: () => void }) {
  const grouped = {
    cosmetic: DOCTORS.filter(d => d.specialty === 'cosmetic'),
    surgery: DOCTORS.filter(d => d.specialty === 'surgery'),
    gyn: DOCTORS.filter(d => d.specialty === 'gyn'),
    skin: DOCTORS.filter(d => d.specialty === 'skin')
  };

  return (
    <div className="min-h-screen" style={{ background: BRAND.cream }} dir="rtl">
      <div style={{ background: BRAND.maroon }} className="py-6 sm:py-8 px-4 sm:px-6 relative">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={onAdminClick}
            className="text-xs opacity-50 hover:opacity-100 transition-opacity flex items-center gap-1 flex-shrink-0"
            style={{ color: BRAND.peach }}
          >
            <Lock size={12} /> أدمن
          </button>
          <div className="scale-75 sm:scale-100 origin-right">
            <NoyaLogo />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 text-center">
        <div
          className="inline-block px-4 py-1 rounded-full text-xs mb-4"
          style={{ background: BRAND.peachLight, color: BRAND.maroon }}
        >
          خطة Q3 الصيفية · يوليو · أغسطس · سبتمبر
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: BRAND.maroon }}>
          استبيان خبراء نويا
        </h1>
        <p className="text-base max-w-2xl mx-auto leading-relaxed" style={{ color: BRAND.textLight }}>
          نود معرفة الإجراءات والأجهزة المناسبة لموسم الصيف من وجهة نظرك
          <br />
          عشان نبني خطة Q3 التسويقية بناءً على خبرتك
        </p>
        <p className="text-sm mt-4" style={{ color: BRAND.maroon, fontWeight: 600 }}>
          من فضلك اختر اسمك من القائمة 👇
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-16 space-y-8">
        {Object.entries(grouped).map(([key, doctors]) => {
          const meta = SPECIALTY_META[key];
          const Icon = meta.icon;
          return (
            <div key={key}>
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: BRAND.maroon }}
                >
                  <Icon size={18} color={BRAND.peach} />
                </div>
                <h2 className="text-lg font-bold" style={{ color: BRAND.maroon }}>{meta.label}</h2>
                <div className="flex-1 h-px" style={{ background: BRAND.border }} />
                <span className="text-xs" style={{ color: BRAND.textLight }}>{doctors.length} دكتور</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {doctors.map(doc => (
                  <DoctorCard key={doc.id} doctor={doc} onClick={() => onSelectDoctor(doc)} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center pb-8 text-xs" style={{ color: BRAND.textLight }}>
        © 2026 Noya Cosmetic Clinic · Internal Survey
      </div>
    </div>
  );
}

// ====== SURVEY PAGE ======
function SurveyPage({ doctor, onBack, onSubmit }: { doctor: Doctor; onBack: () => void; onSubmit: (p: SurveyPayload) => void }) {
  const procedures = SPECIALTY_META[doctor.specialty].procedures;
  const [selectedProcedures, setSelectedProcedures] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [customProcedures, setCustomProcedures] = useState([]);
  const [newCustom, setNewCustom] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(`${STORAGE_KEY}:${doctor.id}`, true);
        if (r && r.value) {
          const data = JSON.parse(r.value);
          setSelectedProcedures(data.procedures || []);
          setSelectedDevices(data.devices || []);
          setCustomProcedures(data.customProcedures || []);
          setNotes(data.notes || '');
        }
      } catch (e) {}
    })();
  }, [doctor.id]);

  const addCustom = () => {
    const trimmed = newCustom.trim();
    if (trimmed && !customProcedures.includes(trimmed)) {
      setCustomProcedures([...customProcedures, trimmed]);
      setNewCustom('');
    }
  };

  const handleSubmit = async () => {
    setError('');
    if (selectedProcedures.length === 0 && customProcedures.length === 0) {
      setError('من فضلك اختر إجراء واحد على الأقل');
      return;
    }
    if (selectedDevices.length === 0 && doctor.specialty !== 'surgery') {
      setError('من فضلك اختر جهاز واحد على الأقل');
      return;
    }

    setSubmitting(true);

    const specialtyLabel = SPECIALTY_META[doctor.specialty].label;
    const submittedAt = new Date().toISOString();

    const payload = {
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorTitle: doctor.title,
      specialty: doctor.specialty,
      specialtyLabel,
      procedures: selectedProcedures,
      customProcedures,
      devices: selectedDevices,
      notes,
      submittedAt
    };

    // ── 1. Save to shared storage (existing behaviour) ───────────────────────
    if (window.storage && typeof window.storage.set === 'function') {
      window.storage
        .set(`${STORAGE_KEY}:${doctor.id}`, JSON.stringify(payload), true)
        .catch(e => console.error('Storage save error:', e));
    }

    // ── 2. Send to Zapier webhook → Google Sheet / Excel ────────────────────
    // Zapier receives a flat JSON object; each key becomes a spreadsheet column.
    // Multi-value fields are joined with " | " — one row per survey submission.
    const zapierPayload = {
      submitted_at:      submittedAt,
      doctor_id:         doctor.id,
      doctor_name:       doctor.name,
      doctor_title:      doctor.title,
      specialty:         specialtyLabel,
      procedures:        selectedProcedures.join(' | '),
      custom_procedures: customProcedures.join(' | '),
      devices:           selectedDevices.join(' | '),
      notes:             notes || '',
      procedures_count:  selectedProcedures.length + customProcedures.length,
      devices_count:     selectedDevices.length,
    };

    try {
      await fetch(ZAPIER_WEBHOOK_URL, {
        method: 'POST',
        // Using text/plain avoids CORS preflight while still delivering JSON to Zapier.
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(zapierPayload),
      });
    } catch (e) {
      // Non-blocking: log but don't prevent the success screen.
      console.error('Zapier webhook error:', e);
    }

    // ── 3. Proceed to success screen ─────────────────────────────────────────
    setTimeout(() => {
      setSubmitting(false);
      onSubmit(payload);
    }, 700);
  };

  const Icon = SPECIALTY_META[doctor.specialty].icon;

  return (
    <div className="min-h-screen" style={{ background: BRAND.cream }} dir="rtl">
      <div style={{ background: BRAND.maroon }} className="py-6 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm hover:opacity-80 transition-opacity"
            style={{ color: BRAND.peach }}
          >
            رجوع
            <ChevronLeft size={16} style={{ transform: 'rotate(180deg)' }} />
          </button>
          <NoyaLogo size={36} />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 -mt-2">
        <div
          className="rounded-2xl p-6 shadow-lg flex items-center gap-4"
          style={{ background: 'white', border: `2px solid ${BRAND.peachLight}` }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: BRAND.peachLight }}
          >
            <Icon size={24} color={BRAND.maroon} />
          </div>
          <div className="flex-1">
            <div className="text-xl font-bold" style={{ color: BRAND.maroon }}>{doctor.name}</div>
            <div className="text-sm" style={{ color: BRAND.textLight }}>{doctor.title}</div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        <div
          className="p-5 rounded-xl text-sm leading-relaxed"
          style={{ background: BRAND.peachLight, color: BRAND.maroonDark }}
        >
          <strong>الهدف من الاستبيان:</strong> نبني خطة Q3 التسويقية (يوليو · أغسطس · سبتمبر) بناءً على خبرتك.
          من فضلك اختر الإجراءات والأجهزة اللي ترى إنها مناسبة لموسم الصيف وتمثل نقاط تركيزك للفترة دي.
        </div>

        <div>
          <label className="block mb-3">
            <span className="text-base font-bold block" style={{ color: BRAND.maroon }}>
              ١. الإجراءات المناسبة لموسم الصيف
            </span>
            <span className="text-xs" style={{ color: BRAND.textLight }}>
              اختر كل الإجراءات اللي تنصح بالتركيز عليها · يمكن اختيار أكثر من واحد
            </span>
          </label>
          <MultiSelectDropdown
            groups={procedures}
            selected={selectedProcedures}
            onChange={setSelectedProcedures}
            placeholder="اضغط لاختيار الإجراءات..."
          />
        </div>

        <div>
          <label className="block mb-3">
            <span className="text-base font-bold block" style={{ color: BRAND.maroon }}>
              ٢. إضافة إجراءات غير موجودة في القائمة
            </span>
            <span className="text-xs" style={{ color: BRAND.textLight }}>
              لو في إجراء عاوز تضيفه ومش موجود فوق · اختياري
            </span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCustom}
              onChange={(e) => setNewCustom(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustom())}
              placeholder="اكتب اسم الإجراء واضغط +"
              className="flex-1 px-4 py-3 rounded-xl border-2 text-right outline-none transition-all"
              style={{ borderColor: BRAND.border, background: 'white', color: BRAND.text, fontSize: '16px' }}
              onFocus={(e) => e.target.style.borderColor = BRAND.maroon}
              onBlur={(e) => e.target.style.borderColor = BRAND.border}
            />
            <button
              type="button"
              onClick={addCustom}
              className="px-5 rounded-xl flex items-center gap-1 text-sm font-bold transition-all hover:opacity-90"
              style={{ background: BRAND.maroon, color: BRAND.cream }}
            >
              <Plus size={16} />
              إضافة
            </button>
          </div>
          {customProcedures.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {customProcedures.map(item => (
                <span
                  key={item}
                  onClick={() => setCustomProcedures(customProcedures.filter(i => i !== item))}
                  className="px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 cursor-pointer"
                  style={{ background: BRAND.gold, color: 'white' }}
                >
                  <X size={12} />
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>

        {doctor.specialty !== 'surgery' && (
          <div>
            <label className="block mb-3">
              <span className="text-base font-bold block" style={{ color: BRAND.maroon }}>
                ٣. الأجهزة المناسبة لموسم الصيف
              </span>
              <span className="text-xs" style={{ color: BRAND.textLight }}>
                اختر الأجهزة اللي ترى إنها أنسب لجلسات الصيف · يمكن اختيار أكثر من واحد
              </span>
            </label>
            <MultiSelectDropdown
              groups={DEVICES}
              selected={selectedDevices}
              onChange={setSelectedDevices}
              placeholder="اضغط لاختيار الأجهزة..."
            />
          </div>
        )}

        <div>
          <label className="block mb-3">
            <span className="text-base font-bold block" style={{ color: BRAND.maroon }}>
              {doctor.specialty === 'surgery' ? '٣' : '٤'}. ملاحظات إضافية (اختياري)
            </span>
            <span className="text-xs" style={{ color: BRAND.textLight }}>
              أي توصيات أو نقاط تركيز إضافية تحب نأخدها في الحسبان
            </span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="مثال: التركيز على باقات تجديد البشرة قبل السفر، عروض للمناطق المعرضة للشمس، ..."
            className="w-full px-4 py-3 rounded-xl border-2 text-right outline-none transition-all resize-none"
            style={{ borderColor: BRAND.border, background: 'white', color: BRAND.text, fontSize: '16px' }}
            onFocus={(e) => e.target.style.borderColor = BRAND.maroon}
            onBlur={(e) => e.target.style.borderColor = BRAND.border}
          />
        </div>

        {error && (
          <div
            className="p-4 rounded-xl text-sm flex items-center gap-2"
            style={{ background: '#FEE', color: '#B91C1C', border: '1px solid #FCA5A5' }}
          >
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-4 rounded-xl text-base font-bold transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ background: BRAND.maroon, color: BRAND.cream }}
        >
          {submitting ? 'جاري الحفظ...' : (
            <>
              <Check size={20} />
              إرسال الاستبيان
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ====== SUCCESS PAGE ======
function SuccessPage({ doctor, onBackToList }: { doctor: Doctor; onBackToList: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: BRAND.cream }} dir="rtl">
      <div className="max-w-md w-full text-center">
        <div
          className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{ background: BRAND.maroon }}
        >
          <Check size={48} color={BRAND.peach} />
        </div>
        <h2 className="text-2xl font-bold mb-3" style={{ color: BRAND.maroon }}>
          شكراً لك يا {doctor.name}! 🌸
        </h2>
        <p className="text-base mb-8 leading-relaxed" style={{ color: BRAND.textLight }}>
          تم استلام ردك بنجاح. مساهمتك ستساعدنا في بناء خطة Q3 التسويقية بشكل أفضل وأدق.
        </p>
        <button
          onClick={onBackToList}
          className="px-8 py-3 rounded-xl font-bold transition-all hover:opacity-90"
          style={{ background: BRAND.maroon, color: BRAND.cream }}
        >
          العودة للقائمة
        </button>
      </div>
    </div>
  );
}

// ====== ADMIN LOGIN ======
function AdminLogin({ onSuccess, onBack }: { onSuccess: () => void; onBack: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) onSuccess();
    else setError('كلمة السر غير صحيحة');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: BRAND.cream }} dir="rtl">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div style={{ background: BRAND.maroon }} className="inline-block p-4 rounded-2xl mb-4">
            <NoyaLogo size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: BRAND.maroon }}>لوحة الأدمن</h2>
          <p className="text-sm" style={{ color: BRAND.textLight }}>أدخل كلمة السر للدخول</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4" style={{ border: `2px solid ${BRAND.border}` }}>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="كلمة السر"
            className="w-full px-4 py-3 rounded-xl border-2 text-center outline-none transition-all"
            style={{ borderColor: error ? '#FCA5A5' : BRAND.border, background: BRAND.cream, color: BRAND.text, fontSize: '16px' }}
            autoFocus
          />
          {error && (
            <div className="text-sm text-center" style={{ color: '#B91C1C' }}>{error}</div>
          )}
          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-xl font-bold transition-all hover:opacity-90"
            style={{ background: BRAND.maroon, color: BRAND.cream }}
          >
            دخول
          </button>
          <button
            onClick={onBack}
            className="w-full py-2 text-sm transition-all hover:opacity-80"
            style={{ color: BRAND.textLight }}
          >
            رجوع
          </button>
        </div>
      </div>
    </div>
  );
}

// ====== STAT CARD ======
function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-2xl p-4" style={{ border: `2px solid ${BRAND.border}` }}>
      <div className="flex items-center justify-between mb-2">
        <Icon size={20} style={{ color }} />
      </div>
      <div className="text-2xl font-bold" style={{ color: BRAND.maroon }}>{value}</div>
      <div className="text-xs mt-1" style={{ color: BRAND.textLight }}>{label}</div>
    </div>
  );
}

// ====== DETAIL SECTION ======
function DetailSection({ title, items, highlight }) {
  return (
    <div>
      <h4 className="font-bold mb-2 text-sm" style={{ color: BRAND.maroon }}>
        {title} <span className="text-xs font-normal" style={{ color: BRAND.textLight }}>({items.length})</span>
      </h4>
      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <span
            key={item}
            className="px-3 py-1.5 rounded-full text-xs"
            style={{
              background: highlight ? BRAND.gold : BRAND.peachLight,
              color: highlight ? 'white' : BRAND.maroonDark
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ====== ADMIN DASHBOARD ======
// ── Google Sheet config ─────────────────────────────────────────────────────
const SHEET_ID = '1ThmNKL6QGF7wGqXebGSjcbkbd9pkrlzCLfllw5rYuPc';
const SHEET_NAME = 'Sheet1'; // change if your tab has a different name
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`;

function parseSheetResponse(raw: string) {
  // Google wraps the JSON in /*O_o*/ google.visualization.Query.setResponse({...});
  const json = raw.replace(/^[^(]+\(/, '').replace(/\);?$/, '');
  const data = JSON.parse(json);
  const rows = data.table.rows;
  return rows.map((row: any) => {
    const c = row.c;
    const get = (i: number) => (c[i] && c[i].v != null ? String(c[i].v) : '');
    const getArr = (i: number) => get(i).split(' | ').filter(Boolean);
    return {
      submittedAt:      get(0),
      doctorId:         get(1),
      doctorName:       get(2),
      doctorTitle:      get(3),
      specialty:        get(4),   // this is the label e.g. "طب تجميل وليزر"
      procedures:       getArr(5),
      customProcedures: getArr(6),
      devices:          getArr(7),
      notes:            get(8),
      proceduresCount:  get(9),
      devicesCount:     get(10),
    };
  });
}

function AdminDashboard({ onBack }: { onBack: () => void }) {
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchFromSheet = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(SHEET_URL);
      const text = await res.text();
      const parsed = parseSheetResponse(text);
      setResponses(parsed);
      setLastRefresh(new Date());
    } catch (e) {
      setError('تعذّر تحميل البيانات. تأكد من أن الجدول مشارك للعموم.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFromSheet(); }, []);

  const exportCSV = () => {
    const headers = ['تاريخ الإرسال', 'اسم الدكتور', 'التخصص', 'المسمى الوظيفي', 'الإجراءات', 'إجراءات مضافة', 'الأجهزة', 'ملاحظات'];
    const rows = responses.map(r => [
      r.submittedAt,
      r.doctorName,
      r.specialty,
      r.doctorTitle,
      r.procedures.join(' | '),
      r.customProcedures.join(' | '),
      r.devices.join(' | '),
      (r.notes || '').replace(/\n/g, ' '),
    ]);
    const csv = [headers, ...rows]
      .map(row => row.map((cell: string) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `noya-q3-survey-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Delete is handled in Google Sheet directly — we just hide from view locally
  const performDelete = (doctorId: string) => {
    setResponses(prev => prev.filter(r => r.doctorId !== doctorId));
    if (selectedDoctor?.doctorId === doctorId) setSelectedDoctor(null);
  };

  const [confirmDelete, setConfirmDelete] = useState<any>(null);

  const completedCount = responses.length;
  const totalCount = DOCTORS.length;
  const pendingDoctors = DOCTORS.filter(d => !responses.find(r => r.doctorId === d.id));

  return (
    <div className="min-h-screen" style={{ background: BRAND.cream }} dir="rtl">
      <div style={{ background: BRAND.maroon }} className="py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="px-3 py-1.5 rounded-lg text-xs transition-all hover:opacity-80"
              style={{ background: BRAND.maroonDark, color: BRAND.peach }}
            >
              خروج
            </button>
            <div className="flex items-center gap-2">
            <button
              onClick={fetchFromSheet}
              className="px-3 py-1.5 rounded-lg text-xs transition-all hover:opacity-80 flex items-center gap-1"
              style={{ background: BRAND.maroonDark, color: BRAND.peach }}
            >
              ↻ تحديث
            </button>
            <button
              onClick={exportCSV}
              disabled={responses.length === 0}
              className="px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all hover:opacity-90 disabled:opacity-40"
              style={{ background: BRAND.peach, color: BRAND.maroonDark, fontWeight: 600 }}
            >
              <Download size={14} />
              تحميل CSV
            </button>
          </div>
          </div>
          <NoyaLogo size={36} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-1" style={{ color: BRAND.maroon }}>لوحة استبيان Q3</h1>
        <p className="text-sm mb-1" style={{ color: BRAND.textLight }}>
          مراجعة ردود الأطباء على استبيان الخطة الصيفية
        </p>
        <p className="text-xs mb-6" style={{ color: BRAND.textLight }}>
          آخر تحديث: {lastRefresh.toLocaleTimeString('ar-SA')} · البيانات من Google Sheets
        </p>
        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm text-center" style={{ background: '#FEE2E2', color: '#B91C1C' }}>
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="عدد الردود" value={completedCount} icon={Check} color={BRAND.maroon} />
          <StatCard label="إجمالي الأطباء" value={totalCount} icon={Stethoscope} color={BRAND.gold} />
          <StatCard label="نسبة الإكمال" value={`${Math.round(completedCount / totalCount * 100)}%`} icon={Sparkles} color={BRAND.peach} />
          <StatCard label="بانتظار الرد" value={totalCount - completedCount} icon={AlertCircle} color={BRAND.textLight} />
        </div>

        {loading ? (
          <div className="text-center py-12" style={{ color: BRAND.textLight }}>جاري التحميل...</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-base font-bold mb-3 flex items-center gap-2" style={{ color: BRAND.maroon }}>
                <Check size={18} />
                الردود المستلمة ({completedCount})
              </h3>
              <div className="space-y-2">
                {responses.length === 0 ? (
                  <div
                    className="p-8 rounded-xl text-center text-sm"
                    style={{ background: 'white', color: BRAND.textLight, border: `2px dashed ${BRAND.border}` }}
                  >
                    لم يتم استلام أي ردود بعد
                  </div>
                ) : (
                  responses.map(r => (
                    <div
                      key={r.doctorId}
                      className="p-4 rounded-xl bg-white border-2 hover:shadow-md transition-all"
                      style={{ borderColor: BRAND.border }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => setSelectedDoctor(r)}
                        >
                          <div className="font-bold text-sm" style={{ color: BRAND.maroon }}>{r.doctorName}</div>
                          <div className="text-xs mt-1" style={{ color: BRAND.textLight }}>
                            {r.procedures.length + r.customProcedures.length} إجراء
                            {r.specialty !== 'surgery' && ` · ${r.devices.length} جهاز`}
                          </div>
                          <div className="text-[10px] mt-1" style={{ color: BRAND.textLight }}>
                            {new Date(r.submittedAt).toLocaleString('ar-SA')}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5 items-center">
                          <button
                            onClick={() => setSelectedDoctor(r)}
                            className="p-1.5 rounded-lg transition-all hover:opacity-80"
                            style={{ background: BRAND.peachLight, color: BRAND.maroon }}
                            title="عرض التفاصيل"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setConfirmDelete(r); }}
                            className="p-1.5 rounded-lg transition-all hover:opacity-80"
                            style={{ background: '#FEE', color: '#B91C1C' }}
                            title="حذف الرد"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold mb-3 flex items-center gap-2" style={{ color: BRAND.textLight }}>
                <AlertCircle size={18} />
                بانتظار الرد ({pendingDoctors.length})
              </h3>
              <div className="space-y-2">
                {pendingDoctors.length === 0 ? (
                  <div
                    className="p-8 rounded-xl text-center text-sm"
                    style={{ background: BRAND.peachLight, color: BRAND.maroonDark }}
                  >
                    🎉 كل الأطباء أرسلوا ردودهم!
                  </div>
                ) : (
                  pendingDoctors.map(d => (
                    <div
                      key={d.id}
                      className="p-4 rounded-xl border-2"
                      style={{ background: BRAND.cream, borderColor: BRAND.border, borderStyle: 'dashed' }}
                    >
                      <div className="font-bold text-sm" style={{ color: BRAND.text }}>{d.name}</div>
                      <div className="text-xs mt-1" style={{ color: BRAND.textLight }}>{d.title}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {selectedDoctor && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.6)' }}
            onClick={() => setSelectedDoctor(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 p-6 flex items-start justify-between" style={{ background: BRAND.maroon, color: 'white' }}>
                <div>
                  <h3 className="text-xl font-bold" style={{ color: BRAND.peach }}>{selectedDoctor.doctorName}</h3>
                  <div className="text-xs mt-1 opacity-80">{selectedDoctor.doctorTitle}</div>
                </div>
                <button onClick={() => setSelectedDoctor(null)} style={{ color: BRAND.peach }}>
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <DetailSection title="الإجراءات المختارة" items={selectedDoctor.procedures} />
                {selectedDoctor.customProcedures?.length > 0 && (
                  <DetailSection title="إجراءات مضافة" items={selectedDoctor.customProcedures} highlight />
                )}
                {selectedDoctor.specialty !== 'surgery' && (
                  <DetailSection title="الأجهزة المختارة" items={selectedDoctor.devices} />
                )}
                {selectedDoctor.notes && (
                  <div>
                    <h4 className="font-bold mb-2" style={{ color: BRAND.maroon }}>ملاحظات</h4>
                    <div
                      className="p-3 rounded-lg text-sm leading-relaxed"
                      style={{ background: BRAND.cream, color: BRAND.text }}
                    >
                      {selectedDoctor.notes}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setConfirmDelete(selectedDoctor)}
                  className="w-full py-2 rounded-lg text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ background: '#FEE', color: '#B91C1C', border: '1px solid #FCA5A5' }}
                >
                  <Trash2 size={14} />
                  حذف هذا الرد (يسمح للدكتور بإعادة التعبئة)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Custom Delete Confirmation Modal */}
        {confirmDelete && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)' }}
            onClick={() => setConfirmDelete(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: '#FEE' }}
                >
                  <AlertCircle size={24} style={{ color: '#B91C1C' }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: BRAND.maroon }}>تأكيد الحذف</h3>
                  <p className="text-xs" style={{ color: BRAND.textLight }}>هذا الإجراء لا يمكن التراجع عنه</p>
                </div>
              </div>

              <p className="text-sm mb-6 leading-relaxed" style={{ color: BRAND.text }}>
                هل أنت متأكد من حذف رد <strong>{confirmDelete.doctorName}</strong>؟
                <br />
                <span className="text-xs" style={{ color: BRAND.textLight }}>
                  بعد الحذف، الدكتور يقدر يفتح الاستبيان ويعبيه من جديد.
                </span>
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all hover:opacity-80"
                  style={{ background: BRAND.cream, color: BRAND.text, border: `1px solid ${BRAND.border}` }}
                >
                  إلغاء
                </button>
                <button
                  onClick={() => performDelete(confirmDelete.doctorId)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all hover:opacity-90"
                  style={{ background: '#B91C1C', color: 'white' }}
                >
                  نعم، احذف
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ====== MAIN APP ======
export default function App() {
  const [view, setView] = useState('landing');
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&family=Cormorant+Garamond:wght@400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    document.body.style.fontFamily = "'Tajawal', sans-serif";
    return () => { document.head.removeChild(link); };
  }, []);

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setView('survey');
  };

  const handleSubmit = (payload) => {
    setView('success');
  };

  return (
    <div style={{ fontFamily: "'Tajawal', sans-serif" }}>
      {view === 'landing' && (
        <LandingPage
          onSelectDoctor={handleSelectDoctor}
          onAdminClick={() => setView('admin-login')}
        />
      )}
      {view === 'survey' && selectedDoctor && (
        <SurveyPage
          doctor={selectedDoctor}
          onBack={() => setView('landing')}
          onSubmit={handleSubmit}
        />
      )}
      {view === 'success' && selectedDoctor && (
        <SuccessPage
          doctor={selectedDoctor}
          onBackToList={() => { setSelectedDoctor(null); setView('landing'); }}
        />
      )}
      {view === 'admin-login' && (
        <AdminLogin
          onSuccess={() => setView('admin')}
          onBack={() => setView('landing')}
        />
      )}
      {view === 'admin' && (
        <AdminDashboard onBack={() => setView('landing')} />
      )}
    </div>
  );
}
