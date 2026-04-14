#!/bin/bash

# --- Universal Git "Anti-Pusing" Script ---

# Warna buat output biar cakep
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🛠️  Checking Git Environment...${NC}"

# 1. Cek Koneksi Internet
ping -c 1 github.com > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Koneksi mati bre. Cek wifi atau paketan lu.${NC}"
    exit 1
fi

# 2. Cek Kredensial (User & Email)
git_user=$(git config user.name)
if [ -z "$git_user" ]; then
    echo -e "${YELLOW}⚠️  User Git belum di-set.${NC}"
    read -p "Masukin Username Git lu: " new_user
    git config --global user.name "$new_user"
fi

# 3. Cek Remote Origin
if ! git remote | grep -q "origin"; then
    echo -e "${RED}❌ Remote 'origin' gak ketemu!${NC}"
    read -p "Masukin URL Repo GitHub lu: " remote_url
    git remote add origin "$remote_url"
fi

# 4. Ambil Update Terbaru (Pre-check)
echo -e "${YELLOW}🔍 Fetching updates...${NC}"
git fetch origin > /dev/null 2>&1

# 5. Staging & Commit
echo -e "${YELLOW}🚀 Staging files...${NC}"
git add .

echo -e "📝 Pesan commit (Enter buat default):"
read commit_msg
[ -z "$commit_msg" ] && commit_msg="Auto-update: $(date +'%H:%M:%S')"

# Cek apakah ada perubahan buat di-commit
if git diff-index --quiet HEAD --; then
    echo -e "${GREEN}✅ Gak ada perubahan yang perlu di-commit bre.${NC}"
else
    git commit -m "$commit_msg"
fi

# 6. Push Logic & Trouble-shooting
current_branch=$(git branch --show-current)

push_process() {
    echo -e "${YELLOW}📤 Pushing to $current_branch...${NC}"
    
    # Tangkap error message ke variabel
    error_log=$(git push origin "$current_branch" 2>&1)
    exit_code=$?

    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}-----------------------------------${NC}"
        echo -e "${GREEN}✅ BOOM! Berhasil upload, bre.${NC}"
        exit 0
    else
        echo -e "${RED}-----------------------------------${NC}"
        echo -e "${RED}❌ Push Gagal. Deteksi Masalah...${NC}"
        
        # LOGIC HANDLING BERBAGAI ERROR
        if echo "$error_log" | grep -q "rejected"; then
            echo -e "${YELLOW}Masalah: Repo GitHub lebih update (Behind Remote).${NC}"
            echo "Solusi: 1) Pull Rebase (Save) | 2) Force Push (Risky)"
            read -p "Pilihan (1/2): " opt
            if [ "$opt" == "1" ]; then
                git pull --rebase origin "$current_branch"
                push_process # Rekursif: push lagi setelah pull
            else
                git push origin "$current_branch" --force
            fi

        elif echo "$error_log" | grep -q "Permission denied\|fatal: could not read from remote"; then
            echo -e "${RED}Masalah: SSH Key / Token gak valid atau gak ada akses.${NC}"
            echo "Saran: Cek 'git remote -v', ganti ke HTTPS kalo SSH bermasalah."
            
        elif echo "$error_log" | grep -q "remote: error: File .* is 100.00 MB"; then
            echo -e "${RED}Masalah: Ada file kegedean (>100MB). GitHub nolak.${NC}"
            echo "Saran: Pake Git LFS atau hapus file raksasanya dari commit."

        elif echo "$error_log" | grep -q "conflict"; then
            echo -e "${RED}Masalah: Merge Conflict.${NC}"
            echo "Saran: Lu harus beresin manual file yang bentrok, baru commit lagi."

        else
            echo -e "${RED}Error kagak dikenal:${NC}"
            echo "$error_log"
        fi
    fi
}

push_process
