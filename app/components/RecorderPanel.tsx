"use client";

import { useEffect, useRef, useState } from "react";

function formatSeconds(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function RecorderPanel() {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    if (!isRecording) {
      return;
    }

    const timerId = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [isRecording]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  async function startRecording() {
    setErrorMessage("");
    setTranscript("");

    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMessage("このブラウザでは録音機能を利用できません。");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      chunksRef.current = [];
      streamRef.current = stream;
      mediaRecorderRef.current = recorder;
      setElapsedSeconds(0);
      setAudioUrl((currentUrl) => {
        if (currentUrl) {
          URL.revokeObjectURL(currentUrl);
        }
        return null;
      });

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        const nextAudioUrl = URL.createObjectURL(blob);
        setAudioUrl(nextAudioUrl);
        setTranscript(
          "録音が完了しました。実運用ではここに自動文字起こし結果が入ります。発言内容をもとに、要約・決定事項・次のアクションへ整理する想定です。"
        );
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };

      recorder.start();
      setIsRecording(true);
    } catch {
      setErrorMessage("マイクの使用が許可されませんでした。ブラウザの権限設定を確認してください。");
    }
  }

  function stopRecording() {
    const recorder = mediaRecorderRef.current;

    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }

    setIsRecording(false);
  }

  return (
    <div className="recorder-panel">
      <div className="recorder-status">
        <span className={`record-dot ${isRecording ? "active" : ""}`} aria-hidden="true" />
        <div>
          <strong>{isRecording ? "録音中" : audioUrl ? "録音完了" : "録音待機中"}</strong>
          <span>{isRecording ? "会議音声をブラウザ内で録音しています" : "開始するとマイク許可が表示されます"}</span>
        </div>
        <time>{formatSeconds(elapsedSeconds)}</time>
      </div>

      <div className="recorder-actions">
        {!isRecording ? (
          <button className="record-button" type="button" onClick={startRecording}>
            録音開始
          </button>
        ) : (
          <button className="stop-button" type="button" onClick={stopRecording}>
            録音停止
          </button>
        )}
      </div>

      {errorMessage && <p className="recorder-error">{errorMessage}</p>}

      {audioUrl && (
        <div className="audio-preview">
          <span>録音プレビュー</span>
          <audio controls src={audioUrl} />
        </div>
      )}

      <label>
        文字起こしメモ
        <textarea
          value={transcript}
          onChange={(event) => setTranscript(event.target.value)}
          placeholder="録音後に自動文字起こしが入る想定です"
          rows={6}
        />
      </label>
    </div>
  );
}
