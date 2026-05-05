export function slugify(input: string, maxLen = 60): string {
  let s = input.normalize("NFKC").trim();
  s = s.replace(/[\u{1F300}-\u{1FAFF}\u{1F000}-\u{1F2FF}\u{2600}-\u{27BF}]/gu, " ");
  s = s.replace(/[\\/:*?"<>|]/g, " ");
  s = s.replace(/[\s\-_·•]+/g, "-");
  s = s.replace(/^-+|-+$/g, "");
  if (s.length > maxLen) s = s.slice(0, maxLen).replace(/-+$/g, "");
  return s || "insight";
}

export function slugifyCategory(name: string): string {
  return slugify(name, 32);
}
