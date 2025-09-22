import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- Data Interfaces ---
interface Word {
  word: string;
  meaning?: string;
}

type VersePart = Word[];

interface Verse {
  num: number;
  part1: VersePart;
  part2: VersePart;
  explanation?: VerseExplanation;
}

interface VerseExplanation {
  explanation: string;
  vocabulary: { term: string; meaning: string; }[];
  rhetoric: { type: string; example: string; explanation: string; }[];
}

interface Question {
  questionText: string;
  options: string[];
  correctAnswer: string;
}

const verseExplanationsData: { num: number, data: VerseExplanation }[] = [
    {
        num: 1,
        data: {
            explanation: "يبدأ الشاعر قصيدته بدعاء على قلبه بالهلاك والفناء العاجل، معاتباً إياه على استسلامه الكامل لمن يحب، حتى جعله سيداً ومتحكماً فيه، وهذا استسلام لا يرضاه الشاعر.",
            vocabulary: [
                { term: "عدمتك عاجلاً", meaning: "دعاء بالفناء والهلاك السريع." },
                { term: "ربّاً", meaning: "سيداً ومسيطراً." }
            ],
            rhetoric: [
                { type: "نداء", example: "يا قلبُ", explanation: "استخدم الشاعر أسلوب النداء لتشخيص القلب ومخاطبته مباشرة، مما يبرز شدة معاناته الداخلية." },
                { type: "استفهام استنكاري", example: "أَتَجعَلُ مَن هَويتَ عَلَيكَ رَبّا", explanation: "الغرض منه ليس طلب إجابة، بل الإنكار والتعجب من فعل القلب الذي رفع منزلة الحبيب إلى درجة الربوبية والتحكم الكامل." }
            ]
        }
    },
    {
        num: 2,
        data: {
            explanation: "يستمر الشاعر في توبيخ قلبه، متسائلاً عن أي منطق أو رأي سديد اتبعه حين سلّم أمره بالكامل لمحبوبته التي لا تبادله الود، بل تسقيه المرارة بدل العذوبة.",
            vocabulary: [
                { term: "مشورة", meaning: "نصيحة واستشارة." },
                { term: "عذبا", meaning: "ماءً حلواً، والمقصود هنا هو الوصال واللطف في المعاملة." }
            ],
            rhetoric: [
                { type: "استفهام استنكاري", example: "بِأَيِّ مَشورَةٍ وَبِأَيِّ رَأيٍ", explanation: "يؤكد الشاعر على أن قرار القلب كان خالياً من أي حكمة أو بصيرة." },
                { type: "استعارة", example: "وَلا تَسقيكَ عَذبا", explanation: "شبه الشاعر لطف المحبوبة ووصالها بالماء العذب، وحرمانها له منه دليل على قسوتها." }
            ]
        }
    },
    {
        num: 3,
        data: {
            explanation: "يصور الشاعر معاناة قلبه المستمرة، فهو دائم الشوق والحنين إلى حبيبته (حبّى)، على الرغم من أن هذا الحب قد جلب له الكرب والشدة العظيمين.",
            vocabulary: [
                { term: "تحنُّ", meaning: "تشتاق." },
                { term: "صبابةً", meaning: "حرقة الشوق ولوعته." },
                { term: "كربتك كربا", meaning: "أوقعتك في شدة عظيمة." }
            ],
            rhetoric: [
                { type: "تجسيد", example: "تحنُّ صبابةً", explanation: "إسناد الحنين والشوق للقلب يجسده ككائن حي يشعر ويتألم." },
                { type: "مفعول مطلق", example: "كربتك كربا", explanation: "يؤكد شدة المعاناة وعمق الكرب الذي سببه هذا الحب." }
            ]
        }
    },
    {
        num: 4,
        data: {
            explanation: "يعجب الشاعر من إعراض قلبه عن جميع النساء وتكريس حبه وولائه لمحبوبة واحدة، وكأنه قد أخذ على نفسه عهداً أو نذراً بأن لا يحب غيرها، وهو عهد يجلب له الشقاء.",
            vocabulary: [
                { term: "تهتجر", meaning: "تترك وتبتعد عن." },
                { term: "ضامن", meaning: "كفيل أو متعهد." },
                { term: "نحبا", meaning: "نذراً أو عهداً." }
            ],
            rhetoric: [
                { type: "تشبيه", example: "كَأَنَّكَ ضامِنٌ مِنهُنَّ نَحبا", explanation: "يشبه حال قلبه في إعراضه عن النساء بحال من أقسم على ذلك، مما يبرز شدة إخلاصه غير المبرر." }
            ]
        }
    },
    {
        num: 5,
        data: {
            explanation: "يتساءل الشاعر متعجباً: أمن أجل فتاة جميلة وعطرة كريحانة، يقضي ليله خائفاً قلقاً، ونهاره متيماً مشغولاً بها؟!",
            vocabulary: [
                { term: "ريحانة", meaning: "نبتة طيبة الرائحة، ويقصد بها فتاة جميلة." },
                { term: "مروّعاً", meaning: "خائفاً ومفزوعاً." },
                { term: "صبّا", meaning: "عاشقاً شديد الشوق." }
            ],
            rhetoric: [
                { type: "استعارة تصريحية", example: "رَيحانَةٍ", explanation: "استعار لفظ الريحانة للمحبوبة لجمالها وطيبها." },
                { type: "مقابلة", example: "تَبيتُ مُرَوَّعاً وَتَظَلُّ صَبّا", explanation: "مقابلة بين حاله ليلاً (الخوف) ونهاره (العشق) تبرز استمرارية معاناته." }
            ]
        }
    },
    {
        num: 6,
        data: {
            explanation: "يصف الشاعر حالة قلبه المزرية، حيث أصبح يخاف من رفاقه ويبتعد عنهم، مفضلاً الانفراد بنفسه مع هواجسه وأفكاره، منهمكاً في التفكير بمحبوبته.",
            vocabulary: [
                { term: "تروع", meaning: "تخاف وتفزع." },
                { term: "الوسواس", meaning: "الأفكار والهواجس السيئة." },
                { term: "مكبا", meaning: "ملازماً ومنهمكاً." }
            ],
            rhetoric: [
                { type: "تجسيد", example: "تَروعُ مِنَ الصِحابِ", explanation: "يصور القلب كشخص يشعر بالخوف والرهبة من الآخرين." }
            ]
        }
    },
    {
        num: 7,
        data: {
            explanation: "يخاطب الشاعر قلبه قائلاً: يبدو أنك قد أُعميت عن رؤية أي جمال آخر في العالم سواها، وكأنها فريدة من نوعها ولا يوجد لها مثيل بين الناس.",
            vocabulary: [
                { term: "ضربا", meaning: "مثيلاً أو شبيهاً." }
            ],
            rhetoric: [
                { type: "كناية", example: "لا تَرى حَسَناً سِواها", explanation: "كناية عن شدة تعلقه بها وإعجابه الذي طغى على كل شيء آخر." }
            ]
        }
    },
    {
        num: 8,
        data: {
            explanation: "يذكّر الشاعر قلبه بالشدائد والمخاطر التي تجاوزها في سبيل لقاء محبوبته سراً، ويتساءل بمرارة: هل زادك كل هذا العناء قرباً منها؟ والجواب بالنفي طبعاً.",
            vocabulary: [
                { term: "غمرة", meaning: "شدة ومحنة." },
                { term: "جواز فين", meaning: "اجتياز مكان الهلاك والمخاطر." }
            ],
            rhetoric: [
                { type: "استفهام إنكاري", example: "فَهَل تَزدادُ قُربا", explanation: "استفهام غرضه النفي، أي أن كل هذه المخاطرة لم تجلب له أي قرب حقيقي." }
            ]
        }
    },
    {
        num: 9,
        data: {
            explanation: "يتحسر الشاعر على حال قلبه، فقد بكى من لوعة الهوى وهو لا يزال في بدايته كطفل صغير، فكيف سيكون حاله وكيف ستكون معاناته عندما يشتد هذا الهوى ويصبح شاباً قوياً؟",
            vocabulary: [
                { term: "شبّا", meaning: "أصبح شاباً واكتمل نموه." },
                { term: "ويلك", meaning: "دعاء بالهلاك، تعبيراً عن الشفقة والتحذير." }
            ],
            rhetoric: [
                { type: "استعارة", example: "هَواكَ طِفلٌ... حينَ شَبّا", explanation: "شبه الهوى في بدايته بالطفل وفي قوته بالشاب، وهي استعارة تبرز تطور المعاناة." }
            ]
        }
    },
    {
        num: 10,
        data: {
            explanation: "يصف كيف أن الصباح لا يأتيه بالراحة، بل يجدد عليه أحزان الصبوة والشوق، وتنهال عليه الهموم من كل جانب كأنها تُصب عليه صبّاً.",
            vocabulary: [
                { term: "التصابي", meaning: "الشوق واللهفة إلى أيام الشباب واللهو." },
                { term: "أطراب", meaning: "هموم وأحزان." }
            ],
            rhetoric: [
                { type: "استعارة مكنية", example: "صَبَّحَكَ التَصابي", explanation: "شبه التصابي بإنسان يأتيه في الصباح." },
                { type: "تجسيم", example: "تُصَبُّ عَلَيكَ صَبّا", explanation: "يجسم الهموم كشيء مادي يُسكب عليه، مما يوضح كثرتها وشدتها." }
            ]
        }
    },
    {
        num: 11,
        data: {
            explanation: "وكما أن صباحه مؤلم، فمساءه أشد مرارة، حيث يسيطر عليه الهوى ويقلبه على فراشه من جنب إلى جنب، مانعاً عنه الراحة والنوم.",
            vocabulary: [
                { term: "جنباً فجنبا", meaning: "من جانب إلى آخر، كناية عن الأرق وعدم الاستقرار." }
            ],
            rhetoric: [
                { type: "استعارة مكنية", example: "يُقَلِّبُكَ الهَوى", explanation: "شبه الهوى بإنسان له سلطان وقوة يقلب الشاعر كيفما يشاء." }
            ]
        }
    },
    {
        num: 12,
        data: {
            explanation: "يصل الشاعر إلى ذروة اليأس، فيتوقع أن قلبه سيموت في نهاية المطاف ليس من الحب نفسه، بل من الخوف الشديد من فراق المحبوبة.",
            vocabulary: [
                { term: "حذار", meaning: "خوف وتجنب." },
                { term: "البين", meaning: "الفراق." },
                { term: "رعبا", meaning: "خوفاً شديداً يصل إلى حد الفزع." }
            ],
            rhetoric: [
                { type: "مبالغة", example: "سَوفَ تَموتُ رُعبا", explanation: "مبالغة في تصوير شدة الخوف من الفراق، وأثره المدمر على القلب." }
            ]
        }
    },
    {
        num: 13,
        data: {
            explanation: "يخاطب قلبه قائلاً: أنت تظهر الخوف والرهبة بينما تخفي في داخلك رغبة جامحة في الوصال. لقد عذبتني بهذا التناقض بين ما تظهره وما تبطنه.",
            vocabulary: [
                { term: "رهبة", meaning: "خوف مع تعظيم." },
                { term: "رغبا", meaning: "رغبة وأمل." }
            ],
            rhetoric: [
                { type: "طباق", example: "رَهبَةً / رَغباً", explanation: "الجمع بين الخوف والرغبة يبرز التناقض النفسي الذي يعيشه الشاعر." }
            ]
        }
    },
    {
        num: 14,
        data: {
            explanation: "يؤكد الشاعر لقلبه أنه لن ينال من ود محبوبته إلا الوعود الكاذبة التي لا تتحقق، فينصحه بأن ييأس تماماً، فحصيلته من هذا الحب ستكون لا شيء (التراب).",
            vocabulary: [
                { term: "عدة", meaning: "وعد." },
                { term: "تربا", meaning: "تراباً، وهي كناية عن الخيبة والفشل التام." }
            ],
            rhetoric: [
                { type: "كناية", example: "فَخُذ بِيَدَيكَ تُربا", explanation: "كناية عن الخيبة المطلقة، فمن يذهب ليأخذ شيئاً ويعود بالتراب لم يحصل على شيء ذي قيمة." }
            ]
        }
    },
    {
        num: 15,
        data: {
            explanation: "يقدم الشاعر حكمة لقلبه (ولنفسه): إذا وجدت وداً صادقاً ودائماً، ووداً آخر متقلباً وجافياً، فعليك أن تترك من يعاملك بجفاء وتتمسك بمن هو مخلص ودائم لك.",
            vocabulary: [
                { term: "جفا", meaning: "ابتعد وأعرض." },
                { term: "أربّ", meaning: "أقام وثبت ودام." }
            ],
            rhetoric: [
                { type: "طباق", example: "جَفا / أَرَبَّ", explanation: "طباق بين الجفاء والثبات يوضح الفكرة ويدعو لاختيار الصواب." },
                { type: "أمر للنصح", example: "فَجانِب مَن جَفاكَ", explanation: "أسلوب أمر غرضه النصح والإرشاد." }
            ]
        }
    },
    {
        num: 16,
        data: {
            explanation: "ينتقل الشاعر إلى حكمة عامة، فينصح بترك الخصومة مع الشخص البخيل إذا تمادى في بخله، لأن البخل طبع متأصل فيه يجعله معادياً لكل ما هو معروف وخير.",
            vocabulary: [
                { term: "شغب", meaning: "خصومة وإثارة للشر." },
                { term: "البخيل", meaning: "من يمنع ما عنده." }
            ],
            rhetoric: [
                { type: "حكمة", example: "البيت بأكمله", explanation: "يقدم البيت حكمة اجتماعية حول التعامل مع البخلاء." }
            ]
        }
    },
    {
        num: 17,
        data: {
            explanation: "تعود الأبيات للمحبوبة، حيث تنقل عنها قولها كعذر لعدم اللقاء: إنها دائماً تحت المراقبة، فهي تخاف من الوشاة (القيّم) ومن حارسها أو زوجها (الكلب).",
            vocabulary: [
                { term: "عين", meaning: "جاسوس أو رقيب." },
                { term: "قيّم", meaning: "الرقيب أو الوشاة." },
                { term: "كلب", meaning: "قد يقصد به حارس أو شخص لئيم يراقبها." }
            ],
            rhetoric: [
                { type: "كناية", example: "عَلَيَّ عَينٌ", explanation: "كناية عن وجود من يراقبها باستمرار." }
            ]
        }
    },
    {
        num: 18,
        data: {
            explanation: "هنا، يكشف الشاعر عن خداع المحبوبة، فهي قد غشت وخدعت بينما كان هو غافلاً. فينصح نفسه (وقلبه) بأن يكون خادعاً وماكراً بدوره عندما يقابل شخصاً مخادعاً، كنوع من الدفاع عن النفس.",
            vocabulary: [
                { term: "خبّت", meaning: "خدعت وغشت." },
                { term: "ساهٍ", meaning: "غافل وغير منتبه." },
                { term: "خبّاً", meaning: "شخصاً مخادعاً وماكراً." }
            ],
            rhetoric: [
                { type: "طباق", example: "خبّت عليك وأنت ساهٍ", explanation: "طباق بين الخداع والغفلة يوضح المفارقة." },
                { type: "أمر للنصح", example: "فَكُن خِبّاً", explanation: "الأمر هنا ليس للدعوة للخداع كطبع، بل كنصيحة للتعامل بالمثل مع من يخدعك." }
            ]
        }
    },
    {
        num: 19,
        data: {
            explanation: "يحذر الشاعر قلبه من الاغترار بوعود محبوبته (حبّى)، لأن وعودها كاذبة ولا تأتي بخير، بل تجلب القحط والجدب بدلاً من الخصب والوفاء.",
            vocabulary: [
                { term: "لا تغررك", meaning: "لا تخدعك." },
                { term: "جدبا", meaning: "قحطاً ويبساً، كناية عن عدم الوفاء بالوعود." }
            ],
            rhetoric: [
                { type: "استعارة", example: "أَنزَلنَ جَدبا", explanation: "شبه الشاعر نتائج وعودها الكاذبة بالأرض القاحلة، مما يجسد الخيبة والأمل الضائع." }
            ]
        }
    },
    {
        num: 20,
        data: {
            explanation: "يختتم الشاعر عتابه بنداء أخير لقلبه، يحثه فيه على الصبر والسلوان، فقد طال عذابه وعذاب الشاعر معه، ولقد اكتفى من هذا الشقاء.",
            vocabulary: [
                { term: "التعزي", meaning: "التصبر والسلوان." },
                { term: "حسبا", meaning: "كفاية، أي لقد نالني ما يكفيني من العذاب." }
            ],
            rhetoric: [
                { type: "استفهام للتمني", example: "هَل لَكَ في التَعَزّي", explanation: "استفهام لا يقصد به السؤال بل التمني والحث على الصبر." }
            ]
        }
    },
    {
        num: 21,
        data: {
            explanation: "يتساءل الشاعر بمرارة عن الجدوى من تعليق الأمل بصديق أو حبيب يعتبر إخلاصك ووفاءك في الحب ذنباً يستحق عليه اللوم والعتاب.",
            vocabulary: [
                { term: "تأمل", meaning: "ترجو وتتوقع." },
                { term: "يعد", meaning: "يعتبر." }
            ],
            rhetoric: [
                { type: "استفهام إنكاري", example: "البيت بأكمله", explanation: "ينكر الشاعر إمكانية وجود أي أمل في علاقة كهذه، حيث يُقابل الإخلاص بالجحود." }
            ]
        }
    },
    {
        num: 22,
        data: {
            explanation: "يصور الشاعر مدى جحود المحبوبة، فهي تعامله بقسوة كما لو كان قد ارتكب جريمة كبرى بحقها، كأن يكون قد قتل أحد أقاربها أو شن عليها حرباً.",
            vocabulary: [
                { term: "جنيت", meaning: "ارتكبت جناية أو ذنباً عظيماً." },
                { term: "حربا", meaning: "قتالاً ومعركة." }
            ],
            rhetoric: [
                { type: "تشبيه", example: "كَأَنَّكَ قَد قَتَلتَ...", explanation: "يشبه الشاعر نظرة المحبوبة لحبه بنظرتها لجريمة قتل، مما يبرز مدى قسوتها ونكرانها." }
            ]
        }
    },
    {
        num: 23,
        data: {
            explanation: "يختتم الشاعر القصيدة بحكمة توصل إليها من خلال تجربته، وهي أن القلب بطبيعته لا يميل إلى من يكرهه أو يعاديه، بل يختار دائماً أن يزور ويتقرب ممن يحبهم.",
            vocabulary: [
                { term: "بغيضاً", meaning: "شخصاً مكروهاً." },
                { term: "يؤثر", meaning: "يفضّل ويختار." }
            ],
            rhetoric: [
                { type: "حكمة", example: "البيت بأكمله", explanation: "يقدم حكمة عن طبيعة القلب الإنسانية في الميل لمن يحب، وفيها تسليم بقوة العاطفة." }
            ]
        }
    }
];

