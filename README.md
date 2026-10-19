# 1日仕事体験 オリエンテーション動画【スパイ・ミッション演出版】

大学生が「エージェント」として6つのミッションを進めながら、センサ・FA・センサ営業の価値を理解する約6分の参加型オリエンテーション動画です。
原稿 `1日仕事体験_オリエンテーション.pptx`（全12枚）を一次資料に、制作指示書（スパイ・ミッション演出版）に沿って React / Remotion で制作しました。

## 成果物

| 種別 | 場所 |
|---|---|
| 最終動画（1920×1080 / 30fps / H.264 + AAC / 6:00） | `output_final/orientation_spy_mission_1080p.mp4` |
| 音声なし版（映像・字幕のみ／BGM・効果音・ナレーションなし） | `output_final/orientation_spy_mission_1080p_silent.mp4` |
| 字幕（SRT・外部字幕として利用可） | `docs/captions.srt` |
| 絵コンテ（16シーン） | `docs/storyboard.csv` |
| ナレーション台本・音声長 | `docs/narration.csv` |
| 原稿P1〜P12との対応・差異表 | `docs/sourceMapping.csv` |
| 進行者用 停止タイムコード | `docs/facilitator_timecodes.csv` |
| 代表フレーム（全16シーン＋停止カード等） | `docs/frames/` |
| 素材・権利一覧 | `docs/assetChecklist.md` |
| 品質レビュー結果 | `docs/reviewChecklist.md` |
| 未確定事項 | `docs/OPEN_QUESTIONS.md` |
| Remotionプロジェクト | `projects/orientation/` |

## 6章構成

| CH | ミッション | 情報テーマ | 原稿 | 時刻 |
|---|---|---|---|---|
| 01 | エージェント登録 | 参加経験・営業へのイメージ | P1–3 | 0:00–0:55 |
| 02 | 潜入調査開始 | 日常のセンサ・FA | P4–5 | 0:55–1:55 |
| 03 | 極秘ファイルを解読 | センサ営業をすすめる3つの理由 | P6–9 | 1:55–4:05 |
| 04 | エージェント能力分析 | 3つの能力の掛け算 | P10 | 4:05–4:45 |
| 05 | 機密情報の核心に迫る | 営業の再定義 | P11 | 4:45–5:25 |
| 06 | 最終ミッション発令 | 今日の目的・実践へ移行 | P12 | 5:25–6:00 |

停止ポイント（PAUSE POINT）は2か所：Q01（0:20頃）、Q02（5:14頃）。MP4は自動停止しないため、進行者が `docs/facilitator_timecodes.csv` のタイミングで一時停止します。

## 修正・再生成の方法

すべての台本・字幕・時刻・停止ポイントは `projects/orientation/src/data/timeline.json` に一元化しています。

```bash
cd projects/orientation
npm install
npm run narration     # timeline.json からナレーション音声を生成（要 open_jtalk）→ narrationManifest.json 更新
npm run sfx           # 効果音・仮BGMを生成（要 ffmpeg）
npm run docs          # storyboard / narration / facilitator CSV と captions.srt を再生成
npm run dev           # Remotion Studio でプレビュー
npm run stills        # 代表フレームを書き出し
npm run render        # 最終MP4を output_final/ に書き出し
npm run render:silent # 音声なし版MP4を output_final/ に書き出し
```

- **ナレーションをプロのナレーター音声等に差し替える**：`public/assets/audio/scXX.wav` を置き換え → `node scripts/generate-narration.mjs --manifest-only` → `npm run docs`（字幕タイミングは文字数比で再計算）
- **BGMを差し替える**：`public/assets/bgm/bgm.wav` を置き換え（音量は Root.tsx の `bgmVolume`）
- **ロゴ・正式配色**：`src/theme.ts` と SC01 / SC16
- Chromium は `/opt/pw-browsers/...headless_shell` を使用（`REMOTION_BROWSER` で変更可）

## 主要コンポーネント（再利用可能）

`SpyHUD`（上部HUD・6ステップ進捗、シークに追従）／`MissionIntro`（章扉）／`EvidenceCard`／`FileUnlock`／`AgentDecisionPause`／`MissionComplete`／`Captions`（文単位で音声同期）

## 演出上の注意

ミッション・機密・潜入・解除などはすべて演出上の比喩であり、動画冒頭にその旨を表示しています。実在の機密情報、未確認の数値（P4のシェア値）、顧客名、製品性能値、「AIで絶対に代替できない」といった断定は表示していません。
