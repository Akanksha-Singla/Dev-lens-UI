import { Code2, Menu, Moon, Sun } from "lucide-react";

interface Props {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onMenu: () => void;
}

function Navbar({ theme, onToggleTheme, onMenu }: Props) {
  return (
    <header className="topbar">
      <div className="brand-lockup">
        <button className="icon-button mobile-menu" aria-label="Open navigation" onClick={onMenu}>
          <Menu size={19} />
        </button>
        <span className="brand-mark"><Code2 size={19} strokeWidth={2.4} /></span>
        <span className="brand-name">devlens<span className="brand-period">.</span></span>
        <span className="brand-divider" />
        <span className="brand-caption">CODE INTELLIGENCE</span>
      </div>
      <div className="topbar-actions">
        <span className="workspace-label"><span className="live-dot" /> Workspace</span>
        <button className="icon-button" aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`} title={`Switch to ${theme === "light" ? "dark" : "light"} mode`} onClick={onToggleTheme}>
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <span className="avatar" aria-label="Demo workspace user">N</span>
      </div>
    </header>
  );
}

export default Navbar;