const vocabularyData = [
  { word: "التَصابي", meaning: "الميل إلى اللهو والصبوة." },
  { word: 'التَعَزّي', meaning: 'التصبر والسلوان.' },
  { word: 'البَينِ', meaning: 'الفراق.' },
  { word: 'الوسواس', meaning: 'الأفكار والهواجس السيئة.' },
  { word: 'أَرَبّا', meaning: 'لزم وأقام وثبت.' },
  { word: 'أَطرابٌ', meaning: 'الهموم والأحزان.' },
  { word: 'بَغيضاً', meaning: 'شخصاً مكروهاً.' },
  { word: 'تَأمل', meaning: 'ترجو وتتوقع.' },
  { word: 'تَروعُ', meaning: 'تخاف وتفزع.' },
  { word: 'تُربa', meaning: 'تراباً، كناية عن الخيبة.' },
  { word: 'تَهتَجِرُ', meaning: 'تترك وتبتعد عن.' },
  { word: 'جَفا', meaning: 'ابتعد وأعرض.' },
  { word: 'جَدبا', meaning: 'قحطاً، كناية عن عدم الوفاء.' },
  { word: 'جَنَيتَ', meaning: 'ارتكبت جناية.' },
  { word: 'جَنباً', meaning: 'جانباً، والمقصود التقلب أرقاً.' },
  { word: 'جواز فين', meaning: 'اجتياز مكان الهلاك والمخاطر.' },
  { word: 'حذار', meaning: 'خوف وتجنب.' },
  { word: 'حَسبا', meaning: 'كفاية من العذاب.' },
  { word: 'خَبَّت', meaning: 'خدعت وغشت.' },
  { word: 'خِبّاً', meaning: 'خادعاً وماكراً.' },
  { word: 'رَبّا', meaning: 'سيداً ومتحكماً.' },
  { word: 'رَغباً', meaning: 'رغبة وأملاً.' },
  { word: 'رُعبا', meaning: 'خوفاً شديداً.' },
  { word: 'رَهبَةً', meaning: 'خوفاً مع تعظيم.' },
  { word: 'ريحانة', meaning: 'نبتة طيبة الرائحة، ويقصد بها فتاة جميلة.' },
  { word: 'ساهٍ', meaning: 'غافل وغير منتبه.' },
  { word: 'شَبّا', meaning: 'أصبح شاباً واكتمل.' },
  { word: 'شَغبَ', meaning: 'خصومة وإثارة للشر.' },
  { word: 'صَبّا', meaning: 'عاشقاً شديد الشوق.' },
  { word: 'صَبابَةً', meaning: 'شوقاً وحرارة حب.' },
  { word: 'ضامن', meaning: 'كفيل أو متعهد.' },
  { word: 'ضَربا', meaning: 'مثلاً أو شبيهاً.' },
  { word: 'عَدِمتُكَ', meaning: 'فقدتك، دعاء عليه بالموت.' },
  { word: 'عَذبا', meaning: 'ماءً حلواً، والمقصود اللطف والوصال.' },
  { word: 'عَينٌ', meaning: 'جاسوس أو رقيب.' },
  { word: 'غَمرَةٍ', meaning: 'شدة وضيق.' },
  { word: 'كَرَبَتكَ', meaning: 'أوقعتك في الكرب والشدة.' },
  { word: 'كَلبا', meaning: 'قد يقصد به حارس أو شخص لئيم.' },
  { word: 'مُرَوَّعاً', meaning: 'خائفاً ومفزوعاً.' },
  { word: 'مشورة', meaning: 'نصيحة واستشارة.' },
  { word: 'مُكِبّا', meaning: 'ملازماً ومنكبّاً على الشيء.' },
  { word: 'نَحبا', meaning: 'نذراً أو عهداً.' },
  { word: 'يُؤثِرُ', meaning: 'يفضّل ويختار.' }
];

