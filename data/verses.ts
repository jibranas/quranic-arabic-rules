export interface VerseDetail {
  arabic: string;
  translation: string;
}

export interface VerseDetails {
  [key: string]: VerseDetail;
}

export const verses: VerseDetails = {
    "Al-Baqarah-30": {
      arabic: "وَإِذْ قَالَ رَبُّكَ لِلْمَلَائِكَةِ إِنِّي جَاعِلٌ فِي الْأَرْضِ خَلِيفَةً",
      translation: "And [mention, O Muhammad], when your Lord said to the angels, 'Indeed, I will make upon the earth a successive authority.'"
    },
    "An-Nisa-63": {
      arabic: "أُولَٰئِكَ الَّذِينَ يَعْلَمُ اللَّهُ مَا فِي قُلُوبِهِمْ فَأَعْرِضْ عَنْهُمْ وَعِظْهُمْ وَقُلْ لَهُمْ فِي أَنفُسِهِمْ قَوْلًا بَلِيغًا",
      translation: "Those are the ones of whom Allah knows what is in their hearts, so turn away from them but admonish them and speak to them a far-reaching word."
    },
    "Al-Maidah-116": {
      arabic: "وَإِذْ قَالَ اللَّهُ يَا عِيسَى ابْنَ مَرْيَمَ أَأَنتَ قُلتَ لِلنَّاسِ اتَّخِذُونِي وَأُمِّيَ إِلَٰهَيْنِ مِن دُونِ اللَّهِ",
      translation: "And [beware the Day] when Allah will say, 'O Jesus, Son of Mary, did you say to the people, 'Take me and my mother as deities besides Allah?'"
    },
    // Al-Baqarah, 77
    "Al-Baqarah-77": {
      arabic: "أَوَلَا يَعْلَمُونَ أَنَّ اللَّهَ يَعْلَمُ مَا يُسِرُّونَ وَمَا يُعْلِنُونَ",
      translation: "Do they not know that Allah knows what they conceal and what they declare?"
    },
    // An-Nur, 45
    "An-Nur-45": {
      arabic: "يَخْلُقُ ٱللَّهُ مَا يَشَآءُ ۚ إِنَّ ٱللَّهَ عَلَىٰ كُلِّ شَىْءٍۢ قَدِيرٌۭ",
      translation: "Allâh creates what He wills. Verily Allâh is Able to do all things."
    },
  
    "An-Naml-29": {
      arabic: "قَالَتْ يَا أَيُّهَا الْمَلَأُ إِنِّي أُلْقِيَ إِلَيَّ كِتَابٌ كَرِيمٌ",
      translation: "She said, 'O eminent ones, indeed, to me has been delivered a noble letter.'"
    },
  
    "Al-Baqarah-126": {
      arabic: "وَإِذْ قَالَ إِبْرَاهِيمُ رَبِّ اجْعَلْ هَٰذَا بَلَدًا آمِنًا",
      translation: "And [mention] when Abraham said, 'My Lord, make this a secure city.'"
    },
    
    // An-Nisa, 26
    "An-Nisa-26": {
      arabic: "يُرِيدُ اللَّهُ لِيُبَيِّنَ لَكُمْ وَيَهْدِيَكُمْ سُنَنَ الَّذِينَ مِن قَبْلِكُمْ وَيَتُوبَ عَلَيْكُمْ وَاللَّهُ عَلِيمٌ حَكِيمٌ",
      translation: "Allah wants to make clear to you [the lawful from the unlawful] and guide you to the [good] practices of those before you and to accept your repentance. And Allah is Knowing and Wise."
    },
    // An-Nur, 38
    "An-Nur-38": {
      arabic: "وَاللَّهُ يَرْزُقُ مَن يَشَاءُ بِغَيْرِ حِسَابٍ",
      translation: "And Allah provides for whom He wills without account."
    },
    // Ad-Dukhan, 2
    "Ad-Dukhan-2": {
      arabic: "وَالْكِتَابِ الْمُبِينِ",
      translation: "By the clear Book"
    },
    // Al-Fatihah, 6
    "Al-Fatihah-6": {
      arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
      translation: "Guide us to the straight path"
    },
    // Al-Baqarah, 10
    "Al-Baqarah-10": {
      arabic: "وَلَهُمْ عَذَابٌ أَلِيمٌ بِمَا كَانُوا يَكْذِبُونَ",
      translation: "And for them is a painful punishment because they used to lie."
    },
    // Al-Baqarah, 2
    "Al-Baqarah-2": {
      arabic: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ",
      translation: "This is the Book about which there is no doubt, a guidance for those conscious of Allah"
    },
    // Al-Fatihah, 3
    "Al-Fatihah-3": {
      arabic: "الرَّحْمَٰنِ الرَّحِيمِ",
      translation: "The Entirely Merciful, the Especially Merciful"
    },
    // Al-Fatihah, 2
    "Al-Fatihah-2": {
      arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      translation: "All praise is due to Allah, Lord of the worlds"
    },
    // Al-Fatihah, 4
    "Al-Fatihah-4": {
      arabic: "مَالِكِ يَوْمِ الدِّينِ",
      translation: "Sovereign of the Day of Recompense"
    },
    // Al-Fatihah, 7
    "Al-Fatihah-7": {
      arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
      translation: "The path of those upon whom You have bestowed favor, not of those who have earned [Your] anger or of those who are astray"
    },
    // Al-Fatihah, 1
    "Al-Fatihah-1": {
      arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful"
    },
    // Al-Ahzab, 23
    "Al-Ahzab-23": {
      arabic: "مِّنَ الْمُؤْمِنِينَ رِجَالٌ صَدَقُوا مَا عَاهَدُوا اللَّهَ عَلَيْهِ",
      translation: "Among the believers are men true to what they promised Allah"
    },
    // An-Nas, 6
    "An-Nas-6": {
      arabic: "مِنَ الْجِنَّةِ وَالنَّاسِ",
      translation: "From among the jinn and mankind"
    }
  }; 