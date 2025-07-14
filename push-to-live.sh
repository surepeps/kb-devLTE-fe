#!/bin/bash

echo "🔁 Running git filter-repo cleanup..."

git filter-repo --force --commit-callback '
if commit.author_email == b"builder-bot@builder.io" or commit.author_name == b"Builder.io":
    commit.author_name = b"surepeps"
    commit.author_email = b"gatukurh1@gmail.com"
if commit.committer_email == b"builder-bot@builder.io" or commit.committer_name == b"Builder.io":
    commit.committer_name = b"surepeps"
    commit.committer_email = b"gatukurh1@gmail.com"
if commit.author_email == b"31157177+surepeps@users.noreply.github.com":
    commit.author_email = b"gatukurh1@gmail.com"
    commit.author_name = b"surepeps"
if commit.committer_email == b"31157177+surepeps@users.noreply.github.com":
    commit.committer_email = b"gatukurh1@gmail.com"
    commit.committer_name = b"surepeps"
'

echo "🚀 Pushing cleaned repo to live..."

git push live main --force

echo "✅ Done! Live repo updated without bot authors."