const rawPoemData = [
    { num: 1, part1: 'عَدِمتُكَ عاجِلاً يا قَلبُ قَلباً', part2: 'أَتَجعَلُ مَن هَويتَ عَلَيكَ رَبّا' },
    { num: 2, part1: 'بِأَيِّ مَشورَةٍ وَبِأَيِّ رَأيٍ', part2: 'تُمَلِّكُها وَلا تَسقيكَ عَذبا' },
    { num: 3, part1: 'تَحِنُّ صَبابَةً في كُلِّ يَومٍ', part2: 'إِلى حُبّى وَقَد كَرَبَتكَ كَربا' },
    { num: 4, part1: 'وَتَهتَجِرُ النِساءَ إِلى هَواها', part2: 'كَأَنَّكَ ضامِنٌ مِنهُنَّ نَحبا' },
    { num: 5, part1: 'أَمِن رَيحانَةٍ حَسُنَت وَطابَت', part2: 'تَبيتُ مُرَوَّعاً وَتَظَلُّ صَبّا' },
    { num: 6, part1: 'تَروعُ مِنَ الصِحابِ وَتَبتَغيها', part2: 'مَعَ الوَسواسِ مُنفَرِداً مُكِبّا' },
    { num: 7, part1: 'كَأَنَّكَ لا تَرى حَسَناً سِواها', part2: 'وَلا تَلقى لَها في الناسِ ضَربa' },
    { num: 8, part1: 'وَكَم مِن غَمرَةٍ وَجَوازِ فَينٍ', part2: 'خَلَوتَ بِهِ فَهَل تَزدادُ قُربا' },
    { num: 9, part1: 'بَكَيتَ مِنَ الهَوى وَهَواكَ طِفلٌ', part2: 'فَوَيلَكَ ثُمَّ وَيلَكَ حينَ شَبّا' },
    { num: 10, part1: 'إِذا أَصبَحتَ صَبَّحَكَ التَصابي', part2: 'وَأَطرابٌ تُصَبُّ عَلَيكَ صَبّا' },
    { num: 11, part1: 'وَتُمسي وَالمَساءُ عَلَيكَ مُرٌّ', part2: 'يُقَلِّبُكَ الهَوى جَنباً فَجَنبا' },
    { num: 12, part1: 'أَظُنُّكَ مِن حِذارِ البَينِ يَوماً', part2: 'بِداءِ الحُبِّ سَوفَ تَموتُ رُعبا' },
    { num: 13, part1: 'أَتُظهِرُ رَهبَةً وَتُسِرُّ رَغباً', part2: 'لَقَد عَذَّبتَني رَغباً وَرَهبا' },
    { num: 14, part1: 'فَما لَكَ في مَوَدَّتِها نَصيبٌ', part2: 'سِوى عِدَةٍ فَخُذ بِيَدَيكَ تُربa' },
    { num: 15, part1: 'إِذا وُدٌّ جَفا وَأَرَبَّ وُدٌّ', part2: 'فَجانِب مَن جَفاكَ لِمَن أَرَبّا' },
    { num: 16, part1: 'وَدَع شَغبَ البَخيلِ إِذا تَمادى', part2: 'فَإِنَّ لَهُ مَعَ المَعروفِ شَغبا' },
    { num: 17, part1: 'وَقالَت لا تَزالُ عَلَيَّ عَينٌ', part2: 'أُراقِبُ قَيِّماً وَأَخافُ كَلبا' },
    { num: 18, part1: 'لَقَد خَبَّت عَلَيكَ وَأَنتَ ساهٍ', part2: 'فَكُن خِبّاً إِذا لاقَيتَ خِبّا' },
    { num: 19, part1: 'وَلا تَغرُركَ مَوعِدَةٌ لِحُبّى', part2: 'فَإِنَّ عِداتِها أَنزَلنَ جَدبا' },
    { num: 20, part1: 'أَلا يا قَلبُ هَل لَكَ في التَعَZّي', part2: 'فَقَد عَذَّبتَني وَلَقيتُ حَسبا' },
    { num: 21, part1: 'وَما أَصبَحتَ تَأمُلُ مِن صَديقٍ', part2: 'يَعُدُّ عَلَيكَ طولَ الحُبِّ ذَنبا' },
    { num: 22, part1: 'كَأَنَّكَ قَد قَتَلتَ لَهُ قَتيلاً', part2: 'بِحُبِّكَ أَو جَنَيتَ عَلَيهِ حَربا' },
    { num: 23, part1: 'رَأَيتُ القَلبَ لا يَأتي بَغيضاً', part2: 'وَيُؤثِرُ بِالزِيارَةِ مَن أَحَبّا' }
];

