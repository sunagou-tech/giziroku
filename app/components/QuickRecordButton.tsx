"use client";

import { useEffect, useRef, useState } from "react";

function formatSeconds(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function QuickRecordButton({ meetingTitle }: { meetingTitle: string }) {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
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

    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMessage("このブラウザでは録音できません。");
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
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };

      recorder.start();
      setIsRecording(true);
    } catch {
      setErrorMessage("マイクが許可されていません。ブラウザの権限を許可してからもう一度押してください。");
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
    <div className="quick-record">
      <div className="quick-record-head">
        <span className={`record-dot ${isRecording ? "active" : ""}`} aria-hidden="true" />
        <span>{isRecording ? "録音中" : audioUrl ? "録音完了" : "録音できます"}</span>
        <time>{formatSeconds(elapsedSeconds)}</time>
      </div>
      <div className="quick-record-main">
        <span className="quick-record-label">{meetingTitle}</span>
        {!isRecording ? (
          <button type="button" className="quick-record-button" onClick={startRecording}>
            この会議を録音
          </button>
        ) : (
          <button type="button" className="quick-stop-button" onClick={stopRecording}>
            録音を停止
          </button>
        )}
      </div>

      {errorMessage && <p className="quick-record-error">{errorMessage}</p>}

      {audioUrl && (
        <audio className="quick-audio" controls src={audioUrl} aria-label={`${meetingTitle}の録音`} />
      )}
    </div>
  );
}
