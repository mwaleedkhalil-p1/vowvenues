# Vercel Deployment Guide

## Recent Issues Fixed

### API 500 Errors:
✅ **Fixed**: Database connection error handling
✅ **Fixed**: Missing MONGODB_URI environment variable handling
✅ **Fixed**: Authentication routes error handling
✅ **Fixed**: Session configuration for production

### Image Loading Issues:
✅ **Fixed**: Static asset serving in vercel.json
✅ **Fixed**: Image path routing for venue pictures
✅ **Fixed**: Cache headers for better performance

### Authentication Problems:
✅ **Fixed**: Login/Register error handling
✅ **Fixed**: Database availability checks
✅ **Fixed**: Better error messages for users

## Environment Variables Setup

**CRITICAL**: You must set these environment variables in Vercel:

1. **MONGODB_URI**: Your MongoDB Atlas connection string
   ```
   mongodb+srv://username:password@cluster.mongodb.net/venue-booking?retryWrites=true&w=majority
   ```

2. **SESSION_SECRET**: A secure random string for session encryption
   ```
   your-super-secret-session-key-change-this
   ```

3. **NODE_ENV**: Set to production
   ```
   production
   ```

### How to Set Environment Variables in Vercel:
1. Go to your Vercel project dashboard
2. Settings > Environment Variables
3. Add each variable above
4. Redeploy your application

## MongoDB Atlas Setup (Required)

Your API is failing because you need a MongoDB database:

1. **Create MongoDB Atlas Account**: Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. **Create a Cluster**: Choose the free tier
3. **Create Database User**: Add username/password
4. **Whitelist IP**: Add `0.0.0.0/0` to allow all IPs (or your specific IPs)
5. **Get Connection String**: Replace `<username>` and `<password>` with your credentials
6. **Add to Vercel**: Set as MONGODB_URI environment variable

## Deployment Steps:

1. **Set Environment Variables** (see above)
2. Connect repository to Vercel
3. Configure build settings:
   - Framework Preset: Other
   - Build Command: `npm run vercel-build`
   - Output Directory: `dist`
4. Deploy!

## File Structure After Build:
```
dist/
├── assets/              # JS/CSS bundles
├── hall pictures data/  # Venue images
├── index.html          # Main HTML file
└── *.png, *.svg        # Static assets
```