const questionsData: Question[] = [
    { questionText: "من هو المخاطَب في البيت الأول: 'عَدِمتُكَ عاجِلاً يا قَلبُ قَلباً'؟", options: ['الحبيبة', 'القلب', 'الشاعر نفسه', 'صديق الشاعر'], correctAnswer: 'القلب' },
    { questionText: "ما المعنى الرئيسي الذي يعبر عنه الشاعر في القصيدة؟", options: ['الفخر بالنسب', 'وصف الطبيعة', 'عتاب القلب ولومه على حبه', 'المدح'], correctAnswer: 'عتاب القلب ولومه على حبه' },
    { questionText: "ما معنى كلمة 'صَبابَةً' في البيت الثالث؟", options: ['حزناً وألماً', 'شوقاً وحرارة حب', 'غضباً شديداً', 'فرحاً وسروراً'], correctAnswer: 'شوقاً وحرارة حب' },
    { questionText: "بماذا يصف الشاعر حالته في المساء في البيت الحادي عشر؟", options: ['بالراحة والهدوء', 'بالمرارة وتقلب الهوى له', 'بالسعادة والنشوة', 'بالعمل والتعب'], correctAnswer: 'بالمرارة وتقلب الهوى له' },
    { questionText: "ماذا يتوقع الشاعر أن تكون نهاية قلبه بسبب الحب؟", options: ['أن يموت رعباً', 'أن يجد السعادة', 'أن ينسى حبيبته', 'أن يصبح أقوى'], correctAnswer: 'أن يموت رعباً' },
    { questionText: "في البيت الثامن عشر، بماذا ينصح الشاعر قلبه عندما يقابل شخصاً خادعاً؟", options: ['أن يكون متسامحاً', 'أن يتجنبه', 'أن يكون خادعاً مثله', 'أن يطلب المساعدة'], correctAnswer: 'أن يكون خادعاً مثله' },
    { questionText: "ما هو الغرض من الاستفهام في البيت الثاني: 'بِأَيِّ مَشورَةٍ وَبِأَيِّ رَأيٍ'؟", options: ['طلب النصيحة', 'التعجب والإنكار', 'السخرية', 'التقرير'], correctAnswer: 'التعجب والإنكار' },
    { questionText: "ما معنى 'فَخُذ بِيَدَيكَ تُربا' في البيت الرابع عشر؟", options: ['كناية عن الفوز العظيم', 'كناية عن الخيبة والفشل', 'دعوة للعمل في الأرض', 'أمر بجمع التراب'], correctAnswer: 'كناية عن الخيبة والفشل' },
    { questionText: "إلى أي عصر ينتمي الشاعر بشار بن برد؟", options: ['العصر الجاهلي', 'صدر الإسلام', 'العصر الأموي', 'العصر العباسي'], correctAnswer: 'العصر العباسي' },
    { questionText: "بماذا اشتهر بشار بن برد على الرغم من أنه ولد أعمى؟", options: ['بشعره المجدد وقوة إحساسه', 'بفروسيته', 'بثروته', 'بصمته'], correctAnswer: 'بشعره المجدد وقوة إحساسه' }
];

