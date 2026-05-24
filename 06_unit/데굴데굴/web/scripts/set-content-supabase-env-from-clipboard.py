#!/usr/bin/env python3
"""Update CONTENT_SUPABASE_* in .env.local from Windows clipboard without printing secrets.
Usage: python scripts/set-content-supabase-env-from-clipboard.py CONTENT_SUPABASE_URL
       python scripts/set-content-supabase-env-from-clipboard.py CONTENT_SUPABASE_ANON_KEY
"""
from __future__ import annotations
import subprocess, sys
from pathlib import Path

ALLOWED={"CONTENT_SUPABASE_URL","CONTENT_SUPABASE_ANON_KEY","CONTENT_SUPABASE_SERVICE_ROLE_KEY"}
if len(sys.argv)!=2 or sys.argv[1] not in ALLOWED:
    raise SystemExit("usage: set-content-supabase-env-from-clipboard.py CONTENT_SUPABASE_URL|CONTENT_SUPABASE_ANON_KEY|CONTENT_SUPABASE_SERVICE_ROLE_KEY")
key=sys.argv[1]
try:
    value=subprocess.check_output(["powershell.exe","-NoProfile","-Command","Get-Clipboard -Raw"], text=True, stderr=subprocess.DEVNULL).strip()
except Exception as e:
    raise SystemExit(f"failed to read clipboard: {e}")
if not value:
    raise SystemExit("clipboard is empty")
if key.endswith("URL"):
    from urllib.parse import urlparse

    parsed = urlparse(value)
    if not (parsed.scheme == "https" and parsed.netloc.endswith(".supabase.co")):
        raise SystemExit("clipboard does not look like a Supabase Project URL")
    # Supabase UI sometimes copies the REST endpoint (https://<ref>.supabase.co/rest/v1/).
    # supabase-js expects the project base URL instead.
    value = f"{parsed.scheme}://{parsed.netloc}"
if key.endswith("KEY") and len(value) < 40:
    raise SystemExit("clipboard does not look like a Supabase key")
path=Path('.env.local')
example=Path('.env.local.example')
text=path.read_text(encoding='utf-8', errors='replace') if path.exists() else (example.read_text(encoding='utf-8', errors='replace') if example.exists() else '')
lines=text.splitlines()
found=False
for i,line in enumerate(lines):
    if line.startswith(key+'='):
        lines[i]=key+'='+value
        found=True
        break
if not found:
    if lines and lines[-1].strip(): lines.append('')
    lines.append(key+'='+value)
path.write_text('\n'.join(lines)+'\n', encoding='utf-8')
print(f"updated {key} in .env.local (value not printed)")
