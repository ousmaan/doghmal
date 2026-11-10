/* ————————————————————————————————————————————————
   i18n — Arabic first (Saudi colloquial), English second.

   DIALECT NOTES (لماذا هالصياغة؟):
   • "أبشر" / "حياك الله" / "الحين" / "وش تحتاج" — everyday Najrani/Saudi
     service-counter phrasing. Formal MSA reads like a government
     form; a dealership talks like a person.
   • "الكشنة", "ودّها للورشة", "آمر وش تحتاج" — the words customers
     actually hear at the counter in Najran.
   NUMERALS: Arabic-Indic (٠١٢٣٤٥٦٧٨٩) with ٬ grouping in Arabic,
   Latin digits in English — plates always show both rows.
———————————————————————————————————————————————— */

export type Lang = "ar" | "en";
export type Bi = { ar: string; en: string };

export const dict = {
  // ——— navigation ———
  "nav.home": { ar: "الرئيسية", en: "Home" },
  "nav.showroom": { ar: "معرض السيارات", en: "Showroom" },
  "nav.book": { ar: "احجز موعد", en: "Book" },
  "nav.garage": { ar: "سيارتي", en: "My Cars" },
  "nav.more": { ar: "المزيد", en: "More" },

  // ——— common ———
  "c.back": { ar: "رجوع", en: "Back" },
  "c.next": { ar: "التالي", en: "Next" },
  "c.confirm": { ar: "تأكيد", en: "Confirm" },
  "c.cancel": { ar: "إلغاء", en: "Cancel" },
  "c.close": { ar: "إغلاق", en: "Close" },
  "c.sar": { ar: "ر.س", en: "SAR" },
  "c.km": { ar: "كم", en: "km" },
  "c.seeAll": { ar: "الكل", en: "See all" },
  "c.today": { ar: "اليوم", en: "Today" },
  "c.tomorrow": { ar: "بكرة", en: "Tomorrow" },
  "c.whatsapp": { ar: "تواصل عبر واتساب", en: "Message on WhatsApp" },
  "c.call": { ar: "اتصال", en: "Call" },
  "c.copied": { ar: "نسخنا رقم الهيكل 📋", en: "VIN copied 📋" },
  "c.optional": { ar: "اختياري", en: "Optional" },
  "c.edit": { ar: "تعديل", en: "Edit" },
  "c.from": { ar: "يبدأ من", en: "From" },
  "c.step": { ar: "خطوة", en: "Step" },
  "c.of": { ar: "من", en: "of" },
  "c.min": { ar: "دقيقة", en: "min" },
  "c.hr": { ar: "ساعة", en: "hr" },
  "c.hrs": { ar: "ساعات", en: "hrs" },
  "c.free": { ar: "مجانًا", en: "Free" },
  "c.year": { ar: "الموديل", en: "Year" },
  "c.undo": { ar: "تراجع", en: "Undo" },

  // ——— home ———
  "h.welcome": { ar: "أهلاً بك في دغمل", en: "Welcome to Doghmal" },
  "h.morning": { ar: "صباح النور ☀️ يا هلا فيك", en: "Good morning ☀️ great to see you" },
  "h.evening": { ar: "مساء النور 🌙 يا هلا فيك", en: "Good evening 🌙 great to see you" },
  "h.sub": { ar: "كل أمور سيارتك… بمكان واحد", en: "Everything your car needs, in one place" },
  "h.valued": { ar: "زائر مميز", en: "Valued Customer" },
  "h.sync": { ar: "متزامن مع نظام الورشة · عرض فقط", en: "Synced with workshop system · read-only" },
  "h.syncNow": { ar: "آخر مزامنة: الحين", en: "Last sync: just now" },
  "h.pull": { ar: "اسحب للتحديث", en: "Pull to refresh" },
  "h.release": { ar: "اترك الشاشة للتحديث", en: "Release to refresh" },
  "h.refreshing": { ar: "نزامن مع نظام الورشة…", en: "Syncing with workshop…" },
  "h.jobTitle": { ar: "سيارتك الحين بالورشة", en: "Your car is in the workshop" },
  "h.jobDone": { ar: "خلصنا! سيارتكم جاهزة", en: "All done! Your car is ready" },
  "h.jobBranch": { ar: "ورشة الدهدة · خط الصيانة السريعة", en: "Al Dahdah workshop · quick lane" },
  "h.eta": { ar: "التسليم المتوقع", en: "Est. handover" },
  "h.etaVal": { ar: "اليوم ٥:٣٠ م", en: "Today 5:30 PM" },
  "h.etaDone": { ar: "بانتظارك لأي وقت", en: "Waiting for you anytime" },
  "h.liveTrack": { ar: "تتبع مباشر من نظام الورشة — بدون ما تتصل وتسأل", en: "Live from the workshop system — no need to call and ask" },
  "h.inService": { ar: "تحت الصيانة", en: "In Service" },
  "h.ready": { ar: "جاهز للتسليم", en: "Ready for Pickup" },
  "h.stage0": { ar: "استلام", en: "Check-in" },
  "h.stage1": { ar: "الفحص", en: "Diagnosis" },
  "h.stage2": { ar: "شغل الورشة", en: "In the bay" },
  "h.stage3": { ar: "الغسيل", en: "Wash & prep" },
  "h.stage4": { ar: "جاهزة", en: "Ready" },
  "h.quick": { ar: "وش ودك تسوي؟", en: "What can we do for you?" },
  "h.q.book": { ar: "حجز صيانة", en: "Book Service" },
  "h.q.bookSub": { ar: "موعدك خلال دقيقة", en: "A slot in one minute" },
  "h.q.oil": { ar: "استبدال زيت", en: "Oil Change" },
  "h.q.oilSub": { ar: "زيت أصلي + فلتر", en: "Genuine oil + filter" },
  "h.q.test": { ar: "اختبار قيادة", en: "Test Drive" },
  "h.q.testSub": { ar: "جرّبها قبل تقرر", en: "Feel it before you decide" },
  "h.q.offer": { ar: "عرض اليوم", en: "Today's Offer" },
  "h.q.offerSub": { ar: "خصم ٢٥٪ على الأجور", en: "25% off labor" },
  "h.myVehicles": { ar: "سياراتك", en: "My Vehicles" },
  "h.lastService": { ar: "آخر صيانة", en: "Last service" },
  "h.nextMaint": { ar: "الصيانة الجاية", en: "Next service" },
  "h.upcoming": { ar: "موعدك الجاي", en: "Upcoming Appointment" },
  "h.noAppt": { ar: "ما عندك مواعيد قريبة", en: "No upcoming appointments" },
  "h.noApptSub": { ar: "احجز موعد وخلي سيارتك دايم بصحتها", en: "Book a slot and keep her in top shape" },
  "h.bookNow": { ar: "احجز الحين", en: "Book now" },
  "h.cancelAppt": { ar: "إلغاء الموعد", en: "Cancel appointment" },
  "h.cancelQ": { ar: "تلغي موعدك؟", en: "Cancel this appointment?" },
  "h.cancelBody": { ar: "بنبلغ مستشارك فورًا، وتقدر تحجز من جديد بأي وقت", en: "We'll let your advisor know right away — you can rebook anytime" },
  "h.cancelled": { ar: "تم إلغاء الموعد", en: "Appointment cancelled" },
  "h.offerTitle": { ar: "حملة الشتاء وصلت ❄️", en: "Winter campaign is here ❄️" },
  "h.offerSub": { ar: "خصم ٢٥٪ على أجور الصيانة + فحص ٤٠ نقطة مجانًا", en: "25% off labor + free 40-point check" },
  "h.offerCta": { ar: "شوف العروض", en: "See offers" },
  "h.refreshNew": { ar: "وصل تحديث جديد لحالة سيارتك 🔧", en: "New update on your car 🔧" },
  "h.refreshReady": { ar: "سيارتك صارت جاهزة للتسليم! 🎉", en: "Your car is ready for pickup! 🎉" },
  "h.refreshSame": { ar: "كل البيانات محدّثة — أمورك طيبة ✅", en: "All up to date — you're good ✅" },
  "h.advisorAssigned": { ar: "مستشارك لهالموعد", en: "Your advisor for this visit" },

  // ——— advisors ———
  "a.role": { ar: "مستشار خدمة", en: "Service Advisor" },
  "a.reply5": { ar: "الرد خلال ٥ دقائق", en: "Replies within 5 min" },
  "a.rating": { ar: "تقييم", en: "rating" },
  "a.jobs": { ar: "خدمة منجزة", en: "jobs done" },
  "a.chat": { ar: "محادثة المستشار", en: "Chat with advisor" },
  "a.online": { ar: "متصل الحين · يرد بنفسه", en: "Online now · replies personally" },
  "a.waMsg": { ar: "هلا {name} 👋، معك عميل دغمل — أبي أستفسر عن سيارتي", en: "Hi {name} 👋, Doghmal customer here — I have a question about my car" },
  "chat.hint": { ar: "اكتب سؤالك أو اختر سؤال جاهز 👇", en: "Type a question or pick a quick one 👇" },
  "chat.typing": { ar: "يكتب الحين…", en: "typing…" },
  "chat.greet": { ar: "حياك الله! معك {name} من دغمل بنفسه 👋 آمر، وش تحتاج؟", en: "Welcome! {name} from Doghmal personally here 👋 how can I help?" },
  "chat.q1": { ar: "أبي أقدّم موعدي", en: "Move my appointment earlier" },
  "chat.q2": { ar: "كم التكلفة التقريبية؟", en: "What's the rough cost?" },
  "chat.q3": { ar: "وين موقع الورشة بالضبط؟", en: "Where exactly is the workshop?" },
  "chat.r1": { ar: "أبشر، أشوف لك أقرب وقت وأرجع لك خلال دقايق 🙏", en: "Sure — checking the earliest slot, back to you in minutes 🙏" },
  "chat.r2": { ar: "على حسب الخدمة؛ الزيت يبدأ من ١٥٠ ر.س والدورية من ٣٥٠. بعد الفحص أفصّل لك كل ريال", en: "Depends on the job — oil from SAR 150, routine from 350. After inspection I'll itemize every riyal" },
  "chat.r3": { ar: "أرسل لك الموقع على الواتساب 📍 فرعنا واضح على شارع الملك عبد العزيز", en: "I'll drop you the pin on WhatsApp 📍 we're right on King Abdulaziz St" },
  "chat.rGeneric": { ar: "وصلتني، بعطيك خبر أكيد بعد شوي 👍", en: "Got it — I'll confirm shortly 👍" },
  "chat.ph": { ar: "اكتب رسالتك…", en: "Type your message…" },

  // ——— showroom ———
  "s.title": { ar: "معرض السيارات", en: "Showroom" },
  "s.sub": { ar: "جديد بضمان الوكيل، ومستعمل مفحوص ٢٠٠ نقطة", en: "New with agent warranty, pre-owned with 200-point checks" },
  "s.new": { ar: "جديد", en: "New" },
  "s.used": { ar: "مستعمل", en: "Pre-owned" },
  "s.all": { ar: "الكل", en: "All" },
  "s.toyota": { ar: "تويوتا", en: "Toyota" },
  "s.jetour": { ar: "جيتور", en: "Jetour" },
  "s.haval": { ar: "هافال", en: "Haval" },
  "s.gwm": { ar: "GWM", en: "GWM" },
  "s.certified": { ar: "مفحوصة ٢٠٠ نقطة", en: "200-point inspected" },
  "s.testDrive": { ar: "احجز اختبار قيادة", en: "Book Test Drive" },
  "s.emptyTitle": { ar: "ما لقينا سيارات بهالخيارات", en: "No cars match these filters" },
  "s.emptySub": { ar: "جرّب ماركة ثانية أو غيّر التصنيف", en: "Try another brand or switch category" },
  "s.clear": { ar: "امسح الفلاتر", en: "Clear filters" },
  "s.results": { ar: "سيارة متوفرة", en: "cars available" },

  // ——— vehicle detail ———
  "v.specs": { ar: "المواصفات الكاملة", en: "Full specifications" },
  "v.engine": { ar: "المحرك", en: "Engine" },
  "v.power": { ar: "القوة", en: "Power" },
  "v.hp": { ar: "حصان", en: "hp" },
  "v.trans": { ar: "ناقل الحركة", en: "Transmission" },
  "v.drive": { ar: "نظام الدفع", en: "Drivetrain" },
  "v.seats": { ar: "المقاعد", en: "Seats" },
  "v.fuel": { ar: "الصرفية", en: "Fuel economy" },
  "v.kml": { ar: "كم/ل", en: "km/L" },
  "v.color": { ar: "اللون", en: "Color" },
  "v.vin": { ar: "رقم الهيكل (VIN)", en: "VIN" },
  "v.plate": { ar: "اللوحة والترخيص", en: "Plate & registration" },
  "v.plateReady": { ar: "جاهزة — الإفراز والتسجيل فوري", en: "Ready — instant transfer & registration" },
  "v.plateProc": { ar: "لوحة جديدة — تحت الإجراء", en: "New plate — in process" },
  "v.finance": { ar: "احسب قسطك", en: "Calculate your installment" },
  "v.financeSub": { ar: "تقدير مبدئي — بدون أي التزام", en: "Ballpark estimate — zero commitment" },
  "v.down": { ar: "الدفعة الأولى", en: "Down payment" },
  "v.term": { ar: "مدة التمويل", en: "Term" },
  "v.months": { ar: "شهر", en: "months" },
  "v.monthly": { ar: "القسط الشهري التقديري", en: "Est. monthly payment" },
  "v.financeNote": { ar: "تقدير يشمل الرسوم الإدارية وهامش ربح ٣٫٥٪ سنويًا. التمويل عبر جهات معتمدة ويخضع للموافقة الائتمانية.", en: "Estimate incl. admin fees at 3.5% annual flat rate. Financing via approved lenders, subject to credit approval." },
  "v.requestFinance": { ar: "اطلب عرض تمويل عبر واتساب", en: "Request financing via WhatsApp" },
  "v.waSales": { ar: "كلم المبيعات", en: "Chat with sales" },
  "v.leadMsg": { ar: "هلا دغمل 👋، أبي تفاصيل أكثر عن {car} موديل {year} المعروضة بـ {price} ر.س", en: "Hi Doghmal 👋, I'd like details on the {car} ({year}) listed at SAR {price}" },
  "v.finMsg": { ar: "هلا 👋، أبي عرض تمويل لـ {car} {year}: دفعة أولى {down} ر.س وعلى {term} شهر", en: "Hi 👋, financing request for {car} {year}: {down} SAR down over {term} months" },
  "v.at": { ar: "متوفرة بفرع", en: "Available at" },
  "v.kmDriven": { ar: "الممشى", en: "Mileage" },

  // ——— booking flow ———
  "b.title": { ar: "احجز موعد", en: "Book Appointment" },
  "b.st1": { ar: "الخدمة", en: "Service" },
  "b.st2": { ar: "الفرع", en: "Branch" },
  "b.st3": { ar: "المستشار", en: "Advisor" },
  "b.st4": { ar: "الموعد", en: "Time" },
  "b.st5": { ar: "التأكيد", en: "Confirm" },
  "b.s1": { ar: "وش تحتاج لسيارتك؟", en: "What does your car need?" },
  "b.s1sub": { ar: "اختر الخدمة، والأسعار تقديرية تدفعها بالفرع", en: "Pick a service — estimates are paid at the branch" },
  "b.whichCar": { ar: "على أي سيارة؟", en: "For which car?" },
  "b.otherCar": { ar: "سيارة ثانية", en: "Another car" },
  "b.s2": { ar: "أي فرع يريحك؟", en: "Which branch suits you?" },
  "b.s2sub": { ar: "٦ فروع بنجران — كلنا قريبين منك", en: "6 branches across Najran — always close by" },
  "b.open": { ar: "متاح اليوم", en: "Available today" },
  "b.busy": { ar: "زحمة بسيطة", en: "Slightly busy" },
  "b.closed": { ar: "يفتح ٤ العصر", en: "Opens 4 PM" },
  "b.driveMin": { ar: "د بالسيارة", en: "min drive" },
  "b.s3": { ar: "اختر مستشارك", en: "Pick your advisor" },
  "b.s3sub": { ar: "وجوه تعرفها — كلمهم مباشرة قبل تجي", en: "Familiar faces — message them before you come" },
  "b.s4": { ar: "متى يناسبك؟", en: "When works for you?" },
  "b.friday": { ar: "صباح الجمعة مقفل — الدوام من ٤ العصر", en: "Friday mornings closed — we open at 4 PM" },
  "b.slotTaken": { ar: "محجوز", en: "Taken" },
  "b.slotPast": { ar: "فات وقته", en: "Passed" },
  "b.s5": { ar: "راجع حجزك", en: "Review your booking" },
  "b.service": { ar: "الخدمة", en: "Service" },
  "b.vehicle": { ar: "السيارة", en: "Vehicle" },
  "b.branch": { ar: "الفرع", en: "Branch" },
  "b.advisor": { ar: "المستشار", en: "Advisor" },
  "b.dateTime": { ar: "اليوم والوقت", en: "Date & time" },
  "b.estCost": { ar: "التكلفة التقديرية", en: "Estimated cost" },
  "b.payNote": { ar: "الدفع بالفرع بعد الخدمة — ما نطلب منك أي مبلغ الحين", en: "Pay at the branch after service — nothing charged now" },
  "b.phone": { ar: "رقم جوالك للتأكيد", en: "Mobile number for confirmation" },
  "b.phonePh": { ar: "05XXXXXXXX", en: "05XXXXXXXX" },
  "b.phoneHint": { ar: "نرسل عليه تذكير الموعد — محفوظ بجهازك بس", en: "We'll text the reminder here — stored on your device only" },
  "b.phoneErr": { ar: "أدخل رقم جوال سعودي صحيح يبدأ بـ 05 (١٠ أرقام)", en: "Enter a valid Saudi mobile starting with 05 (10 digits)" },
  "b.confirmBooking": { ar: "أكّد الحجز", en: "Confirm booking" },
  "b.submitting": { ar: "نثبّت موعدك…", en: "Locking your slot…" },
  "b.success": { ar: "أبشر! انثبت موعدك", en: "Done! You're booked" },
  "b.successSub": { ar: "بنذكّرك قبل الموعد بيوم، ومستشارك بيتواصل معك لو صار أي جديد", en: "We'll remind you a day before, and your advisor will reach out with any updates" },
  "b.ref": { ar: "رقم الحجز", en: "Booking ref" },
  "b.viewAppt": { ar: "شوف موعدك بالرئيسية", en: "View on Home" },
  "b.another": { ar: "حجز ثاني", en: "New booking" },
  "b.pickService": { ar: "اختر الخدمة أول 👆", en: "Pick a service first 👆" },
  "b.pickBranch": { ar: "اختر الفرع أول 👆", en: "Pick a branch first 👆" },
  "b.pickAdvisor": { ar: "اختر مستشارك أول 👆", en: "Pick your advisor first 👆" },
  "b.pickTime": { ar: "اختر اليوم والوقت أول 👆", en: "Pick a day & time first 👆" },
  "b.testDriveFor": { ar: "اختبار قيادة على", en: "Test drive for" },
  "b.hours": { ar: "الدوام", en: "Hours" },

  // ——— services ———
  "sv.routine": { ar: "صيانة دورية", en: "Routine Maintenance" },
  "sv.routineSub": { ar: "فحص شامل حسب جدول الوكيل", en: "Full check per the agent schedule" },
  "sv.oil": { ar: "استبدال زيت", en: "Oil Change" },
  "sv.oilSub": { ar: "زيت تويوتا الأصلي + فلتر", en: "Genuine Toyota oil + filter" },
  "sv.elec": { ar: "فحص كهربائي", en: "Electrical Diagnosis" },
  "sv.elecSub": { ar: "بطارية، كمبيوتر، حساسات", en: "Battery, ECU, sensors" },
  "sv.repair": { ar: "إصلاح عام", en: "General Repair" },
  "sv.repairSub": { ar: "مكاين، تعليق، فرامل…", en: "Engine, suspension, brakes…" },
  "sv.test": { ar: "اختبار قيادة", en: "Test Drive" },
  "sv.testSub": { ar: "لفّة مع مستشار المبيعات", en: "A spin with our sales advisor" },
  "sv.dur.45": { ar: "٤٥ دقيقة تقريبًا", en: "~45 minutes" },
  "sv.dur.60": { ar: "ساعة تقريبًا", en: "~1 hour" },
  "sv.dur.150": { ar: "٢–٣ ساعات", en: "2–3 hours" },
  "sv.dur.vary": { ar: "حسب الحالة", en: "Depends on the job" },
  "sv.dur.30": { ar: "٣٠ دقيقة", en: "30 minutes" },

  // ——— garage ———
  "g.title": { ar: "سيارتي", en: "My Cars" },
  "g.sub": { ar: "كراجك الرقمي — كل سيارة وملفها كامل", en: "Your digital garage — every car, full file" },
  "g.emptyTitle": { ar: "لا توجد سيارات بعد", en: "No vehicles yet" },
  "g.emptySub": { ar: "أضف سيارتك الأولى — VIN أو رقم اللوحة — وشوف ملفاتها وصيانتها هنا", en: "Add your first car — VIN or plate number — and see its file & service history here" },
  "g.add": { ar: "إضافة سيارة", en: "Add Vehicle" },
  "g.odo": { ar: "العداد", en: "Odometer" },
  "g.warranty": { ar: "الضمان", en: "Warranty" },
  "g.wActive": { ar: "ساري", en: "Active" },
  "g.wExpiring": { ar: "قارب الانتهاء", en: "Expiring soon" },
  "g.wExpired": { ar: "منتهي", en: "Expired" },
  "g.nextService": { ar: "موعد الصيانة الجاية", en: "Next service milestone" },
  "g.atKm": { ar: "عند", en: "at" },
  "g.remaining": { ar: "باقي", en: "Remaining" },
  "g.recService": { ar: "التوصية: صيانة دورية", en: "Recommended: routine service" },
  "g.wAgent": { ar: "ضمان الوكيل — عبداللطيف جميل", en: "Agent warranty — Abdul Latif Jameel" },
  "g.wAgentSub": { ar: "٣ سنوات أو ١٠٠٬٠٠٠ كم — أيهما أسبق", en: "3 years or 100,000 km — whichever first" },
  "g.wPaint": { ar: "ضمان الدهان والصدأ", en: "Paint & rust warranty" },
  "g.wPaintSub": { ar: "٣ سنوات ضد عيوب التصنيع", en: "3 years against manufacturing defects" },
  "g.until": { ar: "ساري حتى", en: "Valid until" },
  "g.recallOk": { ar: "ما فيه استدعاءات مفتوحة", en: "No open recalls" },
  "g.recallOkSub": { ar: "فحصنا سجل الشركة اليوم — سيارتك سليمة", en: "Checked the OEM registry today — all clear" },
  "g.recallOpen": { ar: "استدعاء مفتوح: وسادة هوائية", en: "Open recall: airbag module" },
  "g.recallOpenSub": { ar: "الإجراء مجاني ويأخذ ٤٥ دقيقة — لا تأجله", en: "Free fix, takes 45 minutes — don't postpone it" },
  "g.recallCta": { ar: "احجز الاستدعاء مجانًا", en: "Book the free recall fix" },
  "g.history": { ar: "سجل الصيانة", en: "Service History" },
  "g.visits": { ar: "زيارات", en: "visits" },
  "g.inv": { ar: "فاتورة", en: "Invoice" },
  "g.historyEmpty": { ar: "السجل فاضي للحين", en: "No records yet" },
  "g.historyEmptySub": { ar: "أول ما تزور ورشتنا، الفواتير تظهر هنا تلقائيًا — بدون ما ترفع ولا ورقة", en: "Visit any branch and invoices appear here automatically — zero paperwork" },
  "g.bookForCar": { ar: "حجز صيانة لهذه السيارة", en: "Book Service for This Vehicle" },
  "g.addTitle": { ar: "أضف سيارتك للكراج", en: "Add your car" },
  "g.addSub": { ar: "عبّي الأساسيات والباقي نجيبه من النظام", en: "Just the basics — we pull the rest from the system" },
  "g.nickname": { ar: "اسم الدلع", en: "Nickname" },
  "g.nicknamePh": { ar: "مثلاً: الكشنة", en: "e.g. The Workhorse" },
  "g.model": { ar: "الموديل", en: "Model" },
  "g.yearF": { ar: "سنة الصنع", en: "Year" },
  "g.vinF": { ar: "رقم الهيكل VIN", en: "VIN number" },
  "g.vinHint": { ar: "١٧ خانة — تلقاه بالاستمارة أو تحت الزجاج", en: "17 characters — on the registration or under the windshield" },
  "g.vinErr": { ar: "رقم الهيكل لازم يكون ١٧ خانة بالضبط", en: "VIN must be exactly 17 characters" },
  "g.vinOrPlate": { ar: "أدخل رقم الهيكل كامل أو رقم اللوحة — واحد منهم يكفي", en: "Enter the full VIN or the plate number — either one works" },
  "g.vinMissing": { ar: "بانتظار رقم الهيكل من النظام", en: "Awaiting VIN from the system" },
  "g.nameErr": { ar: "سمّ سيارتك أول 🙂", en: "Give your car a name first 🙂" },
  "g.plateF": { ar: "حروف اللوحة", en: "Plate letters" },
  "g.plateN": { ar: "أرقام اللوحة", en: "Plate numbers" },
  "g.save": { ar: "أضف السيارة", en: "Add vehicle" },
  "g.added": { ar: "أضفنا سيارتك للكراج 🚗", en: "Added to your garage 🚗" },
  "g.readonlyNote": { ar: "السجل والضمان والاستدعاءات تنقرأ من أنظمة الوكيل — ما نعدّل عليها، بس نورّيك إياها", en: "History, warranty & recalls are read from agent systems — we never edit, just show" },

  // ——— more ———
  "m.title": { ar: "المزيد", en: "More" },
  "m.offers": { ar: "عروض وحملات", en: "Offers & Campaigns" },
  "m.offersSub": { ar: "٤ عروض شغالة الحين — منها ليالي رمضان", en: "4 live campaigns — incl. Ramadan nights" },
  "m.program": { ar: "البرنامج الدوري", en: "Periodic Maintenance Program" },
  "m.programSub": { ar: "ادفع مرة وارتاح سنة", en: "Pay once, relax for a year" },
  "m.language": { ar: "اللغة", en: "Language" },
  "m.about": { ar: "عن دغمل", en: "About Doghmal" },
  "m.aboutSub": { ar: "من نجران، ولأهل نجران", en: "From Najran, for Najran" },
  "m.contact": { ar: "اتصل بنا", en: "Contact Us" },
  "m.contactSub": { ar: "٦ فروع + رقم موحد", en: "6 branches + unified line" },
  "m.logout": { ar: "تسجيل الخروج", en: "Logout" },
  "m.logoutQ": { ar: "تطلع من حسابك؟", en: "Log out?" },
  "m.logoutBody": { ar: "بياناتك محفوظة عندنا، وترجع لنا بأي وقت — حياك الله", en: "Your data stays safe — come back anytime" },
  "m.logoutYes": { ar: "خروج", en: "Log out" },
  "m.stay": { ar: "ابقَ", en: "Stay" },
  "m.version": { ar: "دغمل · النسخة التجريبية ١٫٠ — الطبقة الرقمية (Tier 1)", en: "Doghmal · Prototype 1.0 — Digital Layer (Tier 1)" },
  "m.loyalty": { ar: "نادي دغمل", en: "Doghmal Club" },
  "m.loyaltyTier": { ar: "عضوية فضية", en: "Silver member" },
  "m.points": { ar: "نقطة", en: "pts" },
  "m.toGold": { ar: "نقطة وتوصل الذهبية", en: "pts to Gold" },
  "m.redeem": { ar: "استبدل نقاطك", en: "Redeem points" },
  "m.redeemMsg": { ar: "هلا 👋، أبي أستبدل نقاط نادي دغمل — عضويتي فضية", en: "Hi 👋, I'd like to redeem my Doghmal Club points — Silver member" },
  "m.endsIn": { ar: "ينتهي خلال", en: "Ends in" },
  "m.days": { ar: "يوم", en: "days" },
  "m.endsToday": { ar: "ينتهي اليوم!", en: "Ends today!" },
  "m.grabOffer": { ar: "استفد من العرض", en: "Claim offer" },
  "m.offerMsg": { ar: "هلا 👋، أبي أستفيد من عرض «{title}»", en: "Hi 👋, I'd like to claim the “{title}” offer" },
  "m.programTitle": { ar: "برنامج الصيانة الدوري", en: "Periodic Maintenance Program" },
  "m.programIntro": { ar: "باقات مدفوعة مقدمًا بأسعار مثبّتة — تحجز بأي فرع من فروعنا الستة، وكل زيارة تنحسب تلقائيًا", en: "Prepaid packages at locked-in prices — redeem at any of our 6 branches, visits tracked automatically" },
  "m.visits4": { ar: "٤ زيارات بالسنة", en: "4 visits / year" },
  "m.tier.basic": { ar: "الأساسية", en: "Basic" },
  "m.tier.plus": { ar: "بلس", en: "Plus" },
  "m.tier.full": { ar: "الشاملة", en: "Complete" },
  "m.subscribe": { ar: "اشترك عبر واتساب", en: "Subscribe via WhatsApp" },
  "m.progMsg": { ar: "هلا 👋، أبي أشترك بباقة «{tier}» من البرنامج الدوري", en: "Hi 👋, I'd like the “{tier}” maintenance package" },
  "m.aboutBody": { ar: "دغمل التجارية شركة سعودية من نجران، وكيل فرعي معتمد لتويوتا عبر عبداللطيف جميل، وموزع معتمد لقطع غيار GWM وهافال. من ١٩٩٤ واحنا نخدم أهل المنطقة بستة فروع: ورش، معرض سيارات، وقطع غيار أصلية.", en: "Doghmal Trading Co. is a Saudi company from Najran — an authorized Toyota sub-agent through Abdul Latif Jameel and a certified GWM/Haval parts distributor. Since 1994 we've served the region across six branches: workshops, showroom, and genuine parts." },
  "m.tier1Title": { ar: "وش يعني «الطبقة الرقمية»؟", en: "What is the “digital layer”?" },
  "m.tier1Body": { ar: "هذا التطبيق ما يستبدل أنظمتنا الحالية — يقرأ منها بس. مواعيدك وفواتيرك وحالة سيارتك توصلك من نفس نظام الورشة، بدون ترحيل بيانات ولا تغيير بطريقة شغلنا. التقنية تخدمك، والشغل يبقى شغلنا.", en: "This app doesn't replace our existing systems — it reads from them. Your appointments, invoices and job status come straight from the same workshop system, with zero migration and zero disruption. Tech serves you; the craft stays ours." },
  "m.contactTitle": { ar: "حنا قريبين منك", en: "We're close by" },
  "m.unified": { ar: "الرقم الموحد", en: "Unified number" },
  "m.workHours": { ar: "السبت–الخميس ٧ص–١٠م · الجمعة ٤م–١٠م", en: "Sat–Thu 7AM–10PM · Fri 4PM–10PM" },
  "m.callBranch": { ar: "اتصل", en: "Call" },

  // ——— login ———
  "l.welcome": { ar: "حياك الله من جديد", en: "Welcome back" },
  "l.sub": { ar: "سجّل دخولك وتابع سيارتك أول بأول", en: "Sign in and keep an eye on your car" },
  "l.nafath": { ar: "الدخول عبر نفاذ", en: "Sign in with Nafath" },
  "l.guest": { ar: "ادخل كزائر مميز", en: "Enter as Valued Guest" },
  "l.nafathNote": { ar: "نموذج تجريبي — جرّب دخول الزائر", en: "Prototype — try guest access" },
  "l.demoNote": { ar: "كل البيانات محلية على جهازك وما تنرسل لأي مكان", en: "All data stays on your device" },
  "l.hello": { ar: "أهلاً فيك من جديد 👋", en: "Good to have you back 👋" },
  "l.bye": { ar: "الله معك — نشوفك على خير 👋", en: "See you soon 👋" },
} as const;

