Steps to get error on wrangler 2.0.6

1. npm install
2. npx wrangler dev
3. navigate to "/test.txt" in browser - should work
4. navigate to "/folder/test.txt" - doesn't work
5. navigate to "/folder/test.txt?fix=true" - applys fix (converts backslash to forward slash)



