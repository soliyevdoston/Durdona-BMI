/**
 * c-004 "Kompyuter Tarmoqlari" kursini to'liq to'ldiradi.
 * npm run db:fill-c004
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const LESSONS = [
  {
    title: "OSI modeli: 7 qatlam va ularning vazifalari",
    duration: "22 daqiqa",
    type: "video",
    order: 1,
    xpReward: 25,
    videoUrl: "https://www.youtube.com/watch?v=lAtip3KS4FU",
    resourceUrl: "https://ziyonet.uz/ru/material/view/local/23571",
    resourceName: "OSI modeli — batafsil qollanma",
    resourceType: "link",
    content:
      "OSI (Open Systems Interconnection) modeli — tarmoqda malumot almashishni 7 ta qatlamga bolib tushuntiruvchi xalqaro standart. ISO tomonidan 1984-yilda ishlab chiqilgan.\n\n" +
      "OSI modelining 7 qatlami (pastdan yuqoriga):\n\n" +
      "1. Jismoniy qatlam (Physical): Bitlarni fizik signal sifatida uzatadi. Kabellar, hub, konnektorlar. Ma'lumot: bit.\n\n" +
      "2. Malumotlar zanjiri (Data Link): MAC manzil bilan ishlaydi. Ethernet, Wi-Fi. Qurilma: Switch. Malumot: freym.\n\n" +
      "3. Tarmoq qatlami (Network): IP manzillash va routing. IPv4, IPv6, OSPF, BGP. Qurilma: Router. Malumot: paket.\n\n" +
      "4. Transport qatlami (Transport): Segmentlash, TCP va UDP. Port raqamlari: HTTP=80, HTTPS=443, FTP=21.\n\n" +
      "5. Seans qatlami (Session): Aloqa seansini boshqaradi. NetBIOS, RPC. Misol: video qongiroq sessiyasi.\n\n" +
      "6. Taqdimot qatlami (Presentation): Formatlash, shifrlash (TLS/SSL), siqish. JPEG, MP4, ASCII.\n\n" +
      "7. Ilova qatlami (Application): Foydalanuvchi dasturlari. HTTP, HTTPS, FTP, SMTP, DNS, SSH.\n\n" +
      "Eslab qolish (pastdan yuqoriga): 'Please Do Not Throw Sausage Pizza Away' (P-D-N-T-S-P-A)",
  },
  {
    title: "TCP/IP protokol toplami va malumot uzatish jarayoni",
    duration: "18 daqiqa",
    type: "video",
    order: 2,
    xpReward: 20,
    videoUrl: "https://www.youtube.com/watch?v=PwQ1mwAYL44",
    resourceUrl: "https://ziyonet.uz/ru/material/view/local/23572",
    resourceName: "TCP/IP protokollari — oquv materiali",
    resourceType: "link",
    content:
      "TCP/IP — internetning asosiy protokollar toplami. 1970-yillarda DARPA tomonidan ishlab chiqilgan.\n\n" +
      "TCP/IP modeli 4 qatlamdan iborat:\n" +
      "4. Ilova: HTTP, FTP, DNS, SMTP\n" +
      "3. Transport: TCP, UDP\n" +
      "2. Internet: IP, ICMP, ARP\n" +
      "1. Tarmoq interfeysi: Ethernet, Wi-Fi\n\n" +
      "TCP (Transmission Control Protocol) — Ishonchli protokol:\n" +
      "Uch bosqichli qol siqish (Three-way handshake):\n" +
      "  Mijoz: SYN yuboradi\n" +
      "  Server: SYN-ACK javob beradi\n" +
      "  Mijoz: ACK tasdiq yuboradi\n" +
      "Har segment uchun tasdiqlash (ACK) kutiladi.\n" +
      "Yoqolgan segment qayta yuboriladi.\n" +
      "Ishlatiladi: web, email, fayl yuklab olish.\n\n" +
      "UDP (User Datagram Protocol) — Tez protokol:\n" +
      "Ulanish ortnatilmaydi. Tasdiqlash yoq. Juda tez, overhead minimal.\n" +
      "Ishlatiladi: video qongiroq, DNS, DHCP, online oyinlar, live streaming.\n\n" +
      "Mashhur port raqamlari:\n" +
      "21=FTP, 22=SSH, 25=SMTP, 53=DNS, 80=HTTP, 443=HTTPS, 3306=MySQL",
  },
  {
    title: "IP manzillash, subnetting va CIDR",
    duration: "20 daqiqa",
    type: "video",
    order: 3,
    xpReward: 25,
    videoUrl: "https://www.youtube.com/watch?v=ddM0AcreVqE",
    resourceUrl: "https://ziyonet.uz/ru/material/view/local/23570",
    resourceName: "IP manzillar va subnetting — amaliy qollanma",
    resourceType: "link",
    content:
      "IP manzil — tarmoqdagi har bir qurilmaning noyob identifikatori. Xuddi uy manzili kabi.\n\n" +
      "IPv4 formati: 192.168.10.100 — 4 ta oktet (0-255), nuqta bilan ajratilgan.\n" +
      "Jami: 4 294 967 296 (~4,3 milliard) manzil.\n\n" +
      "Subnet Mask (Tarmoq niqobi):\n" +
      "IP manzilning tarmoq qismi va qurilma qismini ajratadi.\n" +
      "Misol:\n" +
      "  IP manzil:   192.168.1.50\n" +
      "  Subnet Mask: 255.255.255.0\n" +
      "  Tarmoq:      192.168.1.0\n" +
      "  Qurilma:     .50\n" +
      "  Broadcast:   192.168.1.255\n\n" +
      "CIDR yozuvi:\n" +
      "  /24 = 256 manzil, 254 ta foydalanuvchi\n" +
      "  /25 = 128 manzil, 126 ta foydalanuvchi\n" +
      "  /30 = 4 manzil, 2 ta foydalanuvchi\n\n" +
      "Xususiy (Private) IP manzillar:\n" +
      "  10.0.0.0/8       — katta korporatsiyalar\n" +
      "  172.16.0.0/12    — ortacha tashkilotlar\n" +
      "  192.168.0.0/16   — uy va kichik ofislar\n\n" +
      "IPv6: 128 bit, cheksiz manzil. Format: 2001:0db8::8a2e:0370:7334",
  },
  {
    title: "Tarmoq qurilmalari: Hub, Switch, Router, Access Point",
    duration: "16 daqiqa",
    type: "video",
    order: 4,
    xpReward: 20,
    videoUrl: "https://www.youtube.com/watch?v=Vc3_vslJ48o",
    resourceUrl: null,
    resourceName: null,
    resourceType: null,
    content:
      "Tarmoq qurish uchun maxsus uskunalar ishlatiladi. Har bir qurilma OSI modelining ma'lum qatlamida ishlaydi.\n\n" +
      "HUB (1-qatlam): Barcha portlarga signal yuboradi. Bir vaqtda bitta qurilma gaplasha oladi. Hozir ishlatilmaydi.\n\n" +
      "SWITCH (2-qatlam) — ZAMONAVIY TANLOV:\n" +
      "MAC-manzil jadvalini saqlaydi. Faqat kerakli portga yuboradi.\n" +
      "Full-duplex: ko'p juft qurilmalar bir vaqtda muloqot qiladi.\n" +
      "Tezlik: 100 Mbps – 10 Gbps. Managed switch — VLAN, QoS.\n\n" +
      "ROUTER (3-qatlam):\n" +
      "IP manzil asosida yo'naltiradi. Routing jadvalini saqlaydi.\n" +
      "NAT: ko'p qurilmani bitta tashqi IP orqali ulaydi.\n" +
      "Uy routeri: modem + router + Wi-Fi AP kombinatsiyasi.\n\n" +
      "ACCESS POINT:\n" +
      "Simsiz qurilmalarni simli tarmoqqa ulaydi.\n" +
      "802.11 b/g/n/ac/ax (Wi-Fi 4/5/6). 2.4 GHz vs 5 GHz.\n\n" +
      "MODEM:\n" +
      "Raqamli signal analog signalga o'tkazadi.\n" +
      "Provayder tarmogi bilan uyni ulaydi. DSL, kabel, fiber-optik.\n\n" +
      "Uy tarmogidagi zanjir:\n" +
      "Internet → Modem → Router → Switch → Kompyuterlar/Wi-Fi qurilmalar",
  },
  {
    title: "DNS va DHCP xizmatlari: Tarmoq xizmatlari asoslari",
    duration: "16 daqiqa",
    type: "video",
    order: 5,
    xpReward: 20,
    videoUrl: "https://www.youtube.com/watch?v=2wg__cJWub8",
    resourceUrl: null,
    resourceName: null,
    resourceType: null,
    content:
      "Tarmoqdagi qurilmalar va foydalanuvchilarni boshqarish uchun maxsus xizmatlar ishlaydi.\n\n" +
      "DNS — Domain Name System:\n" +
      "Internetning telefon kitobi — domen nomini IP ga aylantiradi.\n\n" +
      "DNS soorovi bosqichlari:\n" +
      "  1. Brauzer mahalliy keshni tekshiradi\n" +
      "  2. OS resolver va router keshi\n" +
      "  3. ISP recursive resolver\n" +
      "  4. Root nameserver\n" +
      "  5. TLD nameserver (.com, .uz)\n" +
      "  6. Authoritative nameserver — javob!\n\n" +
      "DNS Record turlari:\n" +
      "  A     — domen : IPv4 manzil\n" +
      "  AAAA  — domen : IPv6 manzil\n" +
      "  CNAME — taxallus (www -> domen.com)\n" +
      "  MX    — email server\n" +
      "  TXT   — tekshiruv malumotlari\n\n" +
      "Mashhur DNS serverlar: 8.8.8.8 (Google), 1.1.1.1 (Cloudflare)\n\n" +
      "DHCP — Dynamic Host Configuration Protocol:\n" +
      "Qurilmalarga avtomatik tarmoq sozlamalarini beradi.\n\n" +
      "DORA jarayoni:\n" +
      "  D — Discover: Qurilma IP soraydi (broadcast)\n" +
      "  O — Offer:    Server bosh IP taklif qiladi\n" +
      "  R — Request:  Qurilma taklifni qabul qiladi\n" +
      "  A — Acknowledge: Server IP ni tasdiqlaydi\n\n" +
      "DHCP beruvchi malumotlar: IP, Subnet mask, Gateway, DNS server, Lease time",
  },
  {
    title: "Tarmoq xavfsizligi: Firewall, VPN va asosiy tahdidlar",
    duration: "18 daqiqa",
    type: "video",
    order: 6,
    xpReward: 25,
    videoUrl: "https://www.youtube.com/watch?v=9GZlVOafYTg",
    resourceUrl: "https://ziyonet.uz/ru/material/view/local/23575",
    resourceName: "Tarmoq xavfsizligi qollanmasi",
    resourceType: "link",
    content:
      "Tarmoq xavfsizligi — ruxsatsiz kirish, malumot ogrirlash va hujumlardan himoya qilish.\n\n" +
      "Asosiy tahdidlar:\n" +
      "  DoS/DDoS — Serverga kop sorov yuborib ishlamay qoldirish\n" +
      "  Man-in-the-Middle (MitM) — Hacker ikki tomon orasida turib trafikni ushlab oladi\n" +
      "  ARP Spoofing — Soxta ARP javoblar orqali trafikni yo'naltirish\n" +
      "  DNS Poisoning — DNS keshiga noto'g'ri malumot qo'shish\n" +
      "  Brute Force — Parolni kop urinib topish\n" +
      "  Phishing — Soxta sayt orqali ma'lumot ogrirlash\n\n" +
      "Firewall (Xavfsizlik devori):\n" +
      "Kiruvchi/chiquvchi trafikni qoidalar asosida filtrlaydi.\n" +
      "  Paket filtri: IP/port asosida (tez, yuzaki)\n" +
      "  Stateful: Aloqa holati jadvalini saqlaydi\n" +
      "  Next-Gen: DPI, IPS/IDS, application-level filtrlash\n\n" +
      "VPN — Virtual Private Network:\n" +
      "Internetda shifrlangan tunnel. ISP trafikni ko'rmaydi.\n" +
      "  Site-to-site: Ikkita ofis tarmoqini ulash\n" +
      "  Remote access: Uydan ofis tarmogiga ulanish\n" +
      "  Protokollar: OpenVPN, WireGuard, IPSec\n\n" +
      "IDS/IPS:\n" +
      "  IDS — hujumni aniqlaydi, xabar beradi\n" +
      "  IPS — hujumni aniqlaydi VA bloklaydi\n\n" +
      "Amaliy tavsiyalar:\n" +
      "  Wi-Fi: WPA3 shifrlash ishlatish\n" +
      "  Standart parollarni o'zgartirish\n" +
      "  Dasturlarni yangilab turish\n" +
      "  2FA yoqish\n" +
      "  VLAN bilan tarmoqni segmentlash",
  },
  {
    title: "Kompyuter tarmoqlari: yakuniy test",
    duration: "15 daqiqa",
    type: "quiz",
    order: 7,
    xpReward: 50,
    videoUrl: null,
    resourceUrl: null,
    resourceName: null,
    resourceType: null,
    content: JSON.stringify([
      {
        id: 1,
        q: "OSI modelida IP manzillash qaysi qatlamda amalga oshiriladi?",
        options: [
          "1-Jismoniy qatlam",
          "2-Malumotlar zanjiri",
          "3-Tarmoq qatlami",
          "4-Transport qatlami",
        ],
        correct: 2,
      },
      {
        id: 2,
        q: "TCP va UDP ning asosiy farqi nima?",
        options: [
          "TCP tezroq ishlaydi",
          "TCP ishonchli (tasdiqlash bor), UDP esa tez lekin ishonchsiz",
          "UDP faqat serverda ishlatiladi",
          "Ular bir xil protokol",
        ],
        correct: 1,
      },
      {
        id: 3,
        q: "CIDR /24 yozuvi nechta qurilmaga mo'ljallangan?",
        options: ["24 ta", "128 ta", "254 ta", "512 ta"],
        correct: 2,
      },
      {
        id: 4,
        q: "DHCP DORA jarayonida 'O' harfi nimani anglatadi?",
        options: [
          "Offline — uzilish",
          "Offer — server bo'sh IP taklif qiladi",
          "Order — buyurtma berish",
          "Output — chiqish signali",
        ],
        correct: 1,
      },
      {
        id: 5,
        q: "DNS ning asosiy vazifasi nima?",
        options: [
          "Qurilmaga IP manzil berish",
          "Domen nomini IP manzilga aylantirish",
          "Tarmoqni hujumlardan himoya qilish",
          "Internet tezligini oshirish",
        ],
        correct: 1,
      },
      {
        id: 6,
        q: "Switch OSI modelining qaysi qatlamida ishlaydi?",
        options: [
          "1-qatlam (Jismoniy)",
          "2-qatlam (MAC asosida)",
          "3-qatlam (IP asosida)",
          "4-qatlam (Port asosida)",
        ],
        correct: 1,
      },
      {
        id: 7,
        q: "VPN qanday texnologiyani ishlatadi?",
        options: [
          "Internetda shifrlangan tunnel yaratadi",
          "IP manzilni almashtiradi",
          "DNS serverini o'zgartiradi",
          "Port raqamlarini bloklaydi",
        ],
        correct: 0,
      },
      {
        id: 8,
        q: "DoS hujumi nima?",
        options: [
          "Qurilmaga virus yuborish",
          "Serverga haddan ziyod sorov yuborib ishlamay qoldirish",
          "Parolni brute-force usulida topish",
          "DNS keshini zaharlashtirish",
        ],
        correct: 1,
      },
      {
        id: 9,
        q: "IPv6 da manzilning uzunligi qancha?",
        options: ["32 bit", "64 bit", "128 bit", "256 bit"],
        correct: 2,
      },
      {
        id: 10,
        q: "Stateful firewall va stateless firewall ning farqi nima?",
        options: [
          "Narxi farq qiladi",
          "Stateful aloqa holati jadvalini saqlaydi, stateless faqat paket sarlavhasiga qaraydi",
          "Stateless tezroq va xavfsizroq",
          "Ular bir xil qurilma",
        ],
        correct: 1,
      },
    ]),
  },
];

async function main() {
  console.log("→ c-004 Kompyuter Tarmoqlari to'ldirilmoqda...\n");

  const course = await prisma.course.findUnique({
    where: { id: "c-004" },
    include: { _count: { select: { lessons: true } } },
  });

  if (!course) {
    console.error("❌ c-004 topilmadi!");
    return;
  }

  console.log(
    `  Kurs: "${course.title}" (${course._count.lessons} ta mavjud dars)`
  );

  // Eski darslarni tozalash
  await prisma.lesson.deleteMany({ where: { courseId: "c-004" } });
  console.log("  ✓ Eski darslar tozalandi\n  Yangi darslar qoshilmoqda:");

  for (const l of LESSONS) {
    await prisma.lesson.create({ data: { courseId: "c-004", ...l } });
    console.log(`    ✓ ${l.order}. ${l.title}`);
  }

  await prisma.course.update({
    where: { id: "c-004" },
    data: {
      description:
        "OSI modeli, TCP/IP, IP manzillash, tarmoq qurilmalari, DNS, DHCP va tarmoq xavfsizligi asoslarini o'zbek tilida o'rganing. Har bir mavzu bo'yicha batafsil tushuntirish va amaliy misollar.",
      duration: "20 soat",
      rating: 4.8,
      tags: ["OSI", "TCP/IP", "IP manzil", "Router", "Switch", "DNS", "DHCP", "Xavfsizlik"],
    },
  });

  const total = await prisma.lesson.count({ where: { courseId: "c-004" } });
  console.log(`\n✅ c-004 muvaffaqiyatli to'ldirildi! Jami: ${total} ta dars`);
}

main()
  .catch((e) => {
    console.error("❌ Xatolik:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
