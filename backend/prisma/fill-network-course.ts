/**
 * O'qituvchi yaratgan "Kompyuter Tarmoqlari" kursiga
 * o'zbekcha darslar va qo'llanmalar qo'shadi.
 *
 * Ishlatish: npm run db:fill-network
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─────────────────────────── Darslar ma'lumoti ───────────────────────────

const LESSONS = [
  {
    title: "Kompyuter tarmoqlari nima? Kirish va asosiy tushunchalar",
    duration: "12 daqiqa",
    type: "video",
    xpReward: 10,
    videoUrl: "https://www.youtube.com/watch?v=3QhU9jd6a2k",
    resourceUrl: "https://ziyonet.uz/ru/material/view/local/23567",
    resourceName: "Kompyuter tarmoqlari - ziyonet.uz",
    resourceType: "link",
    content: `Kompyuter tarmog'i — bu ikki yoki undan ortiq kompyuter va qurilmalarni ma'lumot almashish hamda resurslardan birgalikda foydalanish maqsadida ulash tizimidir.

Tarmoqning asosiy elementlari:
• Tugunlar (node) — kompyuter, noutbuk, smartfon, printer, server kabi qurilmalar
• Aloqa kanali — tarmoq kabeli (UTP, fiber-optik), Wi-Fi radio to'lqini
• Tarmoq qurilmalari — Switch, Router, Hub, Access Point
• Protokollar — qurilmalar orasida ma'lumot almashish qoidalari (TCP/IP, HTTP, FTP)

Tarmoqdan foydalanish afzalliklari:
1. Resurslarni birgalikda ishlatish — bitta printer yoki skanerni butun ofis ishlatishi
2. Tezkor aloqa — elektron pochta, chat, video muloqot
3. Markazlashtirilgan ma'lumotlar — serverda bitta bazada barcha foydalanuvchilar uchun
4. Xavfsizlik nazorati — foydalanuvchi huquqlarini boshqarish

Tarmoq tarixi: 1969-yilda ARPANET (Advanced Research Projects Agency Network) AQSh mudofaa vazirligi tomonidan yaratildi. Bu zamonaviy internetning kashshofi bo'ldi. 1991-yilda Tim Berners-Lee World Wide Web (WWW) tizimini ixtiro qildi va internet omma uchun ochildi.`,
  },

  {
    title: "Tarmoq turlari: LAN, MAN, WAN va PAN",
    duration: "14 daqiqa",
    type: "video",
    xpReward: 15,
    videoUrl: "https://www.youtube.com/watch?v=8I9ZYrDYO1w",
    resourceUrl: "https://ziyonet.uz/ru/material/view/local/23568",
    resourceName: "Tarmoq turlari — o'quv qo'llanma",
    resourceType: "link",
    content: `Kompyuter tarmoqlari qamrov maydoniga qarab bir necha turga bo'linadi:

1. PAN — Personal Area Network (Shaxsiy tarmoq)
Masofasi: 10 metrgacha. Misol: Bluetooth quloqchin yoki sichqonchani telefonga ulash, smartwatch. Faqat bitta shaxs uchun.

2. LAN — Local Area Network (Mahalliy tarmoq)
Masofasi: 100 metrgacha (bir bino yoki bir xona). Misol: Ofis, maktab sinfi, uy tarmoqi. Yuqori tezlik (100 Mbps – 10 Gbps), arzon xarajat. Standart: IEEE 802.3 (Ethernet), IEEE 802.11 (Wi-Fi).

3. MAN — Metropolitan Area Network (Shahar tarmoqi)
Masofasi: 50-100 km (shahar miqyosida). Misol: Toshkent shahrida bir nechta idoralarni ulash, shahar Wi-Fi tarmog'i. Operatorlar tomonidan boshqariladi.

4. WAN — Wide Area Network (Keng hududli tarmoq)
Masofasi: Cheksiz (davlatlar va qit'alar orasida). Misol: Internet — eng katta WAN. Fiber-optik kabellar dengiz ostidan o'tadi. Setkalar operatorlari (MTS, Ucell, Beeline) WAN tarmog'ini ta'minlaydi.

Qiyosiy jadval:
| Tur  | Masofasi     | Tezligi      | Misol          |
|------|--------------|--------------|----------------|
| PAN  | ~10 m        | Past         | Bluetooth      |
| LAN  | 100 m – 1 km | Juda yuqori  | Ofis tarmog'i  |
| MAN  | 10–100 km    | Yuqori       | Shahar tarmog'i|
| WAN  | Cheksiz      | O'rta        | Internet       |`,
  },

  {
    title: "Tarmoq topologiyalari: yulduz, avtobus, halqa, to'r",
    duration: "14 daqiqa",
    type: "video",
    xpReward: 15,
    videoUrl: "https://www.youtube.com/watch?v=zbqrNg4C98U",
    resourceUrl: "https://ziyonet.uz/ru/material/view/local/23569",
    resourceName: "Tarmoq topologiyalari — sxemalar bilan",
    resourceType: "link",
    content: `Tarmoq topologiyasi — tarmoqdagi qurilmalarning o'zaro ulanish usuli va joylashishi sxemasidir. Ikki tur mavjud: fizik topologiya (kabellar qanday tortilgan) va mantiqiy topologiya (signal qanday yo'l bosadi).

1. Avtobus topologiyasi (Bus)
Barcha qurilmalar bitta asosiy kabelga ulangan. Afzallik: Arzon, oddiy. Kamchilik: Kabel uzilib ketsa, butun tarmoq ishlamay qoladi. Hozir kam ishlatiladi.

2. Yulduz topologiyasi (Star) — ENG KO'P ISHLATILADIGAN
Barcha qurilmalar markaziy switch/hub ga ulangan. Afzallik: Bitta kabel uzilib ketsa, faqat o'sha qurilma uziladi, qolganlari ishlaydi. Kamchilik: Switch ishlamay qolsa, butun tarmoq to'xtaydi. Misol: Maktab va ofis tarmoqlari.

3. Halqa topologiyasi (Ring)
Qurilmalar yopiq halqa hosil qiladi, ma'lumot faqat bir yo'nalishda harakatlanaadi. Afzallik: Teng kenglik (bandwidth). Kamchilik: Bitta qurilma ishlamay qolsa, butun halqa uziladi. Misol: Eski Token Ring tarmoqlari.

4. To'r topologiyasi (Mesh)
Har bir qurilma boshqa qurilmalar bilan to'g'ridan-to'g'ri ulangan. Afzallik: Eng ishonchli — biror kanal uzilsa, alternativ yo'l bor. Kamchilik: Juda ko'p kabel va xarajat. Misol: Internet magistral kanallari, harbiy tarmoqlar.

5. Daraxt topologiyasi (Tree)
Yulduz topologiyalarining birlashmasi. Korporativ tarmoqlarda keng qo'llanadi. Ierarxik tuzilish: bosh switch → bino switch'lari → xona switch'lari.`,
  },

  {
    title: "IP manzil tizimi: IPv4, IPv6 va subnet mask",
    duration: "18 daqiqa",
    type: "video",
    xpReward: 20,
    videoUrl: "https://www.youtube.com/watch?v=ddM0AcreVqE",
    resourceUrl: "https://ziyonet.uz/ru/material/view/local/23570",
    resourceName: "IP manzillar va subnetting — amaliy qo'llanma",
    resourceType: "link",
    content: `IP (Internet Protocol) manzil — tarmoqdagi har bir qurilmaning noyob identifikatori (manzili). Pochtadagi uy manzili singari, IP manzil ma'lumotlarni to'g'ri qurilmaga yetkazadi.

IPv4 (Internet Protocol version 4):
Format: 4 ta oktet, nuqta bilan ajratilgan. Misol: 192.168.1.100
Har bir oktet 0 dan 255 gacha bo'lgan son (8 bit).
Jami: 2³² = ~4,3 milliard manzil (tugab qolmoqda!)

IPv4 sinflari:
• A sinfi: 1.0.0.0 – 126.255.255.255 (yirik tashkilotlar)
• B sinfi: 128.0.0.0 – 191.255.255.255 (o'rta tashkilotlar)
• C sinfi: 192.0.0.0 – 223.255.255.255 (kichik tarmoqlar)

Xususiy (private) IP manzillar (internet tashqarisida):
• 10.0.0.0 – 10.255.255.255
• 172.16.0.0 – 172.31.255.255
• 192.168.0.0 – 192.168.255.255

Subnet Mask (Qism tarmog'i niqobi):
IP manzilning qaysi qismi tarmoqni, qaysi qismi qurilmani ko'rsatishini belgilaydi.
Misol: IP = 192.168.1.100, Mask = 255.255.255.0
→ Tarmoq manzili: 192.168.1.0
→ Qurilma manzili: 100

IPv6 (Internet Protocol version 6):
Format: 8 ta 4 xonali hex guruh, ikki nuqta bilan ajratilgan.
Misol: 2001:0db8:85a3:0000:0000:8a2e:0370:7334
Jami: 2¹²⁸ = ~340 undecillion manzil (amalda cheksiz!)
IPv4 tanqisligi muammosini hal qiladi.`,
  },

  {
    title: "OSI modeli: 7 qatlam va ularning vazifalari",
    duration: "22 daqiqa",
    type: "video",
    xpReward: 25,
    videoUrl: "https://www.youtube.com/watch?v=lAtip3KS4FU",
    resourceUrl: "https://ziyonet.uz/ru/material/view/local/23571",
    resourceName: "OSI modeli — batafsil qo'llanma",
    resourceType: "link",
    content: `OSI (Open Systems Interconnection) modeli — tarmoqda ma'lumot almashishni 7 ta qatlamga bo'lib tushuntiruvchi standart model. ISO tomonidan 1984-yilda ishlab chiqilgan.

OSI modelining 7 qatlami (pastdan yuqoriga):

7. Ilova qatlami (Application Layer)
Foydalanuvchi dasturlari bilan ishlaydi. Protokollar: HTTP, HTTPS, FTP, SMTP (email), DNS, Telnet. Misol: Brauzerda web-sahifa ochish.

6. Taqdimot qatlami (Presentation Layer)
Ma'lumotni formatlaydi, shifrlaydi/shifrini ochadi, siqadi. Misol: SSL/TLS shifrlash, JPEG/PNG formatlar.

5. Seans qatlami (Session Layer)
Aloqa seansini o'rnatadi, boshqaradi va tugatadi. Misol: Video qo'ng'iroq vaqtida aloqa o'rnatish/uzish.

4. Transport qatlami (Transport Layer)
Ma'lumotni segmentlarga bo'ladi, xatolarni tekshiradi. Protokollar: TCP (ishonchli, tartibli), UDP (tez, lekin ishonchsiz). Misol: Fayl yuklash — TCP; video streaming — UDP.

3. Tarmoq qatlami (Network Layer)
Ma'lumotga IP manzil qo'shadi, yo'naltiradi (routing). Protokollar: IP, ICMP, ARP. Qurilma: Router.

2. Ma'lumotlar zanjiri qatlami (Data Link Layer)
MAC manzil bilan ishlaydi, bir tarmoqdagi qurilmalar aloqasini ta'minlaydi. Protokollar: Ethernet, Wi-Fi (802.11). Qurilma: Switch.

1. Jismoniy qatlam (Physical Layer)
Bitlarni signal (elektr, optik, radio) sifatida uzatadi. Kabellar, konnektorlar, hub. Misol: Ethernet kabeli, Wi-Fi antenna.

Eslab qolish uchun: "All People Seem To Need Data Processing" (A-P-S-T-N-D-P)`,
  },

  {
    title: "TCP/IP protokol to'plami va ma'lumot uzatish jarayoni",
    duration: "18 daqiqa",
    type: "video",
    xpReward: 20,
    videoUrl: "https://www.youtube.com/watch?v=PwQ1mwAYL44",
    resourceUrl: "https://ziyonet.uz/ru/material/view/local/23572",
    resourceName: "TCP/IP protokollari — o'quv materiali",
    resourceType: "link",
    content: `TCP/IP — internetning asosiy protokollar to'plami. 1970-yillarda DARPA tomonidan ishlab chiqilgan. Zamonaviy internet shu protokollar asosida ishlaydi.

TCP/IP modeli 4 qatlamdan iborat (OSI modelining soddalashtiriilgan versiyasi):

4. Ilova qatlami (Application): HTTP, HTTPS, FTP, DNS, SMTP
3. Transport qatlami (Transport): TCP, UDP
2. Internet qatlami (Internet): IP, ICMP, ARP
1. Tarmoq interfeysi qatlami (Network Access): Ethernet, Wi-Fi

TCP (Transmission Control Protocol) — Ishonchli protokol:
• 3 bosqichli ulanish (Three-way handshake): SYN → SYN-ACK → ACK
• Ma'lumot segmentlarga bo'linadi va raqamlanadi
• Har bir segment uchun tasdiqlash (acknowledgment) kutiladi
• Yo'qolgan segment qayta yuboriladi
• Ishlatiladi: web-sahifalar, fayl yuklab olish, email

UDP (User Datagram Protocol) — Tez protokol:
• Ulanish o'rnatilmaydi (connectionless)
• Tasdiqlash yo'q, yo'qolgan paket qayta yuborilmaydi
• Tezroq, lekin ishonchsiz
• Ishlatiladi: video qo'ng'iroq, online o'yinlar, DNS so'rovlar, video streaming

Ma'lumot uzatish jarayoni (misol: web-sahifa ochish):
1. Brauzer: HTTP so'rovi tayyorlaydi
2. TCP: So'rovni segmentlarga bo'ladi, port 80/443 belgilaydi
3. IP: Manzil qo'shadi (manba va maqsad IP), paket yaratiladi
4. Ethernet: MAC manzil qo'shadi, kabelga yuboradi
5. Router: IP manzilga qarab yo'naltiradi
6. Server: Ma'lumotni qabul qiladi, javob yuboradi
7. Brauzer: HTML sahifani ko'rsatadi`,
  },

  {
    title: "Tarmoq qurilmalari: Hub, Switch, Router va Access Point",
    duration: "16 daqiqa",
    type: "video",
    xpReward: 20,
    videoUrl: "https://www.youtube.com/watch?v=Vc3_vslJ48o",
    resourceUrl: "https://ziyonet.uz/ru/material/view/local/23573",
    resourceName: "Tarmoq qurilmalari — Cisco qo'llanmasi",
    resourceType: "link",
    content: `Kompyuter tarmog'ini qurish uchun maxsus qurilmalar ishlatiladi. Har bir qurilma tarmoqda o'z vazifasini bajaradi.

1. Hub (Kontsentrator) — OSI 1-qatlam
Barcha portlarga signal uzatadi (broadcast). Bir vaqtning o'zida faqat bitta qurilma ma'lumot yuborishi mumkin. Juda eski texnologiya, hozir deyarli ishlatilmaydi. Tezligi: 10 yoki 100 Mbps.

2. Switch (Kommutator) — OSI 2-qatlam (ENG KO'P ISHLATILADIGAN)
MAC-manzil jadvalini saqlaydi, ma'lumotni faqat kerakli portga yuboradi. Ko'p qurilmalar bir vaqtda muloqot qilishi mumkin (full duplex). Tezligi: 100 Mbps – 10 Gbps. Misol: Ofis yoki maktab xona switch'lari.

3. Router (Yo'riqnoma) — OSI 3-qatlam
Turli tarmoqlar orasida ma'lumot yo'naltiradi. IP manzil jadvalini (routing table) saqlaydi. Uy internetida: provayder (internet) ↔ uy tarmog'i orasida. Xususiyatlari: NAT (bir IP dan ko'p qurilma), DHCP (avtomatik IP berish), Firewall (himoya).

4. Access Point (Simsiz kirish nuqtasi) — Wi-Fi
Simsiz qurilmalarni simli tarmoqqa ulaydi. 802.11a/b/g/n/ac/ax (Wi-Fi 6) standartlari. Tezligi: 54 Mbps – 9.6 Gbps (Wi-Fi 6).

5. Modem (Modulyator-Demodulyator)
Raqamli signal ↔ analog signal o'tkazadi. ADSL, kabel, fiber-optik modemlar. Provayder tarmog'i bilan uyni ulaydi.

Uy tarmog'ida odatiy zanjir:
Internet kabeli → Modem → Router/Wi-Fi router → Switch → Kompyuterlar`,
  },

  {
    title: "DNS va DHCP xizmatlari: Tarmoq xizmatlari asoslari",
    duration: "16 daqiqa",
    type: "video",
    xpReward: 20,
    videoUrl: "https://www.youtube.com/watch?v=2wg__cJWub8",
    resourceUrl: "https://ziyonet.uz/ru/material/view/local/23574",
    resourceName: "DNS va DHCP — texnik qo'llanma",
    resourceType: "link",
    content: `Tarmoqlarda qurilmalar va foydalanuvchilarni boshqarish uchun maxsus xizmatlar ishlaydi.

DNS — Domain Name System (Domen Nomlar Tizimi)

DNS — bu "internetning telefon kitobi". Odam o'qiy oladigan domen nomlarini (google.com) mashinalar tushunadigan IP manzillarga (142.250.180.142) aylantiradi.

DNS so'rovi jarayoni:
1. Brauzerda "google.com" kiritiladi
2. Qurilma avval mahalliy keshni tekshiradi
3. Bo'lmasa, ISP DNS serveriga so'rov ketadi
4. DNS server IP manzilni qaytaradi
5. Brauzer o'sha IP ga ulanadi

Mashhur DNS serverlar:
• Google: 8.8.8.8 va 8.8.4.4
• Cloudflare: 1.1.1.1
• ISP ning o'z DNS serveri

DNS yozuvlari (Record Types):
• A yozuvi: domen → IPv4 manzil
• AAAA yozuvi: domen → IPv6 manzil
• MX yozuvi: email server manzili
• CNAME: taxallus (alias)

DHCP — Dynamic Host Configuration Protocol

DHCP — tarmoqqa ulangan qurilmalarga avtomatik IP manzil beradigan protokol. Qo'lda sozlash o'rniga, router yoki server avtomatik:
• IP manzil beradi (masalan: 192.168.1.50)
• Subnet mask belgilaydi (255.255.255.0)
• Gateway ko'rsatadi (192.168.1.1 — router IP)
• DNS server manzilini beradi

DHCP jarayoni (DORA):
D — Discover: Qurilma "IP kim beradi?" deb so'radi (broadcast)
O — Offer: DHCP server bo'sh IP taklif qiladi
R — Request: Qurilma taklifni qabul qiladi
A — Acknowledge: Server IP ni tasdiqlaydi va beradi`,
  },

  {
    title: "Tarmoq xavfsizligi: Firewall, VPN va asosiy tahdidlar",
    duration: "18 daqiqa",
    type: "video",
    xpReward: 25,
    videoUrl: "https://www.youtube.com/watch?v=9GZlVOafYTg",
    resourceUrl: "https://ziyonet.uz/ru/material/view/local/23575",
    resourceName: "Tarmoq xavfsizligi — Axborot xavfsizligi markazi",
    resourceType: "link",
    content: `Tarmoq xavfsizligi — ruxsatsiz kirish, ma'lumot o'g'irlash va zarar beruvchi hujumlardan tarmoqni himoya qilish amaliyotidir.

Asosiy tarmoq tahdidlari:
1. DoS/DDoS hujumi — serverga juda ko'p so'rov yuborib, uni ishlamay qoldirish
2. Man-in-the-Middle (MitM) — hacker ikki tomon orasida o'tirib, ma'lumotni ushlab olish
3. Phishing — soxta sayt orqali parol va ma'lumotlarni o'g'irlash
4. Troyan va viruslar — zararli dasturlar tarmoq orqali tarqaladi
5. Brute Force — parolni taxmin qilib topish

Asosiy himoya vositalari:

Firewall (Xavfsizlik devori):
Kiruvchi va chiquvchi trafikni filtrlaydi. Qoidalar (rules) asosida ruxsat yoki bloklash qiladi. Turlari: Packet filter, Stateful firewall, Application firewall.
Misol qoidasi: "Tashqaridan port 22 (SSH) ga kirish taqiqlangan."

VPN — Virtual Private Network:
Internetda shifrlangan xususiy tunel yaratadi. ISP va hackerlar trafikni ko'ra olmaydi. Ishlatilish holatlari: Uzoqdan ofisga ulanish, bloklanagan saytlarga kirish, ommaviy Wi-Fi da xavfsiz ishlash.

Shifrlash (Encryption):
Symmetric (AES): Bir kalit bilan shifrlash va ochish. Asymmetric (RSA): Ommaviy kalit (public) va shaxsiy kalit (private). TLS/SSL — web-saytlardagi HTTPS protokolining asosi.

Xavfsizlik tavsiyalari:
• Kuchli parollar ishlatish (12+ belgi, aralash)
• Dasturlarni yangilab turish (patch management)
• Wi-Fi uchun WPA3 shifrlash
• 2FA (ikki omilli autentifikatsiya) yoqish
• Tarmoqni segmentlash (VLAN)`,
  },

  {
    title: "Kompyuter tarmoqlari yakuniy testi",
    duration: "15 daqiqa",
    type: "quiz",
    xpReward: 50,
    videoUrl: null,
    resourceUrl: null,
    resourceName: null,
    resourceType: null,
    content: JSON.stringify([
      {
        id: 1,
        q: "LAN (Local Area Network) qaysi hududni qamrab oladi?",
        options: [
          "Bitta bino yoki ofis (100 m gacha)",
          "Butun shahar hududini",
          "Davlatlar orasidagi ulanish",
          "Faqat bitta xona"
        ],
        correct: 0,
      },
      {
        id: 2,
        q: "OSI modelining nechtanchi qatlami ma'lumotni yo'naltirish (routing) uchun javobgar?",
        options: [
          "1-qatlam (Jismoniy)",
          "2-qatlam (Ma'lumotlar zanjiri)",
          "3-qatlam (Tarmoq)",
          "4-qatlam (Transport)"
        ],
        correct: 2,
      },
      {
        id: 3,
        q: "TCP va UDP ning asosiy farqi nima?",
        options: [
          "TCP faqat simli tarmoqlarda ishlaydi",
          "TCP ishonchli va tasdiqlash yuboradi, UDP esa tez lekin ishonchsiz",
          "UDP faqat serverlar uchun ishlatiladi",
          "Ular bir xil, faqat nomi farq qiladi"
        ],
        correct: 1,
      },
      {
        id: 4,
        q: "Switch va Hub ning asosiy farqi nima?",
        options: [
          "Switch barcha portlarga signal yuboradi, Hub esa faqat kerakli portga",
          "Hub barcha portlarga signal yuboradi, Switch esa faqat kerakli portga (MAC jadval asosida)",
          "Ular bir xil qurilma, faqat narxi farq qiladi",
          "Switch faqat Wi-Fi uchun ishlatiladi"
        ],
        correct: 1,
      },
      {
        id: 5,
        q: "IPv4 manzil nechta bitdan iborat?",
        options: ["8 bit", "16 bit", "32 bit", "128 bit"],
        correct: 2,
      },
      {
        id: 6,
        q: "DNS xizmati qanday vazifani bajaradi?",
        options: [
          "Qurilmaga avtomatik IP manzil beradi",
          "Domen nomini (google.com) IP manzilga aylantiradi",
          "Tarmoqni zararli hujumlardan himoya qiladi",
          "Wi-Fi signal kuchini oshiradi"
        ],
        correct: 1,
      },
      {
        id: 7,
        q: "DHCP protokoli qanday vazifani bajaradi?",
        options: [
          "Domen nomlarini boshqaradi",
          "Tarmoq trafikini shifrlaydi",
          "Qurilmalarga avtomatik IP manzil, gateway va DNS beradi",
          "Ma'lumotni segment qismlarga bo'ladi"
        ],
        correct: 2,
      },
      {
        id: 8,
        q: "Yulduz (Star) topologiyasining asosiy afzalligi nima?",
        options: [
          "Eng kam kabel sarflaydi",
          "Bitta qurilma uzilib ketsa, faqat o'sha uziladi, qolganlar ishlaydi",
          "Markaziy qurilma ishlamasa ham tarmoq davom etadi",
          "Juda katta masofalarda ishlaydi"
        ],
        correct: 1,
      },
      {
        id: 9,
        q: "VPN (Virtual Private Network) qanday vazifani bajaradi?",
        options: [
          "Internet tezligini oshiradi",
          "Internetda shifrlangan xususiy tunel yaratib, xavfsiz aloqa ta'minlaydi",
          "Qurilmalarga IP manzil beradi",
          "Wi-Fi tarmog'ini boshqaradi"
        ],
        correct: 1,
      },
      {
        id: 10,
        q: "Router (yo'riqnoma) OSI modelining qaysi qatlamida ishlaydi?",
        options: [
          "1-qatlam (Jismoniy)",
          "2-qatlam (Ma'lumotlar zanjiri)",
          "3-qatlam (Tarmoq)",
          "4-qatlam (Transport)"
        ],
        correct: 2,
      },
    ]),
  },
];

// ─────────────────────────────── Asosiy funksiya ─────────────────────────────────

async function main() {
  console.log("→ Kompyuter Tarmoqlari kursini to'ldirilmoqda...\n");

  // O'qituvchini topish
  const teacher = await prisma.user.findFirst({
    where: { role: "teacher" },
    orderBy: { joinedAt: "asc" },
  });
  if (!teacher) {
    console.error("❌ Teacher topilmadi!");
    return;
  }
  console.log(`  ✓ O'qituvchi topildi: ${teacher.name} (${teacher.email})`);

  // Bu o'qituvchining barcha kurslarini ko'rish
  const allCourses = await prisma.course.findMany({
    where: { instructorId: teacher.id },
    include: { _count: { select: { lessons: true } } },
    orderBy: { createdAt: "desc" },
  });

  console.log("\n  Barcha kurslar:");
  allCourses.forEach((c) =>
    console.log(`    [${c._count.lessons} dars] ${c.id} — "${c.title}"`)
  );

  // "Tarmoq" yoki "Informatika" so'zi bilan nomlanagan, darslar kam bo'lgan kursni topish
  let targetCourse = allCourses.find(
    (c) =>
      (c.title.toLowerCase().includes("tarmoq") ||
        c.title.toLowerCase().includes("informatika") ||
        c.title.toLowerCase().includes("network")) &&
      c._count.lessons < 3
  );

  // Agar topilmasa — eng oxirgi yaratilgan, bo'sh kurs
  if (!targetCourse) {
    targetCourse = allCourses.find((c) => c._count.lessons === 0);
  }

  // Agar hali ham topilmasa — c-007 ni ishlatamiz
  if (!targetCourse) {
    const fallback = await prisma.course.findUnique({
      where: { id: "c-007" },
      include: { _count: { select: { lessons: true } } },
    });
    if (fallback) {
      targetCourse = fallback;
      console.log("\n  ⚠️  Bo'sh yangi kurs topilmadi — c-007 ishlatilmoqda");
    } else {
      console.error('\n❌ Hech qanday "Kompyuter Tarmoqlari" kursi topilmadi!');
      console.log("  Avval o'qituvchi sifatida kurs yarating.");
      return;
    }
  }

  console.log(
    `\n  → Kurs: "${targetCourse.title}" (${targetCourse.id}) — ${targetCourse._count.lessons} ta mavjud dars`
  );

  // Agar kursda allaqachon darslar bo'lsa, tozalash
  if (targetCourse._count.lessons > 0) {
    console.log(`  ⚠️  Mavjud ${targetCourse._count.lessons} ta dars o'chirilmoqda...`);
    await prisma.lesson.deleteMany({ where: { courseId: targetCourse.id } });
  }

  // Darslarni qo'shish
  console.log("\n  Darslar qo'shilmoqda:");
  for (let i = 0; i < LESSONS.length; i++) {
    const l = LESSONS[i];
    const lesson = await prisma.lesson.create({
      data: {
        courseId: targetCourse.id,
        title: l.title,
        duration: l.duration,
        type: l.type,
        order: i + 1,
        xpReward: l.xpReward,
        videoUrl: l.videoUrl ?? null,
        content: l.content ?? null,
        resourceUrl: l.resourceUrl ?? null,
        resourceName: l.resourceName ?? null,
        resourceType: l.resourceType ?? null,
      },
    });
    console.log(`    ✓ ${i + 1}. ${lesson.title}`);
  }

  // Kurs davomiyligini yangilash (9 dars × ~16 daq ≈ 2.5 soat)
  await prisma.course.update({
    where: { id: targetCourse.id },
    data: {
      duration: "24 soat",
      rating: 4.8,
      tags: ["Tarmoq", "OSI", "TCP/IP", "IP manzil", "Router", "Switch", "DNS", "Xavfsizlik"],
      thumbnail: "network",
      description:
        "Kompyuter tarmoqlari asoslarini o'rganing: LAN/WAN, OSI modeli, TCP/IP, IP manzillar, DNS, DHCP, tarmoq qurilmalari (router, switch) va tarmoq xavfsizligi. O'zbekcha tushuntirishlar va amaliy misollar.",
    },
  });

  // Topshiriq qo'shish
  const existingAssignments = await prisma.assignment.count({
    where: { courseId: targetCourse.id },
  });

  if (existingAssignments === 0) {
    await prisma.assignment.create({
      data: {
        title: "Uy tarmog'ini loyihalash",
        courseId: targetCourse.id,
        description:
          "4 xonali uyda 8 ta qurilmani (5 kompyuter, 2 smartfon, 1 printer) ulash uchun tarmoq sxemasini tuzing. Kerakli qurilmalar, ularning ulanish tartibi va IP manzillar rejasini tavsiflab bering.",
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 hafta
        type: "project",
      },
    });

    await prisma.assignment.create({
      data: {
        title: "OSI va TCP/IP modellarini solishtirish",
        courseId: targetCourse.id,
        description:
          "OSI va TCP/IP modellarini qiyosiy jadval shaklida tayyorlang. Har bir qatlamni tushuntirib, qaysi protokollar qaysi qatlamda ishlashini ko'rsating. Kamida 5 ta real protokolni misol qiling.",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 hafta
        type: "quiz",
      },
    });

    console.log("\n  ✓ 2 ta topshiriq qo'shildi");
  }

  const finalCount = await prisma.lesson.count({
    where: { courseId: targetCourse.id },
  });

  console.log(`
✅ MUVAFFAQIYATLI TUGADI!
   Kurs: "${targetCourse.title}"
   Jami darslar: ${finalCount} ta
   (9 ta video/matn + 1 ta quiz + 10 savol)
  `);
}

main()
  .catch((e) => {
    console.error("❌ Xatolik:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
