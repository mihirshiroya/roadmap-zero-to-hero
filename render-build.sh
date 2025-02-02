#!/usr/bin/env bash
# exit on error
set -o errexit

npm install --prefix frontend --include=dev
npm run build --prefix frontend
npm install --prefix backend
cp -r frontend/dist backend/public 