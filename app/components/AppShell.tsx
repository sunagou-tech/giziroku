import Link from "next/link";
import { ReactNode } from "react";

const navItems = [
  { href: "/", label: "ホーム", icon: "□" },
  { href: "/meetings", label: "会議一覧", icon: "≡" },
  { href: "/meetings/new", label: "新規登録", icon: "+" },
  { href: "/tasks", label: "タスク", icon: "✓" },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" href="/">
          <span className="brand-mark">M</span>
          <span>
            <strong>Meeting Hub</strong>
            <small>社内会議管理</small>
          </span>
        </Link>
        <nav className="nav-list" aria-label="主要ナビゲーション">
          {navItems.map((item) => (
            <Link href={item.href} key={item.href} className="nav-link">
              <span className="nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-note">
          <span>本日の録音予定</span>
          <strong>3件</strong>
        </div>
      </aside>
      <main className="main-area">{children}</main>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div>
        <p className="eyebrow">Meeting Management</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </header>
  );
}
