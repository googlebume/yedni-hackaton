#!/bin/bash

# Vercel Deployment Checklist for Yedno

echo "🚀 Vercel Deployment Preparation"
echo "=================================="
echo ""

# 1. Git preparation
echo "✓ Step 1: Committing changes to Git..."
git add .
git commit -m "Prepare for Vercel deployment - configure API routes and build" || echo "Nothing to commit"
git push origin main

echo ""
echo "✓ Step 2: Project is ready for Vercel!"
echo ""
echo "Next steps:"
echo "1. Go to https://vercel.com"
echo "2. Click 'New Project'"
echo "3. Select 'yedno-hackaton' repository"
echo "4. Use these settings:"
echo "   - Framework Preset: Other"
echo "   - Build Command: npm run build"
echo "   - Output Directory: (leave empty)"
echo "   - Install Command: npm install"
echo "5. Click 'Deploy'"
echo ""
echo "Your project will be available at: https://yedno.vercel.app (or similar)"
echo ""
echo "For more details, see: VERCEL_DEPLOYMENT.md"
