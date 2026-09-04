#!/usr/bin/env python3
"""Mechanical cruft check for this GitBook repository.

Reports
  * pages missing from SUMMARY.md and SUMMARY entries that do not resolve
  * relative links / image references that point at files which do not exist
  * assets under .gitbook/assets (or anywhere else) that no page references
  * byte-identical duplicate assets
  * optionally (--external) external URLs that do not answer 2xx/3xx

Exit status is 1 when anything is found, so it can gate CI.

Usage
  scripts/check-docs.py                 report to stdout
  scripts/check-docs.py --json out.json  also dump the full findings
  scripts/check-docs.py --prune          `git rm` orphaned assets (stages only, never commits)
  scripts/check-docs.py --external       additionally check external URLs (network)
"""
import argparse
import collections
import hashlib
import json
import os
import re
import subprocess
import sys
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP_DIRS = {'.git', 'node_modules', 'scripts'}
NON_FILE_SCHEMES = ('http://', 'https://', 'mailto:', 'tel:', 'data:', 'cid:', '#')


def walk():
    for dp, dn, fn in os.walk(ROOT):
        rel = os.path.relpath(dp, ROOT)
        dn[:] = [d for d in dn if not (rel == '.' and d in SKIP_DIRS)]
        for f in fn:
            yield os.path.normpath(os.path.join(rel, f))


def targets(txt):
    """Yield raw link targets from markdown links and quoted html/liquid attributes."""
    for m in re.finditer(r'''\b(?:src|href|url)\s*=\s*(["'])(.*?)\1''', txt):
        yield m.group(2)
    i = 0
    while True:
        j = txt.find('](', i)
        if j < 0:
            return
        k = j + 2
        if k < len(txt) and txt[k] == '<':          # ](<path with spaces>)
            e = txt.find('>', k)
            if e > 0:
                yield txt[k + 1:e]
            i = k + 1
            continue
        depth, s = 1, k                              # balanced parens: image (43).png
        while k < len(txt) and depth:
            depth += {'(': 1, ')': -1}.get(txt[k], 0)
            k += 1
        yield re.sub(r'\s+"[^"]*"$', '', txt[s:k - 1]).strip()
        i = k


def resolve(page, raw):
    t = urllib.parse.unquote(raw.split('#')[0].split('?')[0])
    if not t:
        return None
    if t.startswith('/'):
        return os.path.normpath(t.lstrip('/'))
    return os.path.normpath(os.path.join(os.path.dirname(page), t))


def scan():
    files = sorted(walk())
    pages = [f for f in files if f.endswith('.md')]
    assets = [f for f in files if not f.endswith('.md')]

    refs = collections.defaultdict(list)     # target -> [(page, raw)]
    external = collections.defaultdict(list)  # url -> [page]
    for p in pages:
        txt = open(os.path.join(ROOT, p), encoding='utf-8', errors='replace').read()
        for raw in targets(txt):
            if raw.startswith(NON_FILE_SCHEMES):
                if raw.startswith('http'):
                    external[raw].append(p)
                continue
            t = resolve(p, raw)
            if t:
                refs[t].append((p, raw))

    summary = {t for t, srcs in refs.items() if t.endswith('.md') and any(s == 'SUMMARY.md' for s, _ in srcs)}
    exists = lambda t: os.path.exists(os.path.join(ROOT, t))
    referenced = set(refs)

    hashes = collections.defaultdict(list)
    for a in assets:
        hashes[hashlib.sha256(open(os.path.join(ROOT, a), 'rb').read()).hexdigest()].append(a)

    return {
        'counts': {'pages': len(pages), 'assets': len(assets),
                   'assets_in_use': sum(a in referenced for a in assets)},
        'missing_in_summary': [p for p in pages if p not in summary and p != 'SUMMARY.md'],
        'summary_broken': sorted(t for t in summary if not exists(t)),
        'broken_refs': [{'target': t, 'pages': sorted({s for s, _ in srcs})}
                        for t, srcs in sorted(refs.items()) if not exists(t) and not os.path.isdir(os.path.join(ROOT, t))],
        'orphan_assets': [a for a in assets if a not in referenced],
        'duplicate_assets': [v for v in hashes.values() if len(v) > 1],
        'external': {u: sorted(set(ps)) for u, ps in external.items()},
    }


def check_external(urls):
    bad = {}
    for u in sorted(urls):
        try:
            req = urllib.request.Request(u, method='HEAD', headers={'User-Agent': 'Mozilla/5.0 (docs-link-check)'})
            code = urllib.request.urlopen(req, timeout=15).status
        except urllib.error.HTTPError as e:
            code = e.code
        except Exception as e:  # noqa: BLE001
            code = type(e).__name__
        if not (isinstance(code, int) and 200 <= code < 400):
            bad[u] = code
    return bad


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--json', metavar='FILE', help='write full findings as JSON')
    ap.add_argument('--prune', action='store_true', help='git rm orphaned assets (stages, does not commit)')
    ap.add_argument('--external', action='store_true', help='also check external URLs (needs network)')
    args = ap.parse_args()

    r = scan()
    size = sum(os.path.getsize(os.path.join(ROOT, a)) for a in r['orphan_assets'])
    c = r['counts']
    print(f"pages {c['pages']}  assets {c['assets']}  in use {c['assets_in_use']}")

    problems = 0
    def section(title, items, fmt=str):
        nonlocal problems
        if not items:
            return
        problems += len(items)
        print(f"\n{title} ({len(items)})")
        for it in items:
            print('  ' + fmt(it))

    section('Pages missing from SUMMARY.md', r['missing_in_summary'])
    section('SUMMARY.md entries that do not resolve', r['summary_broken'])
    section('Broken references', r['broken_refs'], lambda b: f"{b['target']}  <- {', '.join(b['pages'])}")
    section(f'Orphaned assets, {size / 1e6:.1f} MB', r['orphan_assets'])
    section('Duplicate assets (identical content)', r['duplicate_assets'], lambda v: ' == '.join(v))

    if args.external:
        bad = check_external(r['external'])
        r['external_bad'] = bad
        section('External URLs not answering 2xx/3xx', sorted(bad.items()),
                lambda kv: f"{kv[1]}  {kv[0]}  <- {', '.join(r['external'][kv[0]])}")

    if args.json:
        json.dump(r, open(args.json, 'w'), indent=1)

    if args.prune and r['orphan_assets']:
        subprocess.run(['git', 'rm', '-q', '--'] + r['orphan_assets'], cwd=ROOT, check=True)
        print(f"\nstaged removal of {len(r['orphan_assets'])} orphaned assets (not committed)")

    if not problems:
        print('\nclean')
    return 1 if problems else 0


if __name__ == '__main__':
    sys.exit(main())
