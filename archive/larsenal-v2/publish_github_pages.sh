#!/usr/bin/env bash
set -euo pipefail

REPO_NAME="${1:-larsenal-codir-prototype}"
VISIBILITY="${2:-public}"

if ! command -v git >/dev/null 2>&1; then
  echo "Erreur : git n'est pas installé." >&2
  exit 1
fi
if ! command -v gh >/dev/null 2>&1; then
  echo "Erreur : GitHub CLI (gh) n'est pas installé ou accessible." >&2
  echo "Installez-le puis lancez : gh auth login" >&2
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Connexion GitHub requise. Lancement de : gh auth login"
  gh auth login
fi

if [ ! -d .git ]; then
  git init -b main
fi

git add .
if ! git diff --cached --quiet; then
  git commit -m "Prototype L'Arsenal — site CODIR"
fi

OWNER="$(gh api user --jq .login)"

if gh repo view "$OWNER/$REPO_NAME" >/dev/null 2>&1; then
  echo "Le dépôt $OWNER/$REPO_NAME existe déjà."
  if ! git remote get-url origin >/dev/null 2>&1; then
    git remote add origin "https://github.com/$OWNER/$REPO_NAME.git"
  fi
  git push -u origin main
else
  gh repo create "$REPO_NAME" --"$VISIBILITY" --source=. --remote=origin --push
fi

# Active GitHub Pages on main/root. If already enabled, update source.
if gh api "repos/$OWNER/$REPO_NAME/pages" >/dev/null 2>&1; then
  gh api -X PUT "repos/$OWNER/$REPO_NAME/pages" \
    -f 'source[branch]=main' \
    -f 'source[path]=/' >/dev/null
else
  gh api -X POST "repos/$OWNER/$REPO_NAME/pages" \
    -f 'source[branch]=main' \
    -f 'source[path]=/' >/dev/null
fi

URL="https://${OWNER}.github.io/${REPO_NAME}/"
echo
echo "Publié."
echo "Dépôt : https://github.com/${OWNER}/${REPO_NAME}"
echo "Site :  ${URL}"
echo "GitHub Pages peut nécessiter 1 à 3 minutes avant le premier affichage."
