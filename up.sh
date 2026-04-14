#!/bin/bash

# --- Simple GitHub Uploader by Gemini ---

# Cek apakah folder ini udah ada .git atau belum
if [ ! -d ".git" ]; then
    echo "⚠️  Wah bre, folder ini belum di-init git."
    read -p "Mau sekalian di-init? (y/n): " init_choice
    if [ "$init_choice" = "y" ]; then
        git init
        echo "✅ Git initialized."
    else
        echo "❌ Proses dibatalkan."
        exit 1
    fi
fi

# 1. Add all files
echo "🚀 Menambahkan file ke staging area..."
git add .

# 2. Input Commit Message
echo "📝 Masukin pesan commit lu (Contoh: 'update fitur login'):"
read commit_msg

if [ -z "$commit_msg" ]; then
    commit_msg="Update via Script"
    echo "💡 Pesan kosong, otomatis pake: '$commit_msg'"
fi

git commit -m "$commit_msg"

# 3. Check & Input Branch
current_branch=$(git branch --show-current)
read -p "🎯 Lu mau push ke branch mana? (Default: $current_branch): " target_branch

if [ -z "$target_branch" ]; then
    target_branch=$current_branch
fi

# 4. Push to GitHub
echo "📤 Lagi proses upload ke branch $target_branch..."
git push origin "$target_branch"

if [ $? -eq 0 ]; then
    echo "-----------------------------------"
    echo "✅ Berhasil bre! Project lu udah aman di GitHub."
else
    echo "-----------------------------------"
    echo "❌ Ada error pas push. Cek koneksi atau remote origin-nya ya."
fi
