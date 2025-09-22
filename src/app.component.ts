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
  template: `
    <div class="min-h-screen text-zinc-300 antialiased">
  
  @if (magnifiedCard() !== 'quiz') {
    <!-- Main Content -->
    <main class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      
      <!-- Hero Section -->
      <section class="text-center mb-24">
        <h1 class="text-6xl sm:text-7xl md:text-8xl font-bold text-amber-300 font-heading tracking-wide" style="text-shadow: 0 0 12px rgba(252, 211, 77, 0.5), 0 0 30px rgba(251, 191, 36, 0.3);">
          ع<span class="text-amber-400">َ</span>د<span class="text-amber-400">ِ</span>م<span class="text-amber-400">ْ</span>ت<span class="text-amber-400">ُ</span>كَ ي<span class="text-amber-400">َ</span>ا ق<span class="text-amber-400">َ</span>ل<span class="text-amber-400">ْ</span>ب<span class="text-amber-400">ُ</span>
        </h1>
        <p class="mt-4 text-xl sm:text-2xl text-zinc-400">
          للشاعر <span class="font-bold text-amber-300">ب<span class="text-amber-500">َ</span>ش<span class="text-amber-500">َّ</span>ار<span class="text-amber-500">ُ</span> ب<span class="text-amber-500">ْ</span>ن<span class="text-amber-500">ُ</span> ب<span class="text-amber-500">ُ</span>ر<span class="text-amber-500">ْ</span>د<span class="text-amber-500">ٍ</span></span>
        </p>
      </section>

      <!-- Navigation Cards -->
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-right">
    
        <!-- Introduction Card -->
        <div (click)="openCardMagnifier('intro')" class="glowing-card card-bg rounded-2xl p-10 hover:scale-105 transition-all duration-300 cursor-pointer text-right">
          <h2 class="text-4xl font-bold text-amber-500 mb-3 font-heading">تمهيد</h2>
          <p class="text-zinc-400 leading-relaxed text-xl">نظرة على عالم بشار بن برد وشاعريته الفذة.</p>
        </div>
      
        <!-- Bio Card -->
        <div (click)="openCardMagnifier('bio')" class="glowing-card card-bg rounded-2xl p-10 hover:scale-105 transition-all duration-300 cursor-pointer text-right">
          <h2 class="text-4xl font-bold text-amber-500 mb-3 font-heading">التعريف بالشاعر</h2>
          <p class="text-zinc-400 leading-relaxed text-xl">لمحات من حياة بشار بن برد، ونشأته، وشعره.</p>
        </div>

        <!-- Poem Card -->
        <div (click)="openCardMagnifier('poem')" class="glowing-card card-bg rounded-2xl p-10 hover:scale-105 transition-all duration-300 cursor-pointer text-right">
          <h2 class="text-4xl font-bold text-amber-500 mb-3 font-heading">القصيدة</h2>
          <p class="text-zinc-400 leading-relaxed text-xl">تصفح أبيات القصيدة وتفاعل معها بالضغط على البيت.</p>
        </div>

        <!-- Vocabulary Card -->
        <div (click)="openCardMagnifier('vocab')" class="glowing-card card-bg rounded-2xl p-10 hover:scale-105 transition-all duration-300 cursor-pointer text-right">
          <h2 class="text-4xl font-bold text-amber-500 mb-3 font-heading">معاني المفردات</h2>
          <p class="text-zinc-400 leading-relaxed text-xl">شرح لأبرز الكلمات والمصطلحات الصعبة في القصيدة.</p>
        </div>
      
        <!-- Questions Card -->
        <div (click)="openCardMagnifier('quiz')" 
            class="glowing-card card-bg rounded-2xl p-10 hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
            [class.quiz-completed-card]="isQuizPermanentlyCompleted()">
          @if(isQuizPermanentlyCompleted()) {
            <div class="flex flex-col items-center justify-center text-center h-full animate-fade-in">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-green-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 class="text-5xl font-bold text-green-300 font-heading">تم</h2>
                <p class="text-green-400 mt-2">أعد الاختبار</p>
            </div>
          } @else {
            <div class="text-right">
              <h2 class="text-4xl font-bold text-amber-500 mb-3 font-heading">الأسئلة</h2>
              <p class="text-zinc-400 leading-relaxed text-xl">اختبر فهمك للقصيدة عبر مجموعة من الأسئلة التفاعلية.</p>
            </div>
          }
        </div>

        <!-- Summary Card -->
        <div (click)="openCardMagnifier('summary')" class="glowing-card card-bg rounded-2xl p-10 hover:scale-105 transition-all duration-300 cursor-pointer text-right">
          <h2 class="text-4xl font-bold text-amber-500 mb-3 font-heading">الخلاصة</h2>
          <p class="text-zinc-400 leading-relaxed text-xl">ملخص شامل للشاعر والقصيدة وأبرز جمالياتها اللغوية.</p>
        </div>
      
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-zinc-800 text-zinc-500 mt-24">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h3 class="font-heading text-lg text-amber-300 mb-2">إعداد وتصميم</h3>
        <p class="text-zinc-400 text-base">عبدالله عامر الشبلي و عمار نادر النعيمي</p>
        <p class="mt-4 text-xs text-zinc-600">&copy; 2025. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  }
</div>

<!-- Quiz Fullscreen Container -->
@if (magnifiedCard() === 'quiz') {
  <div 
    class="fixed inset-0 z-40 overflow-y-auto"
    [class.animate-fade-in]="!isCardMagnifierClosing()"
    [class.animate-fade-out]="isCardMagnifierClosing()">
    
    <!-- Close Button -->
    <button (click)="closeCardMagnifier()" class="fixed top-6 right-6 text-amber-800 hover:text-amber-900 transition-colors z-[60] bg-black/10 rounded-full p-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <div class="w-full min-h-screen" 
         [class.animate-slide-in-up]="!isCardMagnifierClosing()"
         [class.animate-slide-out-down]="isCardMagnifierClosing()">
        <div class="w-full min-h-screen flex flex-col" style="background-color: #f3e9d2; background-image: url('https://www.toptal.com/designers/subtlepatterns/uploads/old_paper.png');">
            @if (!isWheelVisible()) {
                <section class="text-zinc-800 animate-fade-in flex-grow w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
                    @if(isQuizComplete()) {
                        <div class="fixed inset-0 flex items-center justify-center bg-zinc-950/90 backdrop-blur-md z-50 text-center p-4 animate-fade-in">
                            <div class="card-bg border border-amber-500/50 rounded-2xl p-8 sm:p-12 shadow-2xl shadow-black/50 animate-slide-in-up">
                            <h2 class="text-4xl md:text-5xl font-bold text-amber-400 font-heading">أحسنت في حل الأسئلة</h2>
                            </div>
                        </div>
                    } @else {
                        @let question = currentQuestion();
                        @let prefixes = ['أ', 'ب', 'ج', 'د'];
                        <div class="max-w-4xl mx-auto text-center w-full">
                            <!-- Quiz Header -->
                            <div class="flex justify-between items-center mb-6">
                                <p class="text-xl text-amber-800 font-semibold">
                                    السؤال {{ currentQuestionIndex() + 1 }} من {{ questions().length }}
                                </p>
                            </div>

                            <!-- Progress Bar -->
                            <div class="mb-8">
                                <div class="w-full bg-zinc-400 rounded-full h-2.5">
                                    <div class="bg-amber-700 h-2.5 rounded-full transition-all duration-500" [style.width.%]="(currentQuestionIndex() + 1) / questions().length * 100"></div>
                                </div>
                            </div>

                            <!-- Question -->
                            <div class="border-2 border-amber-800/30 rounded-2xl p-8 sm:p-12 shadow-inner bg-white/20">
                                <h2 class="font-heading text-4xl md:text-5xl font-bold text-zinc-900 leading-relaxed mb-10">{{ question.questionText }}</h2>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-2xl">
                                    @for(option of question.options; track option; let i = $index) {
                                        <button 
                                            (click)="selectAnswer(option)"
                                            class="quiz-option-heritage"
                                            [disabled]="answerStatus() !== 'unanswered'"
                                            [class.animate-correct-pop-heritage]="answerStatus() === 'correct' && selectedAnswer() === option"
                                            [class.animate-incorrect-shake-heritage]="answerStatus() === 'incorrect' && selectedAnswer() === option"
                                        >
                                            <span class="quiz-option-text">{{ option }}</span>
                                            <span class="quiz-option-prefix">{{ prefixes[i] }}</span>
                                        </button>
                                    }
                                </div>
                            </div>
                            <div class="text-center mt-12">
                                <button (click)="toggleWheel(true)" class="wheel-of-fortune-button">
                                    <span class="font-heading text-2xl">عجلة الحظ</span>
                                </button>
                            </div>
                        </div>
                    }
                </section>
            } @else {
                 <section class="text-zinc-800 animate-fade-in relative flex-grow flex flex-col w-full p-4 sm:p-6 md:p-8">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-4xl md:text-5xl font-bold text-amber-900/80 font-heading">عجلة الحظ</h2>
                        <button (click)="toggleWheel(false)" class="text-amber-800 font-semibold py-2 px-5 rounded-lg border border-amber-800/40 bg-amber-800/10 hover:bg-amber-800/20 transition-all duration-300 flex items-center gap-2">
                            <span>العودة للأسئلة</span>
                        </button>
                    </div>
                    <div class="flex-grow flex items-center justify-center">
                        <div class="wheel-container">
                            <div class="wheel-pointer"></div>
                            <div class="wheel" [style.transform]="'rotate(' + wheelRotation() + 'deg)'">
                                <div class="wheel-center">
                                    <button (click)="spinWheel()" [disabled]="isSpinning() || availableWheelNumbers().length === 0" 
                                    class="wheel-spin-button"
                                    [class.spinning]="isSpinning()">
                                        @if (availableWheelNumbers().length === 0) {
                                            <span>انتهى</span>
                                        } @else {
                                            <span>أدر العجلة</span>
                                        }
                                    </button>
                                </div>
                                @for (num of initialWheelNumbers; track num; let i = $index) {
                                    @let angle = i * 360 / 34;
                                    <div class="wheel-number-marker" 
                                        [class.used]="!availableWheelNumbers().includes(num)"
                                        [style.transform]="'rotate(' + angle + 'deg) translate(0, -220px)'">
                                        <span class="wheel-number-text" [style.transform]="'rotate(-' + angle + 'deg)'">{{ num }}</span>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>

                    @if (selectedNumberFromWheel(); as num) {
                        <div class="wheel-popup-overlay animate-fade-in" (click)="closeWheelPopup()">
                            <div class="wheel-popup-content animate-slide-in-up" (click)="$event.stopPropagation()">
                                <button (click)="closeWheelPopup()" class="wheel-popup-close">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                                <div class="font-heading text-4xl leading-loose text-zinc-800 mb-2">
                                    الرقم المختار هو:
                                </div>
                                <div class="wheel-popup-number">{{ num }}</div>
                            </div>
                        </div>
                    }
                </section>
            }
        </div>
    </div>
  </div>
}


<!-- Card Magnifier Overlay -->
@if (magnifiedCard() !== null && magnifiedCard() !== 'quiz') {
  <div 
    class="fixed inset-0 bg-zinc-900 z-40 overflow-y-auto p-4 sm:p-6 md:p-8"
    [class.animate-fade-in]="!isCardMagnifierClosing()"
    [class.animate-fade-out]="isCardMagnifierClosing()">
    
    <!-- Close Button -->
    <button (click)="closeCardMagnifier()" class="fixed top-6 right-6 text-zinc-400 hover:text-white transition-colors z-[60] bg-black/30 rounded-full p-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <div class="container mx-auto max-w-5xl py-16" 
         [class.animate-slide-in-up]="!isCardMagnifierClosing()"
         [class.animate-slide-out-down]="isCardMagnifierClosing()">
      @switch (magnifiedCard()) {
        @case ('intro') {
          <section class="card-bg border border-zinc-800 rounded-2xl p-8 sm:p-12 shadow-2xl shadow-black/20">
            <h2 class="text-5xl font-bold text-amber-500 mb-6 font-heading border-b-2 border-amber-500/30 pb-4">تمهيد</h2>
            <blockquote class="text-4xl text-zinc-300 italic leading-loose border-r-4 border-amber-500 pr-6 mt-8">
              "بشار بن برد، شاعرية خصبة تذهب بالشعر كل مذهب في التعبير عن خوالج النفس، والتجاوب مع روح العصر. في حس مرهف، وقدرة على الملاءمة بين اللفظ والمعنى، وبين الصورة والموضوع."
              <footer class="mt-4 text-lg text-zinc-500 not-italic">- طه الحاجري</footer>
            </blockquote>
          </section>
        }
        @case ('bio') {
          <section class="card-bg border border-zinc-800 rounded-2xl p-8 sm:p-12 shadow-2xl shadow-black/20">
            <div class="md:flex md:items-start md:gap-8">
              <div class="md:w-2/3">
                <h2 class="text-5xl font-bold text-amber-500 mb-2 font-heading">التعريف بالشاعر</h2>
                <p class="text-zinc-500 text-lg mb-6">(٩٥-١٧٧ هـ / ٧١٤-٧٨٤ م)</p>
                <p class="text-3xl text-zinc-300 leading-relaxed">
                  هو شاعر مجيد طريف، ولد أعمى، ولكنه كان وسيماً، حسن الصوت، جيد الخطاب. وصفه ابن المعتز: "ختم الملوك، وحضر مجالس الخلفاء، ونال عطاياهم". مدح المهدي، وحضر مجلسه، واندمه وأجزل له. قُتل سنة ١٦٧ هـ أو ١٦٨ هـ.
                </p>
              </div>
              <div class="mt-8 md:mt-0 md:w-1/3 flex items-center justify-center">
                <div class="w-full aspect-square border-2 border-amber-500/20 rounded-lg flex items-center justify-center p-4 bg-zinc-900/50 shadow-inner shadow-black/50">
                  <span class="font-heading text-7xl font-bold text-center tracking-wider text-engraved">
                    بشار<br>بن<br>برد
                  </span>
                </div>
              </div>
            </div>
          </section>
        }
        @case ('summary') {
          <section class="card-bg border border-zinc-800 rounded-2xl p-8 sm:p-12 shadow-2xl shadow-black/20 space-y-12">
            <h2 class="text-5xl font-bold text-amber-500 font-heading border-b-2 border-amber-500/30 pb-4">الخلاصة والتحليل</h2>
            
            <div>
                <h3 class="text-4xl font-bold text-amber-400 mb-4 font-heading">الفكرة العامة للنص</h3>
                <p class="text-3xl text-zinc-300 leading-relaxed border-r-4 border-amber-500/50 pr-4">
                    تدور القصيدة حول صراع نفسي عنيف يعيشه الشاعر، حيث يوجه عتاباً لاذعاً إلى قلبه الذي استسلم لحب من طرف واحد، مما جلب له الألم والمعاناة. هي قصيدة تمثل حواراً داخلياً بين العقل الذي يرى عبثية هذا الحب، والعاطفة الجياشة التي ترفض الاستسلام.
                </p>
            </div>

            <div>
                <h3 class="text-4xl font-bold text-amber-400 mb-4 font-heading">الأفكار الجزئية للأبيات</h3>
                <ul class="list-none space-y-4 text-2xl text-zinc-300">
                    <li class="border-r-2 border-amber-500/50 pr-3"><strong class="text-amber-300">الأبيات (١ - ٧):</strong> عتاب مباشر للقلب وتوبيخه على استسلامه لمحبوبة قاسية.</li>
                    <li class="border-r-2 border-amber-500/50 pr-3"><strong class="text-amber-300">الأبيات (٨ - ١٤):</strong> وصف معاناة الشاعر وجزعه، وتأكيد خيبة الأمل من وعود المحبوبة الكاذبة.</li>
                    <li class="border-r-2 border-amber-500/50 pr-3"><strong class="text-amber-300">الأبيات (١٥ - ١٩):</strong> انتقال إلى الحكمة والنصح بترك من لا يبادل الود، والتحذير من الخداع والغدر.</li>
                    <li class="border-r-2 border-amber-500/50 pr-3"><strong class="text-amber-300">الأبيات (٢٠ - ٢٣):</strong> دعوة أخيرة للقلب إلى الصبر والسلوان، والختام بحكمة عن طبيعة القلب وميله لمن يحب.</li>
                </ul>
            </div>

            <div>
                <h3 class="text-4xl font-bold text-amber-400 mb-4 font-heading">مفردات رئيسية</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 text-2xl">
                    <p><span class="font-bold text-amber-300">عَدِمتُكَ:</span> دعاء بالفقد والموت.</p>
                    <p><span class="font-bold text-amber-300">صَبابَةً:</span> شوق وحرارة حب.</p>
                    <p><span class="font-bold text-amber-300">مُرَوَّعاً:</span> خائفاً ومفزوعاً.</p>
                    <p><span class="font-bold text-amber-300">البَينِ:</span> الفراق.</p>
                    <p><span class="font-bold text-amber-300">التَعَزّي:</span> التصبر والسلوان.</p>
                    <p><span class="font-bold text-amber-300">خِبّاً:</span> خادعاً وماكراً.</p>
                    <p><span class="font-bold text-amber-300">جَدبا:</span> قحطاً، وعدم وفاء.</p>
                    <p><span class="font-bold text-amber-300">نَحبا:</span> نذراً أو عهداً.</p>
                    <p><span class="font-bold text-amber-300">جَفا:</span> ابتعد وأعرض.</p>
                    <p><span class="font-bold text-amber-300">شَغبَ:</span> خصومة وإثارة للشر.</p>
                </div>
            </div>

            <div>
                <h3 class="text-4xl font-bold text-amber-400 mb-4 font-heading">جماليات بلاغية</h3>
                <ul class="list-none space-y-6 text-2xl text-zinc-300">
                    <li><strong class="text-amber-300 block mb-1">التشخيص والنداء:</strong> في "يا قلب" (البيت 1)، حيث يخاطب قلبه كإنسان عاقل ويشكو إليه، مما يجسد الصراع الداخلي.</li>
                    <li><strong class="text-amber-300 block mb-1">الاستفهام الاستنكاري:</strong> يتكرر في القصيدة مثل "أَتَجعَلُ مَن هَويتَ..." (البيت 1)، والغرض منه ليس طلب الإجابة بل إظهار التعجب والإنكار من فعل القلب.</li>
                    <li><strong class="text-amber-300 block mb-1">الاستعارة:</strong> مثل تشبيه الهوى بالطفل الذي يكبر ويشب (البيت 9)، وتشبيه نتائج وعود المحبوبة بالأرض القاحلة "أَنزَلنَ جَدبا" (البيت 19).</li>
                     <li><strong class="text-amber-300 block mb-1">التشبيه:</strong> في "كَأَنَّكَ ضامِنٌ مِنهُنَّ نَحبا" (البيت 4) لتصوير شدة الإخلاص، وفي "كَأَنَّكَ قَد قَتَلتَ لَهُ قَتيلاً" (البيت 22) لبيان مدى قسوة المحبوبة.</li>
                    <li><strong class="text-amber-300 block mb-1">الطباق:</strong> كالجمع بين "رَهبَةً" و "رَغباً" (البيت 13) لإبراز التناقض النفسي، وبين "جَفا" و "أَرَبَّ" (البيت 15) للمقارنة بين أنواع الود.</li>
                    <li><strong class="text-amber-300 block mb-1">الجناس:</strong> يظهر في "كَرَبَتكَ كَربا" (البيت 3) وهو جناس اشتقاق لتأكيد المعنى، وفي "فَكُن خِبّاً إِذا لاقَيتَ خِبّا" (البيت 18) وهو جناس تام يعطي جرساً موسيقياً.</li>
                    <li><strong class="text-amber-300 block mb-1">الكناية:</strong> في "فَخُذ بِيَدَيكَ تُربا" (البيت 14)، وهي كناية عن صفة الخيبة والفشل المطلق.</li>
                    <li><strong class="text-amber-300 block mb-1">المبالغة:</strong> في "سَوفَ تَموتُ رُعبا" (البيت 12)، لتصوير شدة الخوف وأثره المدمر على النفس.</li>
                </ul>
            </div>
          </section>
        }
         @case ('vocab') {
          <section class="card-bg border border-zinc-800 rounded-2xl p-8 sm:p-12 shadow-2xl shadow-black/20">
            <h2 class="text-5xl font-bold text-amber-500 mb-8 font-heading border-b-2 border-amber-500/30 pb-4">معاني المفردات</h2>
            <div class="space-y-8 mt-8">
              @for(item of vocabulary(); track item.word) {
                <div class="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-2 items-baseline border-b border-zinc-800 pb-4">
                    <p class="md:col-span-1 text-4xl font-bold text-amber-400 font-heading">{{ item.word }}</p>
                    <p class="md:col-span-2 text-3xl text-zinc-300">{{ item.meaning }}</p>
                </div>
              }
            </div>
          </section>
        }
        @case ('poem') {
          <section class="card-bg border border-zinc-800 rounded-2xl p-8 sm:p-12 shadow-2xl shadow-black/20">
            <h2 class="text-5xl font-bold text-amber-500 mb-8 font-heading border-b-2 border-amber-500/30 pb-4">القصيدة</h2>
            <div class="space-y-6 text-zinc-200">
              @for (verse of poem(); track verse.num; let i = $index) {
                <div 
                  class="flex items-start gap-x-4 border-b border-dashed border-zinc-700 p-4 cursor-pointer hover:bg-zinc-800/50 transition-colors duration-300 rounded-lg -mx-4"
                  (click)="openMagnifier(i)">
                  <div class="text-amber-500 font-sans font-bold text-xl pt-2 flex-shrink-0">{{ verse.num }}</div>
                  <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-x-12 font-heading text-3xl leading-loose">
                      <p>
                        @for(word of verse.part1; track $index) {
                          @if (word.meaning) {
                            <span class="glow-red cursor-pointer relative group">{{ word.word }}<span class="absolute bottom-full right-1/2 translate-x-1/2 mb-2 w-max max-w-xs p-3 text-lg bg-zinc-950 border border-zinc-700 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none text-right leading-relaxed font-sans font-normal">
                                {{ word.meaning }}
                              </span>
                            </span>
                          } @else {
                            <span>{{ word.word }}</span>
                          }
                        }
                      </p>
                      <p>
                        @for(word of verse.part2; track $index) {
                          @if (word.meaning) {
                            <span class="glow-red cursor-pointer relative group">{{ word.word }}<span class="absolute bottom-full right-1/2 translate-x-1/2 mb-2 w-max max-w-xs p-3 text-lg bg-zinc-950 border border-zinc-700 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none text-right leading-relaxed font-sans font-normal">
                                {{ word.meaning }}
                              </span>
                            </span>
                          } @else {
                            <span>{{ word.word }}</span>
                          }
                        }
                      </p>
                  </div>
                </div>
              }
            </div>
          </section>
        }
      }
    </div>
  </div>
}

<!-- Verse Magnifier Overlay -->
@if (magnifiedVerseIndex() !== null) {
  @let verse = magnifiedVerse();
  <div 
    class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    [class.animate-fade-in]="!isMagnifierClosing()"
    [class.animate-fade-out]="isMagnifierClosing()"
    (wheel)="onMagnifierScroll($event)">
    
    <!-- Close Button -->
    <button (click)="closeMagnifier()" class="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors z-50">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
    
    <!-- Navigation -->
    @if(!isExplanationVisible()) {
      <button (click)="previousVerse()" [disabled]="magnifiedVerseIndex() === 0" class="absolute left-4 md:left-8 text-zinc-400 hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed z-50">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button (click)="nextVerse()" [disabled]="magnifiedVerseIndex() === poem().length - 1" class="absolute right-4 md:right-8 text-zinc-400 hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed z-50">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
      </button>
    }

    <!-- Verse Content -->
    @if (verse) {
      <div class="text-center w-full max-w-7xl my-auto"
           [class.animate-slide-in-up]="!isMagnifierClosing()"
           [class.animate-slide-out-down]="isMagnifierClosing()">
        <h4 class="font-heading text-2xl md:text-3xl text-amber-400 mb-6 tracking-wider">
          {{ getArabicOrdinal(verse.num) }}
        </h4>
        <div class="text-3xl md:text-5xl lg:text-6xl text-white font-bold leading-relaxed md:leading-loose lg:leading-loose">
          <div class="flex flex-col justify-center items-center gap-y-4">
            <p>
              @for(word of verse.part1; track $index) {
                @if (word.meaning) {
                  <span class="glow-red cursor-pointer relative group">{{ word.word }}<span class="absolute bottom-full right-1/2 translate-x-1/2 mb-2 w-max max-w-xs p-3 text-base bg-zinc-900 border border-zinc-700 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none text-right leading-relaxed font-sans font-normal">
                      {{ word.meaning }}
                    </span>
                  </span>
                } @else {
                  <span>{{ word.word }}</span>
                }
              }
            </p>
            <p>
              @for(word of verse.part2; track $index) {
                @if (word.meaning) {
                  <span class="glow-red cursor-pointer relative group">{{ word.word }}<span class="absolute bottom-full right-1/2 translate-x-1/2 mb-2 w-max max-w-xs p-3 text-base bg-zinc-900 border border-zinc-700 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none text-right leading-relaxed font-sans font-normal">
                      {{ word.meaning }}
                    </span>
                  </span>
                } @else {
                  <span>{{ word.word }}</span>
                }
              }
            </p>
          </div>
        </div>

        <!-- Explanation Section -->
        @if (verse.explanation) {
            <div class="mt-12 text-center">
                <button (click)="toggleExplanation()" class="text-amber-300 font-semibold py-2 px-5 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 transition-all duration-300 flex items-center gap-2 mx-auto">
                    <span>الشرح والتحليل</span>
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform" [class.rotate-180]="isExplanationVisible()" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                </button>

                <!-- Explanation Modal -->
                @if (isExplanationVisible()) {
                    <div class="fixed inset-0 bg-zinc-950/70 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in" (click)="toggleExplanation()">
                        <div class="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-900 p-6 sm:p-8 rounded-2xl border border-zinc-700 animate-slide-in-up text-right" (click)="$event.stopPropagation()">
                             <!-- Close Button -->
                            <button (click)="toggleExplanation()" class="absolute top-4 left-4 text-zinc-500 hover:text-white transition-colors z-10 bg-zinc-800 rounded-full p-1">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <h3 class="text-3xl font-bold text-amber-400 mb-4 font-heading">الشرح</h3>
                            <p class="text-2xl text-zinc-300 leading-relaxed">{{ verse.explanation.explanation }}</p>

                            <h3 class="text-3xl font-bold text-amber-400 mt-8 mb-4 font-heading">المفردات</h3>
                            <ul class="list-none space-y-2 text-2xl">
                                @for(item of verse.explanation.vocabulary; track item.term) {
                                    <li>
                                        <span class="font-bold text-amber-300">{{ item.term }}:</span>
                                        <span class="text-zinc-300"> {{ item.meaning }}</span>
                                    </li>
                                }
                            </ul>

                            <h3 class="text-3xl font-bold text-amber-400 mt-8 mb-4 font-heading">جماليات بلاغية</h3>
                            <ul class="list-none space-y-4 text-2xl">
                                @for(item of verse.explanation.rhetoric; track item.type) {
                                    <li>
                                        <span class="font-semibold text-amber-300 bg-amber-500/10 px-2 py-1 rounded">{{ item.type }}:</span>
                                        <span class="text-zinc-200 block mt-2 pr-4 border-r-2 border-amber-500/50">"{{ item.example }}" &mdash; {{ item.explanation }}</span>
                                    </li>
                                }
                            </ul>
                        </div>
                    </div>
                }
            </div>
        }
      </div>
    }
  </div>
}
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-image: url('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAsJCQcJCQcJCQkJCwkJCQkJCQsJCwsMCwsMDhAODhAOFhQYExMVFhYeGxMYHiAbHiAgIyAiJSwsKSwsPIBALCwsP/2wBDAQcICAsJCxULCxUsHRkdLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCz/wAARCAA4AIADASIAAhEBAxEB/8QAGwABAAMBAQEBAAAAAAAAAAAAAAEGBwQFAwL/xAAwEAABAgQDBgUFAQAAAAAAAAABAgMABBEhBTEGEhNBUWFxIjKBkUKhscHR4fEUNPH/xAAZAQADAQEBAAAAAAAAAAAAAAAAAQMCBAX/xAAeEQEBAAICAgMAAAAAAAAAAAAAAQIRAxIhMRNBFP/aAAwDAQACEQMRAD8A8YgCEsTsyxNvrZl3G3HEKCSltJUQCdCTsImb+G4s6hDrqG1FFylSgAT3J7wEaAJAJAJAJAEgEgEgEgEgEgCEsTsyxNvrZl3G3HEKCSltJUQCdCTsIeQEgEgEgEgEgEgEgEgEgCQLUzMzEypbsy6txxZupa1G5Jie/hOMsvIadYQhSzZJUoAE9wT3ENoDCEsTsyxNvrZl3G3HEKCSltJUQCdCTsIeQCAQCAQCAQCAQCAQCAQLUzMzEypbsy6txxZupa1G5JgEAgEAgEAgEAgEAgEAgEI2fnplh5Dbzy1toFkoUokJHYDtAjkAgEAgEAgEAgEAgEAgECVNTsyw8h1h5bbjawpK0KIKVDoQRsYgQCAQCAQCAQCAQCAQCAQCAQCAQCAQCBLU/My0wpDsuttxxtW8laFEhJ6kHoYgQCAQCAQCAQCAQCAQCAQCAQCAQCAQCAQCAQCBLU/My0wpDsuttxxtW8laFEhJ6kHoYjgEAgEAgEAgEAgEAgEAgEAgEAgEAgEAgEAgEAgEAgEAgEAgEAgEAgEAgEAgEAgEAgEAgEAgEAgEAgP/Z');
      background-size: cover;
      background-position: center center;
      background-attachment: fixed;
    }

    /* Sophisticated Easing for Animations */
    .animate-fade-in {
      animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    .animate-fade-out {
      animation: fadeOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    .animate-slide-in-up {
      animation: slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    .animate-slide-out-down {
      animation: slideOutDown 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    @keyframes slideInUp {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes slideOutDown {
      from { transform: translateY(0); opacity: 1; }
      to { transform: translateY(30px); opacity: 0; }
    }

    /* --- Quiz Feedback Animations --- */
    .animate-correct-pop {
      animation: correct-pop 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
    .animate-incorrect-shake {
      animation: incorrect-shake 0.8s cubic-bezier(.36,.07,.19,.97) both;
    }
    .animate-correct-pop-heritage {
      animation: correct-pop-heritage 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
    .animate-incorrect-shake-heritage {
      animation: incorrect-shake-heritage 0.8s cubic-bezier(.36,.07,.19,.97) both;
    }


    @keyframes correct-pop {
      0% { transform: scale(1) translateY(0); }
      10% { transform: scale(1.05) translateY(-3px); }
      20% { transform: scale(1) translateY(0); }
      30%, 100% {
        border-color: #22c55e; /* green-500 */
        background-color: rgba(34, 197, 94, 0.15);
        box-shadow: 0 0 25px rgba(34, 197, 94, 0.5);
      }
    }

    @keyframes incorrect-shake {
      10%, 90% { transform: translate3d(-1px, 0, 0); }
      20%, 80% { transform: translate3d(2px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
      40%, 60% { transform: translate3d(4px, 0, 0); }
      0%, 100% {
        background-color: rgba(39, 39, 42, 0.6);
        border-color: #52525b; /* zinc-600 */
      }
      50% {
        background-color: rgba(239, 68, 68, 0.2);
        border-color: #ef4444; /* red-500 */
      }
    }

    @keyframes correct-pop-heritage {
        0% { transform: scale(1) translateY(0); }
        10% { transform: scale(1.05) translateY(-3px); }
        20% { transform: scale(1) translateY(0); }
        30%, 100% {
            border-color: #166534; /* green-800 */
            background-color: rgba(34, 197, 94, 0.4); /* green-500 with more opacity */
            box-shadow: 0 0 15px rgba(34, 197, 94, 0.5);
        }
    }

    @keyframes incorrect-shake-heritage {
        10%, 90% { transform: translate3d(-1px, 0, 0); }
        20%, 80% { transform: translate3d(2px, 0, 0); }
        30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
        40%, 60% { transform: translate3d(4px, 0, 0); }
        0%, 100% {
            background-color: rgba(255, 255, 255, 0.4);
            border-color: #a16207; /* amber-700 */
        }
        50% {
            background-color: rgba(239, 68, 68, 0.4); /* red-500 with more opacity */
            border-color: #b91c1c; /* red-700 */
        }
    }

    /* --- New Quiz Option Styles --- */
    .quiz-option {
      display: flex;
      align-items: center;
      gap: 1rem;
      text-align: right;
      padding: 1rem 1.5rem;
      border: 2px solid #52525b; /* zinc-600 */
      background-color: rgba(39, 39, 42, 0.6); /* zinc-800/60 */
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 0.75rem;
      cursor: pointer;
    }
    .quiz-option:hover:not(:disabled) {
      border-color: #fbbf24; /* amber-400 */
      background-color: rgba(59, 59, 62, 0.8); /* zinc-700/80 */
      transform: translateY(-3px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    }
    .quiz-option:disabled {
      cursor: not-allowed;
    }
    .quiz-option-prefix {
      font-family: 'Amiri', serif;
      font-weight: bold;
      font-size: 1.5rem;
      color: #fbbf24; /* amber-400 */
      border-right: 2px solid #71717a; /* zinc-500 */
      padding-right: 1rem;
      margin-left: -0.5rem; /* Optical adjustment */
    }
    .quiz-option-text {
      flex: 1;
    }

    /* --- Heritage Quiz Option Styles --- */
    .quiz-option-heritage {
      display: flex;
      align-items: center;
      gap: 1rem;
      text-align: right;
      padding: 1rem 1.5rem;
      border: 2px solid #a16207; /* amber-700 */
      background-color: rgba(255, 255, 255, 0.4); /* transparent white */
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 0.75rem;
      cursor: pointer;
      color: #18181b; /* zinc-900 */
    }
    .quiz-option-heritage:hover:not(:disabled) {
      border-color: #713f12; /* amber-900 */
      background-color: rgba(255, 255, 255, 0.7);
      transform: translateY(-3px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    .quiz-option-heritage:disabled {
      cursor: not-allowed;
    }
    .quiz-option-heritage .quiz-option-prefix {
        color: #92400e; /* amber-800 */
        border-right-color: #b45309; /* amber-700 */
    }


    /* Golden Glow Effect for Cards */
    .glowing-card {
      border: 1px solid rgba(251, 191, 36, 0.2); /* amber-400/20 */
      /* Replicating shadow-2xl with black/20 and adding a static golden glow */
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.2), 
                  0 0 15px rgba(251, 191, 36, 0.3);
    }

    .glowing-card:hover {
      border-color: rgba(251, 191, 36, 0.5);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3), 
                  0 0 35px rgba(251, 191, 36, 0.5);
    }

    /* --- Completed Quiz Card --- */
    .quiz-completed-card {
      border-color: rgba(74, 222, 128, 0.4); /* green-400/40 */
      background: radial-gradient(circle, rgba(22, 163, 74, 0.1), transparent 70%), rgba(24, 24, 27, 0.5);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 
                  0 0 30px rgba(74, 222, 128, 0.5); /* green-400/50 */
    }

    .quiz-completed-card:hover {
      border-color: rgba(74, 222, 128, 0.6); /* green-400/60 */
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3), 
                  0 0 40px rgba(74, 222, 128, 0.6);
    }


    /* --- Glowing Red words --- */
    .glow-red {
      color: #fca5a5; /* red-300 */
      text-shadow: 0 0 6px rgba(239, 68, 68, 0.8);
    }

    /* --- Wheel of Fortune --- */
    .wheel-of-fortune-button {
      padding: 0.75rem 2rem;
      border-radius: 0.75rem;
      border: 2px solid #a16207; /* amber-700 */
      color: #a16207;
      background: rgba(255, 255, 255, 0.4);
      font-weight: bold;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    }
    .wheel-of-fortune-button:hover {
      background: rgba(255, 255, 255, 0.7);
      border-color: #713f12; /* amber-900 */
      color: #713f12;
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(0,0,0,0.15);
    }

    .wheel-container {
      position: relative;
      width: 500px;
      height: 500px;
      max-width: 90vw;
      max-height: 90vw;
      margin: 2rem auto;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .wheel-pointer {
      position: absolute;
      top: -15px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 20px solid transparent;
      border-right: 20px solid transparent;
      border-top: 30px solid #713f12; /* amber-900 */
      z-index: 10;
      filter: drop-shadow(0 -2px 2px rgba(0,0,0,0.3));
    }

    .wheel {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 10px solid #a16207; /* amber-700 */
      background: #d2b48c; /* tan */
      background-image: url('https://www.transparenttextures.com/patterns/wood-pattern.png');
      box-shadow: 0 0 20px rgba(0,0,0,0.3), inset 0 0 25px rgba(0,0,0,0.4);
      transition: transform 6s cubic-bezier(0.25, 1, 0.5, 1);
    }

    .wheel-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 120px;
      height: 120px;
      background: #713f12; /* amber-900 */
      border-radius: 50%;
      z-index: 5;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 5px solid #a16207; /* amber-700 */
      box-shadow: 0 0 15px rgba(0,0,0,0.5);
    }
    .wheel-spin-button {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: #fbbf24; /* amber-400 */
      border: 2px solid #b45309; /* amber-700 */
      color: #713f12;
      font-family: 'Amiri', serif;
      font-size: 1.5rem;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .wheel-spin-button:hover:not(:disabled) {
      background: #f59e0b; /* amber-500 */
      transform: scale(1.05);
    }
    .wheel-spin-button:disabled {
      background: #92400e; /* amber-800 */
      color: #f3e9d2;
      cursor: not-allowed;
    }
    .wheel-spin-button.spinning {
        animation: pulse 1.5s infinite;
    }
    @keyframes pulse {
        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.7); }
        70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(251, 191, 36, 0); }
        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(251, 191, 36, 0); }
    }

    .wheel-number-marker {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 40px;
        height: 40px;
        margin: -20px 0 0 -20px;
        transform-origin: center center;
        transition: opacity 0.3s;
    }
    .wheel-number-text {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: #f3e9d2;
        border: 2px solid #a16207;
        color: #44403c;
        font-size: 1.25rem;
        font-weight: bold;
    }
    .wheel-number-marker.used .wheel-number-text {
        background: #a8a29e; /* stone-400 */
        color: #78716c; /* stone-500 */
        border-color: #78716c;
    }

    /* --- Wheel Popup --- */
    .wheel-popup-overlay {
        position: absolute;
        inset: -2rem; /* cover the padded area */
        background-color: rgba(0,0,0,0.7);
        backdrop-filter: blur(5px);
        z-index: 20;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
    }
    .wheel-popup-content {
        position: relative;
        width: 100%;
        max-width: 600px;
        padding: 2.5rem;
        border-radius: 1rem;
        text-align: center;
        color: #18181b;
        background-color: #f3e9d2; 
        background-image: url('https://www.toptal.com/designers/subtlepatterns/uploads/old_paper.png'); 
        box-shadow: 0 0 30px rgba(0,0,0,0.5) inset, 0 10px 40px rgba(0,0,0,0.5);
        border: 4px solid #a16207;
    }
    .wheel-popup-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        color: #a16207;
        background: transparent;
        border: none;
        cursor: pointer;
        transition: color 0.2s;
    }
    .wheel-popup-close:hover {
        color: #713f12;
    }
    .wheel-popup-number {
        font-family: 'Amiri', serif;
        font-size: 6rem;
        font-weight: bold;
        color: #713f12;
        text-shadow: 2px 2px 0 #d2b48c, 4px 4px 5px rgba(0,0,0,0.2);
    }
  `],
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