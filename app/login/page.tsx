import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="login-page">
      <section className="login-panel" aria-label="ログイン">
        <div className="login-brand">
          <span className="brand-mark">M</span>
          <div>
            <strong>Meeting Hub</strong>
            <small>社内会議管理</small>
          </div>
        </div>
        <div>
          <p className="eyebrow">Sign in</p>
          <h1>会議の記録を、次の行動につなげる。</h1>
          <p className="login-copy">
            録音、文字起こし、要約、決定事項、アクションを会議単位で整理するマイページです。
          </p>
        </div>
        <form className="form-card">
          <label>
            メールアドレス
            <input type="email" defaultValue="demo@example.com" />
          </label>
          <label>
            パスワード
            <input type="password" defaultValue="password" />
          </label>
          <Link className="primary-button wide" href="/">ログイン</Link>
        </form>
      </section>
    </main>
  );
}
