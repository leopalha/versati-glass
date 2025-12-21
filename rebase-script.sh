#!/bin/bash
# Script to remove sensitive files from specific commits

# For commit c0800a8
GIT_SEQUENCE_EDITOR="sed -i 's/^pick c0800a8/edit c0800a8/'" git rebase -i bcfbd04

# Remove the files
git rm --cached .env.production .env.vercel-check CONFIGURAR_DOMINIO_VERCEL.md
git commit --amend --no-edit
git rebase --continue

# For commit aed5881
GIT_SEQUENCE_EDITOR="sed -i 's/^pick aed5881/edit aed5881/'" git rebase -i bcfbd04
git rm --cached .env.vercel-check
git commit --amend --no-edit
git rebase --continue
