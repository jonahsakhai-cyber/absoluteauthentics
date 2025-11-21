# 🚀 How to Upload to GitHub - Step by Step

This guide will walk you through uploading your Absolute Authentics website to GitHub.

## 📋 Prerequisites

- GitHub account (free) - Create at [github.com](https://github.com)
- Git installed on your computer

### Check if Git is installed:
```bash
git --version
```

If not installed, download from: https://git-scm.com/downloads

---

## 🎯 OPTION 1: Upload via GitHub Website (EASIEST - No Git Required)

### Step 1: Create New Repository

1. Go to [github.com](https://github.com)
2. Click **"+"** (top right) → **"New repository"**
3. **Repository name:** `absolute-authentics`
4. **Description:** "Premium sports memorabilia e-commerce website"
5. **Public** or **Private** (your choice)
6. **DON'T** check any boxes (no README, .gitignore, license)
7. Click **"Create repository"**

### Step 2: Download Your Files from GenSpark

1. In GenSpark, click the **"Publish"** tab
2. Click **"Download"** or **"Export Project"**
3. Save the ZIP file to your computer
4. Unzip/Extract the files

### Step 3: Upload to GitHub

1. In your new GitHub repository, click **"uploading an existing file"**
2. **Drag and drop** all your project files:
   - `index.html`
   - `store.html`
   - `sell.html`
   - `README.md`
   - `.gitignore`
   - `firebase-config.TEMPLATE.js`
   - `css/` folder (all 12 CSS files)
   - `js/` folder (all 3 JS files)
   - `images/` folder (all images)

3. **Commit message:** "Initial commit - Absolute Authentics website"
4. Click **"Commit changes"**

**✅ DONE! Your code is on GitHub!**

---

## 🎯 OPTION 2: Upload via Git Command Line (PROFESSIONAL METHOD)

### Step 1: Create New Repository on GitHub

Same as Option 1, Step 1 above.

### Step 2: Open Terminal/Command Prompt

**Mac:** Open "Terminal" app  
**Windows:** Open "Git Bash" or "Command Prompt"  
**Linux:** Open Terminal

Navigate to your project folder:
```bash
cd /path/to/your/absolute-authentics/folder
```

### Step 3: Initialize Git Repository

```bash
# Initialize git in your project folder
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Absolute Authentics website"
```

### Step 4: Connect to GitHub

Replace `YOUR_USERNAME` with your actual GitHub username:

```bash
# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/absolute-authentics.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**If prompted for credentials:**
- Username: Your GitHub username
- Password: Use a [Personal Access Token](https://github.com/settings/tokens) (not your password)

**✅ DONE! Your code is on GitHub!**

---

## 🎯 OPTION 3: Use GitHub Desktop (EASIEST GUI METHOD)

### Step 1: Download GitHub Desktop

Download from: https://desktop.github.com/

### Step 2: Sign in to GitHub

Open GitHub Desktop → Sign in with your GitHub account

### Step 3: Create New Repository

1. Click **"File"** → **"New repository"**
2. **Name:** `absolute-authentics`
3. **Local path:** Choose where to save it
4. Click **"Create repository"**

### Step 4: Add Your Files

1. Copy all your website files into the repository folder
2. GitHub Desktop will show all the new files
3. **Summary:** "Initial commit"
4. Click **"Commit to main"**

### Step 5: Publish to GitHub

1. Click **"Publish repository"**
2. Choose Public or Private
3. Click **"Publish repository"**

**✅ DONE! Your code is on GitHub!**

---

## ⚠️ IMPORTANT: Before Uploading

### 1. Create firebase-config.js (DON'T UPLOAD THIS!)

```bash
# Copy the template
cp firebase-config.TEMPLATE.js firebase-config.js

# Edit firebase-config.js with your real Firebase credentials
# This file is in .gitignore and won't be uploaded to GitHub
```

### 2. Verify .gitignore is Working

The `.gitignore` file prevents sensitive files from being uploaded:
- ✅ `firebase-config.js` (your credentials)
- ✅ `node_modules/` (if you use npm)
- ✅ `.env` files
- ✅ OS files (.DS_Store, Thumbs.db)

### 3. Remove Any Sensitive Data

Check these files for personal info before uploading:
- Contact phone numbers
- Email addresses
- API keys

---

## 📁 What Gets Uploaded to GitHub

**✅ These files WILL be uploaded:**
```
absolute-authentics/
├── README.md
├── .gitignore
├── firebase-config.TEMPLATE.js  (template only!)
├── index.html
├── store.html
├── sell.html
├── css/ (all 12 CSS files)
├── js/ (all 3 JS files)
└── images/ (all images)
```

**❌ These files WON'T be uploaded (in .gitignore):**
```
firebase-config.js  (your real credentials)
.DS_Store
node_modules/
.env files
```

---

## 🔐 Security Best Practices

1. **NEVER commit firebase-config.js** - It contains your API keys
2. **Use the TEMPLATE file** - Others can see how to set up, but not your credentials
3. **Enable GitHub 2FA** - Extra security for your account
4. **Use Private repo** - If you want to keep code private (optional)

---

## 🎉 After Upload

### View Your Repository
```
https://github.com/YOUR_USERNAME/absolute-authentics
```

### Clone to Another Computer
```bash
git clone https://github.com/YOUR_USERNAME/absolute-authentics.git
cd absolute-authentics
cp firebase-config.TEMPLATE.js firebase-config.js
# Edit firebase-config.js with your credentials
```

### Make Updates
```bash
# Make changes to files
git add .
git commit -m "Describe what you changed"
git push
```

---

## 🚀 Deploy Your Website

After uploading to GitHub, you can deploy to:

### Option 1: GitHub Pages (Free)
1. Repository → Settings → Pages
2. Source: Deploy from main branch
3. Save
4. Your site: `https://YOUR_USERNAME.github.io/absolute-authentics`

### Option 2: Netlify (Free, Better)
1. Go to [netlify.com](https://netlify.com)
2. "New site from Git"
3. Connect your GitHub repo
4. Deploy!
5. Custom domain supported

### Option 3: Vercel (Free)
1. Go to [vercel.com](https://vercel.com)
2. "Import Project"
3. Connect GitHub repo
4. Deploy!

### Option 4: Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

---

## 🆘 Common Issues

### "Permission denied" error
- You need to set up SSH keys or use Personal Access Token
- Guide: https://docs.github.com/en/authentication

### "Git not found" error
- Install Git from: https://git-scm.com/downloads

### ".gitignore not working"
- Make sure file is named exactly `.gitignore` (with the dot)
- If files already committed, remove them:
  ```bash
  git rm --cached firebase-config.js
  git commit -m "Remove firebase config"
  git push
  ```

### "Large files" error
- GitHub has 100MB file limit
- Check if images are too large
- Use Git LFS for large files: https://git-lfs.github.com/

---

## 📞 Need Help?

- **GitHub Docs:** https://docs.github.com
- **Git Tutorial:** https://www.atlassian.com/git/tutorials
- **GitHub Desktop Guide:** https://docs.github.com/en/desktop

---

## ✅ Checklist

Before uploading, make sure:
- [ ] Created GitHub account
- [ ] Created new repository
- [ ] Removed Shopify/unnecessary files (already done!)
- [ ] Created `.gitignore` file (already done!)
- [ ] Created `firebase-config.TEMPLATE.js` (already done!)
- [ ] Reviewed README.md
- [ ] Removed any sensitive personal data
- [ ] Ready to upload!

**You're all set! Choose your upload method above and go for it!** 🚀
