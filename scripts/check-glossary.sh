#!/usr/bin/env sh
# Checks these docs against the glossary in heisenware-cloud: words the
# glossary rules out ("backend builder", "tenant", …) are reported with
# file and line. Deliberate exceptions live in heisenware-cloud's
# docs/glossary.allow, with paths prefixed "docs:".
#
# Usage: scripts/check-glossary.sh [--summary] [--cloud <heisenware-cloud checkout>]
# Exit status is 1 when anything is found, so it can gate CI.
set -e
DOCS=$(cd "$(dirname "$0")/.." && pwd)
CLOUD="$DOCS/../heisenware-cloud"
ARGS=""
while [ $# -gt 0 ]; do
  case "$1" in
    --cloud) CLOUD="$2"; shift 2 ;;
    *) ARGS="$ARGS $1"; shift ;;
  esac
done
if [ ! -f "$CLOUD/scripts/check-glossary.js" ]; then
  echo "check-glossary: no heisenware-cloud checkout at $CLOUD (use --cloud <path>)" >&2
  exit 2
fi
exec node "$CLOUD/scripts/check-glossary.js" --docs "$DOCS" $ARGS