function processPoem(
  rawPoem: { num: number; part1: string; part2: string; }[],
  vocab: { word: string; meaning: string; }[],
  explanations: { num: number; data: VerseExplanation }[]
): Verse[] {
  const vocabMap = new Map(vocab.map(item => [item.word, item.meaning]));
  
  // Create a regex that is more specific to avoid matching parts of words
  // It looks for the words with word boundaries (\b) in Arabic.
  const vocabWords = Array.from(vocabMap.keys());
  const regex = new RegExp(`\\b(${vocabWords.join('|')})\\b`, 'g');

  const processPart = (text: string): VersePart => {
    if (!text) return [];
    // Split by the regex, keeping the delimiters
    return text.split(regex).filter(part => part).map(part => {
      const trimmedPart = part.trim();
      if (vocabMap.has(trimmedPart)) {
        return { word: trimmedPart, meaning: vocabMap.get(trimmedPart)! };
      }
      return { word: part }; // Keep original spacing
    });
  };

  return rawPoem.map(verse => {
    const explanation = explanations.find(e => e.num === verse.num);
    return {
      num: verse.num,
      part1: processPart(verse.part1),
      part2: processPart(verse.part2),
      explanation: explanation?.data
    };
  });
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule]
})
export class AppComponent {

  // --- Data Signals ---
  vocabulary = signal(vocabularyData);
  poem = signal<Verse[]>(processPoem(rawPoemData, vocabularyData, verseExplanationsData));
  questions = signal<Question[]>(questionsData);

