#!/bin/bash

# Script per costruire la versione embeddable del chatbot

echo "Building embeddable chatbot..."
npx vite build --config vite.embed.config.ts

echo "Build completed! Files available in dist/embed/"
echo "Instructions for embedding the chatbot:"
echo "1. Include the script in your website:"
echo "   <script src=\"path/to/marina-chatbot.umd.js\"></script>"
echo "2. Add the necessary HTML:"
echo "   <div id=\"marina-chatbot\"></div>"
echo "3. Initialize the chatbot:"
echo "   <script>"
echo "     MarinaChatbot.init({ persistSession: true });"
echo "   </script>"