export type TKey = keyof typeof dict;

export function tr(lang: Lang, key: TKey): string {
  return dict[key]?.[lang] ?? key;
}

export function fill(tpl: string, vars: Record<string, string | number>): string {
  return tpl.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

/* Arabic-Indic numerals in Arabic (٬ grouping, ٫ decimal), Latin in English.
   VINs and wa.me message payloads intentionally stay Latin for systems. */
const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";
export function digits(v: string | number, lang: Lang): string {
  const s = String(v);
  if (lang !== "ar") return s;
  return s.replace(/[0-9]/g, (d) => AR_DIGITS[+d]).replace(/,/g, "٬").replace(/\.(?=\d)/g, "٫");
}

export function money(n: number, lang: Lang = "en"): string {
  return digits(n.toLocaleString("en-US"), lang);
}

export function fmtDate(iso: string, lang: Lang, opts?: Intl.DateTimeFormatOptions): string {
  const d = new Date(iso + (iso.length === 10 ? "T12:00:00" : ""));
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-u-ca-gregory" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...opts,
  }).format(d);
}

export function weekday(iso: string, lang: Lang): string {
  const d = new Date(iso + "T12:00:00");
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-u-ca-gregory" : "en-GB", { weekday: "short" }).format(d);
}

export function fmtTime(t: string, lang: Lang): string {
  const [h, m] = t.split(":").map(Number);
  const ampm = h < 12 ? (lang === "ar" ? "ص" : "AM") : lang === "ar" ? "م" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return digits(`${h12}:${String(m).padStart(2, "0")}`, lang) + ` ${ampm}`;
}

export function isoPlus(days: number): string {
  const d = new Date(Date.now() + days * 864e5);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