  // --- Card Magnifier State ---
  magnifiedCard = signal<string | null>(null);
  isCardMagnifierClosing = signal(false);

  // --- Verse Magnifier State ---
  magnifiedVerseIndex = signal<number | null>(null);
  isVerseChanging = signal(false); // For transition throttling
  isMagnifierClosing = signal(false);
  isExplanationVisible = signal(false);

  magnifiedVerse = computed(() => {
    const index = this.magnifiedVerseIndex();
    if (index === null) return null;
    return this.poem()[index];
  });

  // --- Quiz State ---
  currentQuestionIndex = signal(0);
  selectedAnswer = signal<string | null>(null);
  answerStatus = signal<'correct' | 'incorrect' | 'unanswered'>('unanswered');
  isQuizComplete = signal(false);
  isQuizPermanentlyCompleted = signal(false);

  currentQuestion = computed(() => {
    return this.questions()[this.currentQuestionIndex()];
  });
  
  // --- Wheel of Fortune State ---
  isWheelVisible = signal(false);
  isSpinning = signal(false);
  wheelRotation = signal(0);
  initialWheelNumbers = Array.from({ length: 34 }, (_, i) => i + 1);
  availableWheelNumbers = signal<number[]>(this.initialWheelNumbers);
  selectedNumberFromWheel = signal<number | null>(null);

