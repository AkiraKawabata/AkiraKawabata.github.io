#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
build_dir="$repo_root/cv/build"

mkdir -p "$build_dir"

tectonic \
  --outdir "$build_dir" \
  "$repo_root/cv/curriculum_vitae.tex"

cp "$build_dir/curriculum_vitae.pdf" "$repo_root/assets/files/cv_asof_20260401.pdf"
cp "$build_dir/curriculum_vitae.pdf" "$repo_root/assets/files/curriculum_vitae.pdf"
cp "$build_dir/curriculum_vitae.pdf" "$repo_root/html_source_file/assets/files/curriculum_vitae.pdf"
