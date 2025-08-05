# 🚀 Complete Deployment Guide: Replit → GitHub → Netlify

## 📋 Overview

This detailed guide walks you through every step to deploy your Chirpin waitlist project from Replit to Netlify with a custom domain.

## 🔄 Step 1: Export from Replit to GitHub

### What Files to Include vs Exclude

**✅ INCLUDE these files/folders:**
```
client/                    (entire folder)
server/                    (entire folder)
shared/                    (entire folder)
attached_assets/           (entire folder - contains your logo)
components.json
drizzle.config.ts
package-lock.json
postcss.config.js
tailwind.config.ts
tsconfig.json
README.md
netlify.toml
DEPLOYMENT_GUIDE.md
```

**❌ EXCLUDE these Replit-specific files:**
```
.replit
replit.nix
replit.md
```

**🔄 RENAME these files when uploading:**
```
package.external.json  →  package.json
vite.config.netlify.ts →  vite.config.ts
```

### Detailed Transfer Steps

1. **Create GitHub Repository**:
   - Go to [github.com](https://github.com) and sign in
   - Click the green "New" button (or go to github.com/new)
   - Repository name: `chirpin-waitlist` (or your choice)
   - Make it Public (required for free Netlify)
   - ❌ Don't check "Add a README file" (you already have one)
   - ❌ Don't add .gitignore or license (already included)
   - Click "Create repository"

2. **Download Files from Replit**:
   - In Replit, click the three dots menu (⋯) next to any file
   - Select "Download as zip" 
   - Extract the ZIP file on your computer

3. **Prepare Files for GitHub**:
   - Create a new folder on your computer called `chirpin-deployment`
   - Copy ONLY the included files (see list above) to this folder
   - **Important file renames**:
     - Rename `package.external.json` to `package.json`
     - Rename `vite.config.netlify.ts` to `vite.config.ts`
   - Delete any `.replit`, `replit.nix`, or `replit.md` files

4. **Upload to GitHub** (Choose Method A or B):

### Method A: Using GitHub Web Interface (Easier)
   - Go to your new GitHub repository
   - Click "uploading an existing file"
   - Drag and drop your entire `chirpin-deployment` folder contents
   - Write commit message: "Initial commit - Chirpin waitlist app"
   - Click "Commit changes"

### Method B: Using Git Command Line
   ```bash
   cd chirpin-deployment
   git init
   git add .
   git commit -m "Initial commit - Chirpin waitlist app"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/chirpin-waitlist.git
   git push -u origin main
   ```

## 🗄️ Step 2: No Database Setup Needed!

**✅ Your app uses Airtable - no database setup required!**

Your Chirpin app is already configured to use Airtable for data storage. The following environment variables are already set up in your code:
- `AIRTABLE_API_KEY` 
- `AIRTABLE_BASE_ID`

You'll just need to add these to Netlify's environment variables (covered in Step 3).

## 🌐 Step 3: Deploy to Netlify (Detailed)

### Part A: Connect GitHub to Netlify

1. **Sign up for Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "Sign up" 
   - Choose "Sign up with GitHub" (easiest option)
   - Authorize Netlify to access your GitHub account

2. **Create New Site**:
   - Once logged in, click "Add new site" 
   - Select "Import an existing project"
   - Click "Deploy with GitHub"
   - You may need to authorize Netlify again
   - Find and select your `chirpin-waitlist` repository

### Part B: Configure Build Settings

**Netlify will auto-detect most settings, but verify these:**

3. **Build Settings Screen**:
   - **Owner**: Your account (should be pre-selected)
   - **Branch to deploy**: `main` (should be auto-detected)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/public`
   - **Functions directory**: `dist`

4. **Advanced Settings** (click "Show advanced"):
   - **Base directory**: (leave empty)
   - **Environment variables**: Add these now or later (see next step)

5. **Click "Deploy site"** 
   - Netlify will start building your site
   - This takes 2-5 minutes
   - You'll see a build log with progress

### Part C: Set Environment Variables

6. **Add Your Airtable Credentials**:
   - While build is running, click "Site settings" 
   - Go to "Environment variables" in left sidebar
   - Click "Add a variable"
   
   **Add these exact variables:**
   ```
   Variable 1:
   Key: AIRTABLE_API_KEY
   Value: pat8GgAc4MtddWSWC.113a14efd451f52afdf6a3446c4efe7f886c4afc781a920bf06924eb0319c441
   
   Variable 2:  
   Key: AIRTABLE_BASE_ID
   Value: appyLuiym3lQQD9Im
   
   Variable 3:
   Key: NODE_ENV
   Value: production
   ```

7. **Trigger Rebuild**:
   - Go back to "Deploys" tab
   - Click "Trigger deploy" → "Deploy site"
   - This rebuilds with your environment variables

### Part D: Custom Domain Setup

8. **Wait for Deploy to Complete**:
   - Your site will get a temporary URL like: `https://amazing-cupcake-123456.netlify.app`
   - Test this URL first to make sure everything works

9. **Add Custom Domain**:
   - In Site settings, go to "Domain management"
   - Click "Add custom domain"
   - Enter your domain (e.g., `chirpin.com` or `www.chirpin.com`)
   - Click "Verify"

10. **Configure DNS** (at your domain registrar):
    
    **For apex domain (chirpin.com):**
    ```
    Type: A
    Name: @ (or leave blank)
    Value: 75.2.60.5
    ```
    
    **For www subdomain (www.chirpin.com):**  
    ```
    Type: CNAME
    Name: www
    Value: amazing-cupcake-123456.netlify.app
    ```
    
    **For both (recommended):**
    Add both records above, then in Netlify:
    - Set primary domain to your preference
    - Enable "Redirect automatically" for the other

11. **Enable HTTPS**:
    - In Domain management, scroll to "HTTPS"
    - Click "Verify DNS configuration" 
    - Once verified, click "Provision certificate"
    - This takes 5-10 minutes

### Method 2: Manual Upload

1. **Build locally**:
   ```bash
   npm install
   npm run build
   ```

2. **Upload to Netlify**:
   - Drag and drop `dist/public` folder to Netlify
   - Configure serverless functions separately

## ⚙️ Step 4: Final Configuration

### Database Migration
After deployment, run:
```bash
npm run db:push
```

### Environment Variables Needed
```
AIRTABLE_API_KEY=pat8GgAc4MtddWSWC.113a14efd451f52afdf6a3446c4efe7f886c4afc781a920bf06924eb0319c441
AIRTABLE_BASE_ID=appyLuiym3lQQD9Im
NODE_ENV=production
```

### Netlify Settings
The `netlify.toml` file I created handles:
- Build configuration
- Function routing
- SPA redirects
- CORS headers

## 🔧 File Changes Made for External Deployment

### New Files Created:
- `netlify.toml` - Netlify configuration
- `package.external.json` - Clean package.json without Replit dependencies
- `vite.config.netlify.ts` - Clean Vite config
- `server/netlify-functions.ts` - Serverless function handler
- `.gitignore` - Proper Git ignore rules
- `DEPLOYMENT_GUIDE.md` - This guide

### Files to Remove:
- `.replit`
- `replit.nix`
- Any Replit-specific references

## 🚨 Important Notes

1. **Database**: Your PostgreSQL database needs to be accessible from Netlify. Local databases won't work.

2. **Assets**: The `attached_assets` folder contains your Chirpin logo. Ensure it's included in the deployment.

3. **Environment Variables**: Never commit your `DATABASE_URL` to GitHub. Always use Netlify's environment variable settings.

4. **CORS**: The Netlify function includes CORS headers for cross-origin requests.

## 🧪 Testing

1. **Local testing before deployment**:
   ```bash
   npm install
   npm run build
   npm run start
   ```

2. **Test the deployed site**:
   - Visit your Netlify URL
   - Test the waitlist form
   - Check that data saves to your database

## 🔍 Troubleshooting

### Common Issues and Solutions:

**❌ Build Fails with "npm: command not found"**
- Solution: Netlify needs Node.js version specified
- In Site settings → Environment variables, add:
  - Key: `NODE_VERSION`, Value: `18.17.0`

**❌ Build Fails with "Package not found"**
- Check that you renamed `package.external.json` to `package.json`
- Verify all dependencies are listed in package.json

**❌ Functions Return 404 Errors**
- Verify `netlify.toml` file is in your repository root
- Check Functions directory is set to `dist` in build settings
- Look at Functions tab in Netlify dashboard for error logs

**❌ Forms Don't Submit (Network Errors)**  
- Check environment variables are set correctly in Netlify
- Verify Airtable API key has write permissions
- Test Airtable connection in Netlify function logs

**❌ CSS/Styling Issues**
- Clear browser cache and hard refresh (Ctrl+F5)
- Check if Tailwind CSS built correctly in build logs
- Verify `tailwind.config.ts` is included in repository

**❌ Images Don't Load**
- Ensure `attached_assets` folder is included in upload
- Check image paths use correct import syntax
- Verify images are referenced in the code correctly

**❌ Custom Domain Not Working**
- Wait 24-48 hours for DNS propagation
- Double-check DNS records at your domain registrar
- Use DNS checker tools to verify configuration
- In Netlify, check Domain management for status

## 📞 Getting Help

### Where to Find Logs:
1. **Netlify Build Logs**: Site dashboard → Deploys → (click latest deploy)
2. **Function Logs**: Site dashboard → Functions → (click function name)
3. **Browser Console**: Press F12 → Console tab (for frontend errors)

### Quick Checklist Before Asking for Help:
- ✅ All files uploaded to GitHub correctly
- ✅ `package.external.json` renamed to `package.json`  
- ✅ `vite.config.netlify.ts` renamed to `vite.config.ts`
- ✅ Environment variables set in Netlify
- ✅ Build completed successfully
- ✅ Functions deployed without errors

### Step-by-Step Summary:
1. **Upload to GitHub** (exclude .replit files, rename package files)
2. **Connect to Netlify** (import from GitHub)
3. **Set build settings** (build: `npm run build`, publish: `dist/public`)
4. **Add environment variables** (Airtable keys)
5. **Test with temporary URL** (make sure forms work)
6. **Add custom domain** (in Domain management)
7. **Configure DNS** (A record + CNAME at your registrar)
8. **Enable HTTPS** (provision SSL certificate)

**Your Chirpin waitlist site will be live with full form functionality! 🎉**

Expected timeline: 30-60 minutes total (most time is waiting for DNS propagation)