  // --- Card Magnifier Methods ---
  openCardMagnifier(id: string): void {
    if (id === 'quiz') {
      this.resetQuiz();
    }
    this.magnifiedCard.set(id);
    document.body.style.overflow = 'hidden';
  }

  closeCardMagnifier(): void {
    this.isCardMagnifierClosing.set(true);
    setTimeout(() => {
      this.magnifiedCard.set(null);
      document.body.style.overflow = '';
      this.isCardMagnifierClosing.set(false);
      this.isWheelVisible.set(false); // Also hide wheel when closing quiz card
    }, 400); // Match animation duration
  }
  
  // --- Verse Magnifier Methods ---
  openMagnifier(index: number): void {
    this.magnifiedVerseIndex.set(index);
    this.isExplanationVisible.set(false); // Hide explanation on new verse
  }

  closeMagnifier(): void {
    this.isMagnifierClosing.set(true);
    setTimeout(() => {
      this.magnifiedVerseIndex.set(null);
      this.isMagnifierClosing.set(false); // Reset for next open
    }, 400); // Must match animation duration
  }

  nextVerse(): void {
    if (this.isVerseChanging()) return; // Throttle
    const currentIndex = this.magnifiedVerseIndex();
    if (currentIndex === null || currentIndex >= this.poem().length - 1) return;
    
    this.isVerseChanging.set(true);
    this.isExplanationVisible.set(false);
    this.magnifiedVerseIndex.update(i => i! + 1);
    setTimeout(() => this.isVerseChanging.set(false), 300); // Match transition duration
  }

