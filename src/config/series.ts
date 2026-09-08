import type { Locale } from '@/i18n/config';

export interface SeriesInfo {
  /** 로케일별 시리즈명. 글 frontmatter의 `series` 값과 글자 단위로 같아야 한다. */
  name: string;
  /** 시리즈 목차 위에 매번 붙는 설명. 글마다 컨셉을 다시 설명하지 않기 위한 자리. */
  description: string;
}

/**
 * 시리즈 메타데이터 레지스트리.
 *
 * 키는 로케일과 무관한 시리즈 id다. 시리즈명 자체는 번역되기 때문에
 * (`세션 로그` / `Session Log`) 이름으로 묶으면 로케일마다 따로 관리해야 한다.
 * 여기 등록하지 않은 시리즈는 그냥 설명 없이 목차만 나온다.
 */
export const SERIES: Record<string, Record<Locale, SeriesInfo>> = {
  'session-log': {
    ko: {
      name: '세션 로그',
      description:
        '내가 AI와 나눈 대화를, 그 AI가 자기 시점에서 다시 쓴 기록. 화자는 AI고 나는 관찰 대상이다. 그래서 이 시리즈만 블로그의 다른 글과 톤이 다르다 — 내 문체도, 내 결론도 아니다. 내가 하는 건 주제를 던지고 끝까지 물고 늘어지는 것뿐이고, 정리는 상대가 한다. 편집은 읽히게 만드는 선에서만.',
    },
    en: {
      name: 'Session Log',
      description:
        "Conversations I had with an AI, rewritten by that AI from its own point of view. The narrator is the machine; I'm the specimen. That's why this series doesn't sound like the rest of the blog — it isn't my voice and they aren't my conclusions. All I do is throw a topic in and keep pulling on it; the other side writes it up. Editing goes only as far as readability.",
    },
  },
};

/** 해당 로케일에서 이 시리즈명에 붙는 설명 (없으면 undefined) */
export function getSeriesDescription(name: string, locale: Locale): string | undefined {
  return Object.values(SERIES).find((entry) => entry[locale]?.name === name)?.[locale]?.description;
}
