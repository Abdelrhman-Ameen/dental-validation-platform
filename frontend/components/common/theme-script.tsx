export function ThemeScript() {
  const script = `
    try {
      var storedTheme = localStorage.getItem("theme");
      var useDark = storedTheme ? storedTheme === "dark" : true;
      document.documentElement.classList.toggle("dark", useDark);
    } catch (_) {
      document.documentElement.classList.add("dark");
    }
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
