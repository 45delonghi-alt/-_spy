#!/usr/bin/env bash
# 効果音・仮BGMを ffmpeg の信号合成のみで生成する（外部素材なし＝権利フリー）。
# 正式BGMが支給されたら public/assets/bgm/bgm.wav を差し替える。
set -euo pipefail
cd "$(dirname "$0")/.."
S=public/assets/sfx
B=public/assets/bgm
mkdir -p "$S" "$B"
F="ffmpeg -y -loglevel error"

# HUDビープ（2連）
$F -f lavfi -i "sine=f=1320:d=0.07" -f lavfi -i "anullsrc=r=48000:cl=mono:d=0.06" -f lavfi -i "sine=f=1760:d=0.07" \
  -filter_complex "[0][1][2]concat=n=3:v=0:a=1,afade=t=out:st=0.17:d=0.03,volume=0.35" -ar 48000 -ac 1 "$S/beep.wav"

# スキャン（帯域を掃引するノイズ）
$F -f lavfi -i "anoisesrc=d=0.9:c=pink:a=0.6" \
  -af "highpass=f=600,lowpass=f=5000,afade=t=in:d=0.25,afade=t=out:st=0.5:d=0.4,volume=0.35" -ar 48000 -ac 1 "$S/scan.wav"

# ロック解除（クリック＋上昇トーン）
$F -f lavfi -i "sine=f=660:d=0.06" -f lavfi -i "sine=f=990:d=0.18" \
  -filter_complex "[0][1]concat=n=2:v=0:a=1,afade=t=out:st=0.16:d=0.08,volume=0.35" -ar 48000 -ac 1 "$S/unlock.wav"

# 証拠カード取得（短いチャイム）
$F -f lavfi -i "sine=f=1046:d=0.35" -f lavfi -i "sine=f=1568:d=0.35" \
  -filter_complex "[0][1]amix=inputs=2,afade=t=out:st=0.05:d=0.3,volume=0.4" -ar 48000 -ac 1 "$S/evidence.wav"

# ミッション完了（上昇和音）
$F -f lavfi -i "sine=f=523:d=1.6" -f lavfi -i "sine=f=659:d=1.6" -f lavfi -i "sine=f=784:d=1.6" -f lavfi -i "sine=f=1046:d=1.6" \
  -filter_complex "[1]adelay=120[b];[2]adelay=240[c];[3]adelay=360[d];[0][b][c][d]amix=inputs=4,afade=t=in:d=0.05,afade=t=out:st=0.6:d=1.2,volume=0.6" \
  -ar 48000 -ac 1 "$S/cleared.wav"

# 仮BGM：低音パッド（A minor）＋ゆっくりしたトレモロ＋控えめなパルス、64秒ループ
$F -f lavfi -i "sine=f=55:d=64" -f lavfi -i "sine=f=110:d=64" -f lavfi -i "sine=f=164.81:d=64" -f lavfi -i "sine=f=220:d=64" \
  -f lavfi -i "aevalsrc='0.25*sin(2*PI*880*t)*exp(-40*mod(t,0.6))':d=64:s=48000" \
  -filter_complex "[0]volume=0.5[a];[1]volume=0.35[b];[2]volume=0.18,tremolo=f=0.25:d=0.6[c];[3]volume=0.12,tremolo=f=0.17:d=0.7[d];[4]lowpass=f=1500,volume=0.08[e];[a][b][c][d][e]amix=inputs=5:normalize=0,lowpass=f=2500,afade=t=in:d=2,afade=t=out:st=62:d=2,volume=0.9" \
  -ar 48000 -ac 2 "$B/bgm.wav"

ls -la "$S" "$B"
