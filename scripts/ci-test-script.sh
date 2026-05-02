#!/bin/bash

echo "=== OasisBio CI Test Script ==="
echo "Running on: $(date)"
echo ""

echo "1. Running linting..."
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Linting failed"
  exit 1
fi
echo "✅ Linting passed"
echo ""

echo "2. Running tests..."
npm test
if [ $? -ne 0 ]; then
  echo "❌ Tests failed"
  exit 1
fi
echo "✅ Tests passed"
echo ""

echo "3. Building project..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Build failed"
  exit 1
fi
echo "✅ Build passed"
echo ""

echo "=== All CI checks passed! ==="