  previousVerse(): void {
    if (this.isVerseChanging()) return; // Throttle
    const currentIndex = this.magnifiedVerseIndex();
    if (currentIndex === null || currentIndex <= 0) return;
    
    this.isVerseChanging.set(true);
    this.isExplanationVisible.set(false);
    this.magnifiedVerseIndex.update(i => i! - 1);
    setTimeout(() => this.isVerseChanging.set(false), 300); // Match transition duration
  }

  onMagnifierScroll(event: WheelEvent): void {
    event.preventDefault();
    if (this.isVerseChanging() || this.isExplanationVisible()) return;

    if (event.deltaY > 0) {
      this.nextVerse();
    } else if (event.deltaY < 0) {
      this.previousVerse();
    }
  }

  toggleExplanation(): void {
    this.isExplanationVisible.update(v => !v);
  }

  // --- Quiz Methods ---
  selectAnswer(option: string): void {
    if (this.answerStatus() !== 'unanswered') {
      return; // Prevent changing answer while feedback is showing
    }

    this.selectedAnswer.set(option);
    const isCorrect = option === this.currentQuestion().correctAnswer;

    if (isCorrect) {
      this.answerStatus.set('correct');
      setTimeout(() => {
        if (this.currentQuestionIndex() < this.questions().length - 1) {
          this.currentQuestionIndex.update(i => i + 1);
          this.resetAnswerState();
        } else {
          this.isQuizComplete.set(true);
          this.isQuizPermanentlyCompleted.set(true);
          // Auto-close after 3 seconds
          setTimeout(() => {
             this.closeCardMagnifier();
          }, 3000);
        }
      }, 1200); // Wait 1.2s before moving to next question
    } else {
      this.answerStatus.set('incorrect');
      setTimeout(() => {
        // Reset state to allow another attempt
        this.answerStatus.set('unanswered');
        this.selectedAnswer.set(null);
      }, 1500); // Wait for animation to finish
    }
  }

  resetAnswerState(): void {
    this.selectedAnswer.set(null);
    this.answerStatus.set('unanswered');
  }

  resetQuiz(): void {
    this.currentQuestionIndex.set(0);
    this.resetAnswerState();
    this.isQuizComplete.set(false);
    this.resetWheel();
  }

  // --- Wheel of Fortune Methods ---
  resetWheel(): void {
    this.availableWheelNumbers.set(this.initialWheelNumbers);
    this.selectedNumberFromWheel.set(null);
    this.isSpinning.set(false);
    this.wheelRotation.set(0);
  }

  toggleWheel(show: boolean): void {
    this.isWheelVisible.set(show);
  }

  spinWheel(): void {
    if (this.isSpinning() || this.availableWheelNumbers().length === 0) {
      return;
    }
    this.isSpinning.set(true);
    this.selectedNumberFromWheel.set(null);

    const available = this.availableWheelNumbers();
    const randomIndex = Math.floor(Math.random() * available.length);
    const chosenNumber = available[randomIndex];

    const totalSegments = 34;
    const segmentAngle = 360 / totalSegments;

    const baseRotation = 360 * (Math.floor(Math.random() * 6) + 5);
    const targetSegmentRotation = -((chosenNumber - 1) * segmentAngle + segmentAngle / 2);
    const finalRotation = baseRotation + targetSegmentRotation;

    this.wheelRotation.set(finalRotation);

    setTimeout(() => {
      this.selectedNumberFromWheel.set(chosenNumber);
      this.availableWheelNumbers.update(numbers => numbers.filter(n => n !== chosenNumber));
      this.isSpinning.set(false);
    }, 6000); // Match CSS transition duration
  }

  closeWheelPopup(): void {
    this.selectedNumberFromWheel.set(null);
    this.isWheelVisible.set(false);
  }
  
  getArabicOrdinal(num: number): string {
    const ones: { [key: number]: string } = {
        1: 'الأول', 2: 'الثاني', 3: 'الثالث', 4: 'الرابع', 5: 'الخامس',
        6: 'السادس', 7: 'السابع', 8: 'الثامن', 9: 'التاسع', 10: 'العاشر'
    };

    const onesCompound: { [key: number]: string } = {
        1: 'الحادي', 2: 'الثاني', 3: 'الثالث', 4: 'الرابع', 5: 'الخامس',
        6: 'السادس', 7: 'السابع', 8: 'الثامن', 9: 'التاسع'
    };
    
    let ordinal = '';

    if (num >= 1 && num <= 10) {
        ordinal = ones[num];
    } else if (num >= 11 && num <= 19) {
        ordinal = `${onesCompound[num % 10]} عشر`;
    } else if (num === 20) {
        ordinal = 'العشرون';
    } else if (num > 20 && num < 30) {
        ordinal = `${onesCompound[num % 10]} والعشرون`;
    } else {
        return `البيت رقم ${num}`;
    }
    
    return `البيت ${ordinal}`;
  }
}
