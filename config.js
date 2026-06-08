/**
 * ============================================
 *  모바일 청첩장 설정 파일
 *  이 파일만 수정하면 청첩장이 완성됩니다.
 *
 *  이미지는 설정이 필요 없습니다.
 *  아래 폴더에 1.jpg, 2.jpg, ... 순서로 넣어주세요:
 *    images/hero/1.jpg       — 메인 사진 (1장)
 *    images/story/1.jpg ...  — 스토리 사진 (자동 감지)
 *    images/gallery/1.jpg ...— 갤러리 사진 (자동 감지)
 *    images/location/1.jpg   — 오시는 길 사진 (1장)
 *    images/og/1.jpg         — OG 공유 썸네일 (1장)
 * ============================================
 */

const CONFIG = {
  // ── 초대장 열기 ──
  useCurtain: true,  // 초대장 열기 화면 사용 여부 (true: 사용, false: 바로 본문 표시)

  // ── 메인 (히어로) ──
  groom: {
    name: "종선",
    lastName: "정",
    fullName: "정종선",
    father: "정윤희",
    mother: "김진숙",
    fatherDeceased: false, // 故인이면 true
    motherDeceased: false,
  },

  bride: {
    name: "선미",
    lastName: "이",
    fullName: "이선미",
    father: "이재천",
    mother: "김영임",
    fatherDeceased: false,
    motherDeceased: false,
  },

  wedding: {
    date: "2026-10-03",        // YYYY-MM-DD
    time: "11:00",             // HH:MM (24시간)
    dayOfWeek: "토요일",
    venue: "포스코센터",
    hall: "포스코아트홀 4층",
    address: "서울특별시 강남구 테헤란로 440",
    mapLinks: {
      kakao: "https://place.map.kakao.com/8617090",
      naver: "https://naver.me/F6lvYqFB",
    },
  },

  // ── 인사말 ──
  greeting: {
    title: "Invitation",
    content:
      "서로 다른 길을 걷던 두 사람이\n하나의 길을 함께 걷게 되었습니다.\n\n저희의 새로운 시작에\n함께해 주시면 감사하겠습니다.",
  },

  // ── 우리의 이야기 ──
  story: {
    title: "Our Story",
    content:
      "많은 대화 속에서 서로를 이해하고\n기쁜 순간에는 함께 웃고\n어려운 순간에는 서로를 응원하며\n자연스럽게 서로의 일상이 되었습니다.",
  },

  // ── 오시는 길 ──
  // (mapLinks는 wedding 객체 내에 포함)

  // ── 마음 전하실 곳 ──
  accounts: {
    groom: [
      { role: "신랑", name: "정종선", bank: "농협은행", number: "127-12-380323" },
      { role: "아버지", name: "정윤희", bank: "국민은행", number: "123-45-6789012" },
      { role: "어머니", name: "김진숙", bank: "우리은행", number: "1002-345-678901" },
    ],
    bride: [
      { role: "신부", name: "이선미", bank: "하나은행", number: "620-198811-652" },
      { role: "아버지", name: "이재천", bank: "농협", number: "301-0123-4567-01" },
      { role: "어머니", name: "김영임", bank: "기업은행", number: "012-345678-01-012" },
    ],
  },

  // ── 링크 공유 시 나타나는 문구 ──
  kakaoShare: {
    // Kakao Developers 앱키 (JavaScript 키)
    appKey: "",
    title: "정종선 ♥ 이선미 결혼합니다",
    description: "2026년 10월 3일 토요일 오전 11시\n포스코센터 아트홀 4층",
  },

  meta: {
    title: "정종선 ♥ 이선미 결혼합니다",
    description: "2026년 10월 3일 토요일 오전 11시, 포스코센터 아트홀 4층",
  },
};
