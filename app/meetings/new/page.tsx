import Link from "next/link";
import { AppShell, PageHeader } from "@/app/components/AppShell";
import { RecorderPanel } from "@/app/components/RecorderPanel";

export default function NewMeetingPage() {
  return (
    <AppShell>
      <PageHeader
        title="新規会議登録"
        description="会議の目的と参加者を先に登録しておくと、終了後の整理がしやすくなります。"
      />
      <form className="entry-form">
        <section className="panel form-section">
          <h2>基本情報</h2>
          <div className="form-grid">
            <label>
              会議タイトル
              <input placeholder="例: プロダクト定例" />
            </label>
            <label>
              日時
              <input type="datetime-local" />
            </label>
            <label>
              参加者
              <input placeholder="田中、佐藤、鈴木" />
            </label>
            <label>
              担当部門
              <select>
                <option>プロダクト</option>
                <option>営業</option>
                <option>人事</option>
                <option>経営</option>
              </select>
            </label>
          </div>
          <label>
            会議の目的
            <textarea placeholder="この会議で決めたいこと、確認したいこと" rows={4} />
          </label>
        </section>

        <section className="panel form-section">
          <h2>録音・文字起こし</h2>
          <RecorderPanel />
        </section>

        <div className="form-actions">
          <Link className="secondary-button" href="/meetings">キャンセル</Link>
          <Link className="primary-button" href="/meetings/weekly-product-sync">仮登録する</Link>
        </div>
      </form>
    </AppShell>
  );
}
