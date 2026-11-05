import { MedicineItem } from '../types';

export const MOCK_MEDICINES: MedicineItem[] = [
  {
    id: 'med-1',
    name: '타이레놀정 500mg',
    genericName: '아세트아미노펜 (Acetaminophen)',
    manufacturer: '한국존슨앤드존슨',
    category: '해열·진통·소염제',
    shape: '장방형',
    color: '하얀색',
    pillMark: 'TYLENOL 500',
    efficacy: '두통, 신경통, 근육통, 월경통, 염좌통, 치통, 관절통 해열 및 진통 완화',
    dosageInfo: '만 12세 이상 소아 및 성인: 1회 1~2정씩 1일 3-4회 (4-6시간 간격). 하루 최대 8정(4,000mg) 초과 금지.',
    warnings: [
      '일일 최대 허용 용량(4,000mg)을 초과할 경우 심각한 간 손상이 유발될 수 있습니다.',
      '매일 세 잔 이상 정기적으로 술을 마시는 사람은 복용 전 의사·약사와 상의하세요.',
      '다른 해열진통제(종합감기약 등)와 중복 복용하지 않도록 확인하세요.'
    ],
    foodPrecautions: [
      '음주 절대 금지 (간독성 위험 급증)',
      '카페인 과다 음료와 병용 시 가슴 두근거림이나 불면이 생길 수 있습니다.'
    ],
    storage: '밀폐용기, 실온(1~30℃) 보관'
  },
  {
    id: 'med-2',
    name: '노바스크정 5mg',
    genericName: '암로디핀베실산염 (Amlodipine Besylate)',
    manufacturer: '한국비아트리스',
    category: '혈압강하제',
    shape: '원형',
    color: '하얀색',
    pillMark: 'Pfizer / AML 5',
    efficacy: '고혈압, 관상동맥의 고정폐쇄 또는 혈관경련에 의한 심근성 허혈증(안정형 협심증)',
    dosageInfo: '성인 1일 1회 5mg을 경구투여합니다. 환자의 반응에 따라 1일 최대 10mg까지 증량 가능합니다.',
    warnings: [
      '매일 일정한 시간(주로 아침)에 복용하는 것이 혈압 조절에 효과적입니다.',
      '임의로 복용을 중단하면 혈압이 갑자기 상승할 수 있으므로 꾸준히 복용하세요.',
      '복용 초기 어지러움이나 발목 부종(붓기)이 나타날 수 있습니다.'
    ],
    foodPrecautions: [
      '자몽 및 자몽주스 섭취 금지 (약효가 과도하게 증가하여 저혈압 유발 가능)',
      '과도한 염분 섭취를 피하세요.'
    ],
    storage: '차광기밀용기, 실온(1~30℃) 보관'
  },
  {
    id: 'med-3',
    name: '다이아벡스정 500mg',
    genericName: '메트포르민염산염 (Metformin HCl)',
    manufacturer: '한독',
    category: '당뇨병용제',
    shape: '원형',
    color: '하얀색',
    pillMark: 'DW / 500',
    efficacy: '식이요법 및 운동요법으로 혈당 조절이 불충분한 제2형 당뇨병 환자의 치료',
    dosageInfo: '식사와 함께 또는 식후 즉시 복용합니다. (위장 장애 감소 목적) 보통 1일 2~3회 분할 복용.',
    warnings: [
      '위장장애(속 쓰림, 설사, 메스꺼움)를 줄이기 위해 반드시 식사 중 또는 식후 즉시 드세요.',
      '조영제를 사용하는 CT나 MRI 검사 전후에는 의사와 상의하여 복용을 일시 중단해야 합니다.'
    ],
    foodPrecautions: [
      '과도한 음주는 젖산산증(치명적인 부작용) 위험을 높이므로 금주하세요.',
      '식사를 거르면 저혈당이 올 수 있으니 규칙적인 식사가 필수입니다.'
    ],
    storage: '기밀용기, 실온(1~30℃) 보관'
  },
  {
    id: 'med-4',
    name: '가스모틴정 5mg',
    genericName: '모사프리드시트르산염 (Mosapride Citrate)',
    manufacturer: '대웅제약',
    category: '위장관운동조절제',
    shape: '타원형',
    color: '하얀색',
    pillMark: 'G5 / 분할선',
    efficacy: '기능성소화불량으로 인한 소화기증상(속쓰림, 오심, 구토) 완화',
    dosageInfo: '성인 1일 15mg을 3회로 나누어 식전 또는 식후에 경구투여합니다.',
    warnings: [
      '일정 기간(보통 2주) 투여하여도 소화기 증상의 개선이 보이지 않을 경우 투여를 중지하세요.',
      '드물게 설사, 묽은 변, 구갈, 나른함이 발생할 수 있습니다.'
    ],
    foodPrecautions: [
      '자극적인 음식(맵고 짠 음식)과 탄산음료를 자제하세요.'
    ],
    storage: '기밀용기, 실온(1~30℃) 보관'
  },
  {
    id: 'med-5',
    name: '탁센연질캡슐',
    genericName: '나프록센 (Naproxen)',
    manufacturer: 'GC녹십자',
    category: '비스테로이드성 소염진통제(NSAIDs)',
    shape: '캡슐',
    color: '파란색',
    pillMark: 'TAK-SEN',
    efficacy: '류마티양 관절염, 골관절염, 강직성 척추염, 편두통, 발치 후 동통, 통풍 등 진통 완화',
    dosageInfo: '성인 1회 1~2캡슐 복용 후 6~8시간 간격으로 복용. 식사 직후 충분한 물과 함께 복용.',
    warnings: [
      '공복에 복용 시 위장 출혈이나 속쓰림이 발생할 수 있으므로 반드시 식후에 복용하세요.',
      '심혈관계 질환 환자는 복용 전 의사 상담이 필요합니다.'
    ],
    foodPrecautions: [
      '위 자극을 피하기 위해 우유나 식사 직후 복용 권장',
      '알코올과 함께 섭취 시 위장관 출혈 위험 급증'
    ],
    storage: '차광기밀용기, 실온(1~30℃) 보관'
  },
  {
    id: 'med-6',
    name: '리피토정 20mg',
    genericName: '아토르바스타틴칼슘 (Atorvastatin Calcium)',
    manufacturer: '한국화이자제약',
    category: '고지혈증 치료제 (스타틴계)',
    shape: '타원형',
    color: '하얀색',
    pillMark: '20 / ATV',
    efficacy: '고콜레스테롤혈증 치료, 관상동맥질환 고위험 환자의 심근경색 및 뇌졸중 위험 감소',
    dosageInfo: '1일 1회 하루 중 아무 때나 복용할 수 있으나 매일 일정한 시간에 복용하세요.',
    warnings: [
      '원인 불명의 근육통, 근육 압통, 근육 쇠약감이 나타나면 즉시 의사에게 알리세요.',
      '임산부 또는 임신 가능성이 있는 여성은 복용해서는 안 됩니다.'
    ],
    foodPrecautions: [
      '자몽 주스 다량 섭취 시 혈중 약물 농도가 높아져 근육 부작용 위험 증가'
    ],
    storage: '기밀용기, 실온(1~30℃) 보관'
  },
  {
    id: 'med-7',
    name: '코대원포르테시럽',
    genericName: '디히드로코데인복합시럽',
    manufacturer: '대원제약',
    category: '진해거담제',
    shape: '기타',
    color: '갈색',
    pillMark: '스틱포',
    efficacy: '기침, 가래 완화',
    dosageInfo: '성인 및 15세 이상: 1회 1포(20ml)를 1일 3~4회 식후 및 취침 전에 복용.',
    warnings: [
      '복용 후 졸음이 올 수 있으므로 운전이나 위험한 기계 조작을 피하세요.',
      '천식 환자는 복용 전 반드시 의사와 상담하세요.'
    ],
    foodPrecautions: [
      '카페인 음료와 병용 시 중추신경 흥분 가능성 주의'
    ],
    storage: '기밀용기, 실온(1~30℃) 보관'
  }
];
