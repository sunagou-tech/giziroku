export type TaskStatus = "未着手" | "進行中" | "確認待ち";

export type ActionItem = {
  id: string;
  title: string;
  owner: string;
  dueDate: string;
  status: TaskStatus;
  meetingId: string;
};

export type Meeting = {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  participants: string[];
  purpose: string;
  transcript: string;
  summary: string;
  decisions: string[];
  openIssues: string[];
  actions: ActionItem[];
  tags: string[];
  calendarEventUrl?: string;
  calendarStatus: "連携済み" | "未連携";
};

export const meetings: Meeting[] = [
  {
    id: "weekly-product-sync",
    title: "プロダクト定例",
    date: "2026-05-21",
    time: "10:00",
    duration: "45分",
    participants: ["田中", "佐藤", "鈴木", "高橋"],
    purpose: "今週の開発進捗、リリース判断、未解決課題を揃える。",
    transcript:
      "田中: 今日はリリース候補の確認から始めます。佐藤: 主要な修正は完了していますが、通知設定の表示だけ確認が必要です。鈴木: ヘルプページの文言は本日中に出せます。高橋: 営業チームから、導入企業向けの説明資料も更新してほしいと依頼が来ています。",
    summary:
      "リリース候補は概ね準備完了。通知設定画面の表示確認とヘルプ文言の更新を終えたうえで、明日の午前に最終判断する。",
    decisions: [
      "通知設定の軽微な表示確認をリリース前の必須項目にする。",
      "ヘルプページの文言更新は今回リリースに含める。",
    ],
    openIssues: [
      "営業資料の更新範囲は次回の営業定例で確定する。",
      "一部顧客への告知タイミングはサポートチームと再確認する。",
    ],
    actions: [
      {
        id: "task-1",
        title: "通知設定画面の表示確認",
        owner: "佐藤",
        dueDate: "2026-05-21",
        status: "進行中",
        meetingId: "weekly-product-sync",
      },
      {
        id: "task-2",
        title: "ヘルプページの文言更新",
        owner: "鈴木",
        dueDate: "2026-05-21",
        status: "未着手",
        meetingId: "weekly-product-sync",
      },
    ],
    tags: ["リリース", "開発"],
    calendarStatus: "連携済み",
    calendarEventUrl: "https://calendar.google.com/calendar",
  },
  {
    id: "sales-customer-review",
    title: "大口顧客レビュー",
    date: "2026-05-20",
    time: "15:00",
    duration: "60分",
    participants: ["山本", "中村", "伊藤"],
    purpose: "主要顧客の利用状況を確認し、解約リスクと追加提案を整理する。",
    transcript:
      "山本: A社は利用頻度が下がっています。中村: 管理者変更後にオンボーディングが止まっているようです。伊藤: 次回訪問で新しい担当者向けに活用会を提案しましょう。",
    summary:
      "A社は管理者交代により活用が停滞。新担当者への再オンボーディングを提案し、利用データをもとに改善余地を説明する。",
    decisions: [
      "A社には再オンボーディングを提案する。",
      "次回訪問前に利用レポートを1枚にまとめる。",
    ],
    openIssues: ["追加提案の価格レンジはマネージャー確認後に決める。"],
    actions: [
      {
        id: "task-3",
        title: "A社向け利用レポート作成",
        owner: "中村",
        dueDate: "2026-05-24",
        status: "確認待ち",
        meetingId: "sales-customer-review",
      },
      {
        id: "task-4",
        title: "次回訪問の日程候補を送付",
        owner: "山本",
        dueDate: "2026-05-22",
        status: "未着手",
        meetingId: "sales-customer-review",
      },
    ],
    tags: ["顧客", "営業"],
    calendarStatus: "連携済み",
    calendarEventUrl: "https://calendar.google.com/calendar",
  },
  {
    id: "recruiting-planning",
    title: "採用計画ミーティング",
    date: "2026-05-19",
    time: "13:30",
    duration: "50分",
    participants: ["小林", "加藤", "森"],
    purpose: "下期採用計画の優先職種と面接体制を決める。",
    transcript:
      "小林: エンジニア採用は継続して優先度が高いです。加藤: 面接官の負荷が上がっているので、一次面接の質問セットを整えたいです。森: 候補者体験を落とさないため、結果連絡の期限も明確にしましょう。",
    summary:
      "エンジニア採用を最優先にしつつ、面接官の負荷を下げるため質問セットと評価基準を整備する。",
    decisions: [
      "下期の最優先職種はフロントエンドエンジニアにする。",
      "一次面接の標準質問セットを作成する。",
    ],
    openIssues: [
      "採用広報記事のテーマは候補を出してから決定する。",
      "面接官トレーニングの日程は部門長と調整する。",
    ],
    actions: [
      {
        id: "task-5",
        title: "一次面接の質問セット草案作成",
        owner: "加藤",
        dueDate: "2026-05-27",
        status: "進行中",
        meetingId: "recruiting-planning",
      },
    ],
    tags: ["採用", "人事"],
    calendarStatus: "未連携",
  },
];

export const allTasks = meetings.flatMap((meeting) => meeting.actions);

export function getMeeting(id: string) {
  return meetings.find((meeting) => meeting.id === id);
}

export function getMeetingTitle(id: string) {
  return getMeeting(id)?.title ?? "未登録の会議";
}
